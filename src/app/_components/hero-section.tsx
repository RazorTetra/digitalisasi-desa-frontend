// src/app/(main)/_components/hero-section.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useHeroBanner } from "@/hooks/use-hero-banner";

interface HeroSectionProps {
  slides: string[];
}

export function HeroSection({ slides }: HeroSectionProps): JSX.Element {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { data: heroBanner } = useHeroBanner();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative h-[60vh] min-h-[500px] flex items-center">
      <div className="absolute inset-0 z-0">
        {heroBanner?.imageUrl ? (
          <>
            {/* Loading skeleton */}
            <div 
              className={`absolute inset-0 bg-muted/30 animate-pulse transition-opacity duration-500 ease-in-out ${
                imageLoaded ? 'opacity-0' : 'opacity-100'
              }`}
            />
            
            {/* Background image with fade-in effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: imageLoaded ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={heroBanner.imageUrl}
                alt="Desa Tandengan"
                fill
                priority
                sizes="100vw"
                className="object-cover"
                onLoadingComplete={() => setImageLoaded(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
            </motion.div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-background to-background/60" />
        )}
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="max-w-2xl space-y-6">
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentSlide}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground"
            >
              {slides[currentSlide]}
            </motion.h1>
          </AnimatePresence>
          <p className="text-lg md:text-xl text-muted-foreground">
            Akses layanan desa kapanpun dan dimanapun. Kami berkomitmen
            memberikan pelayanan publik yang efisien, transparan, dan inovatif
            untuk kesejahteraan masyarakat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="text-lg" asChild>
              <Link href="/kirim-surat">
                Ajukan Surat Online
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg" asChild>
              <Link href="/informasi-desa">Tentang Desa</Link>
            </Button>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            const servicesSection = document.getElementById("layanan-section");
            servicesSection?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <ChevronDown className="h-8 w-8" />
        </Button>
      </motion.div>
    </section>
  );
}