// First, create the RecommendationSticker component in a separate file
// RecommendationSticker.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { HiSparkles } from "react-icons/hi2";

const RecommendationSticker = ({ onClick }) => {
  return (
    <motion.div
      className="fixed bottom-6 left-6 z-50 cursor-pointer"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 1.5
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {/* Outer glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 opacity-75 blur-md"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.75, 0.5, 0.75]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Main sticker body */}
      <div className="relative w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 shadow-2xl flex items-center justify-center overflow-hidden">
        {/* Animated background shine */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: [-100, 100],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-white">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <HiSparkles className="text-xl mb-1" />
          </motion.div>
          <span className="text-xs font-bold tracking-tight">FOR YOU</span>
        </div>
      </div>
      
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-300 rounded-full"
          style={{
            top: `${Math.random() * 80}px`,
            left: `${Math.random() * 80}px`,
          }}
          animate={{
            y: [-20, -40, -20],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Pulse rings */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-white/30"
        animate={{
          scale: [1, 1.5, 2],
          opacity: [0.8, 0.3, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut"
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-white/20"
        animate={{
          scale: [1, 1.8, 2.5],
          opacity: [0.6, 0.2, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
          delay: 0.5
        }}
      />
    </motion.div>
  );
};

export default RecommendationSticker;

