
import { motion } from "framer-motion";

export function AnimatedLogo() {
  return (
    <motion.div
      className="relative w-12 h-12 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Outer glow */}
      <motion.div
        className="absolute w-full h-full rounded-full bg-purple-500/10"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.3, 0.5]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      />

      {/* Moving particles */}
      <motion.div
        className="absolute w-10 h-10 rounded-full border border-purple-300/20"
        animate={{ 
          rotate: 360,
          scale: [0.9, 1.1, 0.9]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />

      <motion.div
        className="absolute w-6 h-6 rounded-full border border-purple-400/30"
        animate={{ 
          rotate: -360,
          scale: [1.1, 0.9, 1.1] 
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />

      {/* Core sphere */}
      <motion.div
        className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
        animate={{ 
          scale: [1, 1.05, 1],
          boxShadow: [
            "0 0 10px 0 rgba(168, 85, 247, 0.4)",
            "0 0 20px 0 rgba(168, 85, 247, 0.6)",
            "0 0 10px 0 rgba(168, 85, 247, 0.4)"
          ]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <motion.div 
          className="w-4 h-4 bg-purple-300/60 rounded-full"
          animate={{ 
            scale: [1, 0.8, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      </motion.div>
    </motion.div>
  );
}
