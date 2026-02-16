/* import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Portfolio } from './components/Portfolio';
import { Services } from './components/Services';
import { Approach } from './components/Approach';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Portfolio />
        <Services />
        <Approach />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb } from 'lucide-react';
import Lottie from 'lottie-react';
import hummingbirdAnimation from '@/assets/animations/HummingBirdTest.json';

export default function App() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-1000 ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
      {/* Light overlay effect */}
      <AnimatePresence>
        {!isDark && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-yellow-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Dark overlay effect */}
      <AnimatePresence>
        {isDark && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-br from-gray-900 via-[#0a0a0a] to-black pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Flickering light effect when switching */}
      <motion.div
        key={isDark ? 'dark' : 'light'}
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="absolute inset-0 bg-black pointer-events-none"
      />

      {/* Hummingbird animation */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute top-10 left-10 md:top-20 md:left-20 w-32 h-32 md:w-40 md:h-40 z-20"
      >
        <Lottie 
          animationData={hummingbirdAnimation}
          loop={true}
          autoplay={true}
        />
      </motion.div>

      <div className="relative z-10 text-center px-6">
        {/* Main text with glow effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.h1
            animate={{
              textShadow: isDark 
                ? '0 0 20px rgba(255, 255, 255, 0.3)'
                : '0 0 0px rgba(0, 0, 0, 0)'
            }}
            transition={{ duration: 0.8 }}
            className={`text-7xl md:text-9xl !font-light tracking-tight transition-colors duration-1000 ${
              isDark ? 'text-white' : 'text-black'
            }`}
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Coming Soon
          </motion.h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`mt-8 text-lg md:text-xl tracking-widest transition-colors duration-1000 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}
          style={{ fontFamily: 'Georgia, serif' }}
        >
          jointambitions.com
        </motion.p>

        {/* Light switch button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          onClick={toggleTheme}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`mt-16 p-6 rounded-full transition-all duration-500 ${
            isDark 
              ? 'bg-white/10 hover:bg-white/20 backdrop-blur-sm' 
              : 'bg-black/5 hover:bg-black/10'
          } border ${
            isDark ? 'border-white/20' : 'border-black/10'
          }`}
        >
          <motion.div
            animate={{
              rotate: isDark ? 0 : 180,
              filter: isDark 
                ? 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))' 
                : 'drop-shadow(0 0 0px rgba(0, 0, 0, 0))'
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <Lightbulb 
              className={`w-8 h-8 transition-colors duration-500 ${
                isDark ? 'text-yellow-300' : 'text-gray-600'
              }`}
              fill={isDark ? 'currentColor' : 'none'}
            />
          </motion.div>
        </motion.button>

        {/* Hint text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className={`mt-6 text-xs tracking-widest uppercase transition-colors duration-1000 ${
            isDark ? 'text-gray-600' : 'text-gray-400'
          }`}
        >
          Click to switch
        </motion.p>
      </div>

      {/* Ambient light effect */}
      <AnimatePresence>
        {!isDark && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.4, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-yellow-200/30 via-transparent to-transparent rounded-full blur-3xl pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
