// src/app/(main)/informasi-desa/_components/GalleryView.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "@/api/villageApi";

interface GalleryViewProps {
  images: GalleryImage[];
}

interface SelectedImage {
  image: GalleryImage;
  index: number;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);

  const handleImageNavigation = (direction: "prev" | "next") => {
    if (!selectedImage) return;

    const currentIndex = selectedImage.index;
    const newIndex =
      direction === "prev"
        ? Math.max(0, currentIndex - 1)
        : Math.min(images.length - 1, currentIndex + 1);

    setSelectedImage({
      image: images[newIndex],
      index: newIndex,
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
            onClick={() => setSelectedImage({ image, index })}
          >
            <Image
              src={image.imageUrl}
              alt={image.description || "Gambar Desa"}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 hover:scale-110"
            />
            {image.description && (
              <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2">
                <p className="text-white text-sm truncate">
                  {image.description}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <Dialog
        open={selectedImage !== null}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-[90vw] h-[90vh] p-0">
          {selectedImage && (
            <div className="relative w-full h-full">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-50"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="relative w-full h-full">
                <Image
                  src={selectedImage.image.imageUrl}
                  alt={selectedImage.image.description || "Gallery image"}
                  fill
                  sizes="90vw"
                  priority
                  className="object-contain"
                />
              </div>
              {selectedImage.index > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2"
                  onClick={() => handleImageNavigation("prev")}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
              )}
              {selectedImage.index < images.length - 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => handleImageNavigation("next")}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              )}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white">
                {selectedImage.index + 1} / {images.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};