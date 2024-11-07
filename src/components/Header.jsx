import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FiLogOut } from 'react-icons/fi';

const Header = ({ onLogout }) => {
  return (
    <header className="py-6 px-4 bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              <h1 className="text-5xl font-bold bg-gradient-orange text-transparent bg-clip-text">
                सारांश
              </h1>
            </motion.div>
            <div className="h-8 w-px bg-gradient-orange opacity-30" />
            <span className="text-lg text-gray-600">
              AI-Powered Call Summarizer
            </span>
          </motion.div>
        </Link>

        {onLogout && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogout}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-sarangsh-orange transition-colors"
            title="Remove API Key"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Remove API Key</span>
          </motion.button>
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  onLogout: PropTypes.func
};

export default Header;
