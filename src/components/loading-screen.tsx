// src/components/loading-screen.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    // Simulasi minimum loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Handle exit animation completion
  const handleExitComplete = () => {
    setShowContent(false);
  };

  if (!showContent) return null;

  return (
    <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.8,
              ease: "easeInOut",
              when: "afterChildren",
            },
          }}
        >
          {/* Overlay Animation */}
          <motion.div
            className="absolute inset-0 bg-primary/5"
            initial={{ scaleY: 1 }}
            exit={{
              scaleY: 0,
              transition: {
                duration: 0.8,
                ease: [0.65, 0, 0.35, 1],
              },
            }}
            style={{ originY: 0 }}
          />

          <div className="relative w-40 h-40">
            {/* 3D Cube Loading Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{
                scale: 1,
                rotate: 0,
                transition: {
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              exit={{
                scale: 0,
                rotate: 45,
                transition: {
                  duration: 0.5,
                  ease: [0.65, 0, 0.35, 1],
                },
              }}
            >
              <svg
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <defs>
                  <linearGradient
                    id="cubeGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      className="text-primary"
                      style={{ stopColor: "currentColor", stopOpacity: 1 }}
                    />
                    <stop
                      offset="100%"
                      className="text-primary"
                      style={{ stopColor: "currentColor", stopOpacity: 0.6 }}
                    />
                  </linearGradient>
                </defs>

                {/* Front face */}
                <motion.path
                  d="M 20 20 L 80 20 L 80 80 L 20 80 Z"
                  fill="url(#cubeGradient)"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    rotateY: [0, 180],
                    rotateX: [0, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Right face */}
                <motion.path
                  d="M 80 20 L 95 35 L 95 95 L 80 80 Z"
                  fill="url(#cubeGradient)"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    rotateY: [0, -180],
                    rotateX: [0, -360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.2,
                  }}
                />

                {/* Top face */}
                <motion.path
                  d="M 20 20 L 80 20 L 95 35 L 35 35 Z"
                  fill="url(#cubeGradient)"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    rotateY: [0, 180],
                    rotateX: [0, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.4,
                  }}
                />
              </svg>
            </motion.div>

            {/* Loading Text dengan Staggered Letters */}
            <motion.div
              className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-1"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
                exit: {
                  opacity: 0,
                  transition: {
                    staggerChildren: 0.05,
                    staggerDirection: -1,
                  },
                },
              }}
            >
              {["L", "o", "a", "d", "i", "n", "g", ".", ".", "."].map(
                (letter, i) => (
                  <motion.span
                    key={i}
                    className="text-lg font-medium text-primary"
                    variants={{
                      hidden: {
                        opacity: 0,
                        y: 20,
                      },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          ease: [0.22, 1, 0.36, 1],
                        },
                      },
                      exit: {
                        opacity: 0,
                        y: -20,
                        transition: {
                          ease: [0.65, 0, 0.35, 1],
                        },
                      },
                    }}
                  >
                    {letter}
                  </motion.span>
                )
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
