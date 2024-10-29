// src/app/admin/village/village-structure/_hooks/useVillageStructure.ts
import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  getVillageStructure,
  createVillageStructure,
  updateVillageStructure,
  deleteVillageStructure,
  VillageStructure,
} from "@/api/villageApi";

// Extended structure type with level for internal ordering
export interface StructureWithLevel extends VillageStructure {
  level: number;
}

export type SortConfig = {
  key: keyof StructureWithLevel;
  direction: "asc" | "desc";
};

export const useVillageStructure = () => {
  const { toast } = useToast();
  const [structures, setStructures] = useState<StructureWithLevel[]>([]);
  const [filteredStructures, setFilteredStructures] = useState<
    StructureWithLevel[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "level",
    direction: "asc",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const inferLevel = (position: string): number => {
    position = position.toLowerCase().trim();
    if (position.includes("hukum tua")) return 1;
    if (position.includes("sekretaris desa")) return 2;
    if (position.includes("kaur")) return 3;
    if (position.includes("kasi")) return 4;
    // For other positions, find the maximum level and add 1
    const maxLevel = Math.max(...structures.map((s) => s.level), 4);
    return maxLevel + 1;
  };

  const loadStructures = useCallback(async () => {
    try {
      const data = await getVillageStructure();
      const structuresWithLevels = data.map((structure) => ({
        ...structure,
        level: inferLevel(structure.position),
      }));
      setStructures(structuresWithLevels);
      setFilteredStructures(structuresWithLevels);
    } catch (error) {
      console.error("Error loading structures:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat data struktur desa",
      });
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);

  useEffect(() => {
    loadStructures();
  }, [loadStructures]);

  // Filter structures based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStructures(structures);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = structures.filter(
      (structure) =>
        structure.name.toLowerCase().includes(query) ||
        structure.position.toLowerCase().includes(query)
    );
    setFilteredStructures(filtered);
  }, [searchQuery, structures]);

  const addStructure = async (
    data: Pick<VillageStructure, "position" | "name">
  ) => {
    setIsSubmitting(true);
    try {
      const newStructure = await createVillageStructure(data);
      const withLevel: StructureWithLevel = {
        ...newStructure,
        level: inferLevel(data.position),
      };
      setStructures((prev) => [...prev, withLevel]);
      setFilteredStructures((prev) => [...prev, withLevel]);
      toast({
        title: "Berhasil",
        description: "Data struktur desa berhasil ditambahkan",
      });
      return true;
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menambah data struktur desa",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStructure = async (
    id: string,
    data: Pick<VillageStructure, "position" | "name">
  ) => {
    setIsSubmitting(true);
    try {
      const updatedStructure = await updateVillageStructure(id, data);
      const withLevel: StructureWithLevel = {
        ...updatedStructure,
        level: inferLevel(data.position),
      };

      const updateState = (items: StructureWithLevel[]) =>
        items.map((s) => (s.id === id ? withLevel : s));

      setStructures(updateState);
      setFilteredStructures(updateState);

      toast({
        title: "Berhasil",
        description: "Data struktur desa berhasil diperbarui",
      });
      return true;
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memperbarui data struktur desa",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteStructure = async (id: string) => {
    try {
      await deleteVillageStructure(id);
      const filterState = (items: StructureWithLevel[]) =>
        items.filter((s) => s.id !== id);

      setStructures(filterState);
      setFilteredStructures(filterState);

      toast({
        title: "Berhasil",
        description: "Data struktur desa berhasil dihapus",
      });
      return true;
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menghapus data struktur desa",
      });
      return false;
    }
  };

  const handleSort = (key: keyof StructureWithLevel) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortedStructures = () => {
    return [...filteredStructures].sort((a, b) => {
      if (sortConfig.key === "level") {
        return sortConfig.direction === "asc"
          ? a.level - b.level
          : b.level - a.level;
      }

      const comparison = String(a[sortConfig.key]).localeCompare(
        String(b[sortConfig.key])
      );
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  };

  return {
    structures: getSortedStructures(),
    isLoading,
    isSubmitting,
    sortConfig,
    searchQuery,
    setSearchQuery,
    loadStructures,
    addStructure,
    updateStructure,
    deleteStructure,
    handleSort,
  };
};
