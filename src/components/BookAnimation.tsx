import { motion } from "framer-motion"
import Loader from "./Loader"

// Main Book Animation Component
const BookAnimation: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <motion.h2 
          className="text-4xl font-bold text-vedic-gold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          📚 Rig Veda Book Viewer
        </motion.h2>
        <motion.p 
          className="text-xl text-vedic-light/80 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Navigate through the 10 Mandalas of Rig Veda with this interactive book viewer. Use arrow keys or buttons to flip pages.
        </motion.p>
      </div>
      
      <div className="bg-vedic-deep/30 rounded-xl p-8 border border-vedic-gold/20">
        <Loader />
      </div>
    </div>
  );
};

export default BookAnimation;