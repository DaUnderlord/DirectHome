import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo.png';

interface SplashScreenProps {
  show: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ show }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_60%)]" />
          {/* Subtle vignette to increase central contrast for blue logo text */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.25),transparent_60%)]" />

          {/* Content */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative glass-card/0 text-center px-8"
          >
            <div className="relative mx-auto h-28 w-28 md:h-32 md:w-32 mb-6">
              {/* High-contrast badge behind logo to ensure readability on blue bg */}
              <motion.div 
                className="absolute inset-0 rounded-2xl bg-white/90 backdrop-blur-sm ring-1 ring-white/30 shadow-2xl"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              />
              <div className="absolute inset-0 p-3 md:p-4">
                <motion.img
                  src={logo}
                  alt="DirectHome"
                  className="h-full w-full object-contain"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>

            <motion.p
              className="mt-2 text-blue-50 text-base md:text-lg font-medium"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Nigeria’s trusted agent-free RENTAL platform
            </motion.p>

            {/* Progress bar */}
            <motion.div
              className="mt-8 h-1 w-48 mx-auto overflow-hidden rounded-full bg-white/15"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.4 }}
            >
              <motion.div
                className="h-full bg-white/80"
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 1.1, ease: 'easeInOut' }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
