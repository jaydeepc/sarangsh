import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="py-6 px-4 bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto">
        <Link to="/">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                <h1 className="text-5xl font-bold bg-gradient-orange text-transparent bg-clip-text tracking-wider">
                  सारांश
                </h1>
              </motion.div>
              <div className="h-8 w-px bg-gradient-orange opacity-30" />
              <span className="text-lg text-gray-600">
                AI-Powered Call Summarizer
              </span>
            </div>
          </motion.div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
