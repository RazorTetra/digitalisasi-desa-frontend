// src/app/(main)/informasi-desa/_components/OrganizationChart.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { VillageStructure } from '@/api/villageApi';

interface NodeProps {
  title: string;
  name: string;
  className?: string;
}

const Node: React.FC<NodeProps> = ({ title, name, className }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex flex-col items-center p-2 min-w-[120px]",
              className
            )}
          >
            <Avatar className="h-12 w-12 border-2 border-primary shadow-lg mb-2">
              <AvatarFallback className="bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="font-medium text-sm text-primary">{title}</p>
              <p className="text-xs text-muted-foreground">{name}</p>
            </div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-semibold">{name}</p>
            <p className="text-muted-foreground">{title}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface OrganizationChartProps {
  structures: VillageStructure[];
}

interface StructureWithLevel extends VillageStructure {
  level: string;
}

export const OrganizationChart: React.FC<OrganizationChartProps> = ({ structures }) => {
  // First, add level to each structure based on position name
  const structuresWithLevel: StructureWithLevel[] = structures.map(structure => {
    const pos = structure.position.toLowerCase();

    // Default level determination (can be removed once level is properly set from backend)
    let level = '1';
    if (pos.includes('sekretaris')) level = '2';
    else if (pos.includes('kaur')) level = '3';
    else if (pos.includes('kasi')) level = '4';
    else if (pos.includes('jaga')) level = '5';
    else if (pos.includes('maweteng')) level = '6';

    return {
      ...structure,
      level
    };
  });

  // Group structures by their level
  const groupedStructures = structuresWithLevel.reduce((acc, structure) => {
    if (!acc[structure.level]) {
      acc[structure.level] = [];
    }
    acc[structure.level].push(structure);
    return acc;
  }, {} as Record<string, StructureWithLevel[]>);

  // Sort levels numerically
  const sortedLevels = Object.keys(groupedStructures).sort((a, b) => 
    parseInt(a) - parseInt(b)
  );

  // Calculate vertical spacing based on number of levels
  const levelSpacing = 100 / (sortedLevels.length + 1);

  return (
    <Card className="bg-card w-full overflow-x-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Struktur Organisasi Desa</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="min-w-[900px] relative">
          {/* Connection lines */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width="100%"
            height="100%"
            style={{ zIndex: 0 }}
          >
            <line 
              x1="50%" 
              y1="10%" 
              x2="50%" 
              y2="90%" 
              stroke="currentColor" 
              strokeOpacity="0.2" 
              strokeWidth="2" 
              strokeDasharray="4" 
            />
            {sortedLevels.map((_, idx) => (
              <line
                key={idx}
                x1="10%"
                y1={`${levelSpacing + (idx * levelSpacing)}%`}
                x2="90%"
                y2={`${levelSpacing + (idx * levelSpacing)}%`}
                stroke="currentColor"
                strokeOpacity="0.2"
                strokeWidth="2"
                strokeDasharray="4"
              />
            ))}
          </svg>

          {/* Organization Structure */}
          <div className="relative z-10 space-y-16">
            {sortedLevels.map((level) => (
              <div 
                key={level}
                className="flex justify-center gap-4"
              >
                {groupedStructures[level].sort((a, b) => {
                  const aNum = parseInt(a.position.match(/\d+/)?.[0] || '0');
                  const bNum = parseInt(b.position.match(/\d+/)?.[0] || '0');
                  return aNum - bNum;
                }).map(position => (
                  <Node
                    key={position.id}
                    title={position.position}
                    name={position.name}
                    className={parseInt(level) === 1 ? "bg-primary/5 rounded-lg" : ""}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};