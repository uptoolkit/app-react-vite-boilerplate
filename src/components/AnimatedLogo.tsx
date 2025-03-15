
import { motion } from "framer-motion";

export function AnimatedLogo() {
  return (
    <motion.div
      className="relative w-12 h-12 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="absolute w-full h-full rounded-full border-t-2 border-r-2 border-primary"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-8 h-8 rounded-full border-b-2 border-l-2 border-primary/70"
        animate={{ rotate: -360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-2 h-2 bg-primary rounded-full" />
      </motion.div>
    </motion.div>
  );
}
