import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import Header from './components/Header';
import Home from './pages/Home';
import Summary from './pages/Summary';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

const PageWrapper = ({ children }) => (
  <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageVariants}
    transition={pageTransition}
  >
    {children}
  </motion.div>
);

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-sarangsh-light">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <Routes>
              <Route 
                path="/" 
                element={
                  <PageWrapper>
                    <Home />
                  </PageWrapper>
                } 
              />
              <Route 
                path="/summary" 
                element={
                  <PageWrapper>
                    <Summary />
                  </PageWrapper>
                } 
              />
            </Routes>
          </AnimatePresence>
        </main>
        
        {/* Animated background gradient */}
        <div className="fixed inset-0 -z-10 animated-bg" />
      </div>
    </Router>
  );
}

export default App;
