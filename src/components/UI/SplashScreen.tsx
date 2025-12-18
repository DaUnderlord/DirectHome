import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo.png';

// Brand Colors
const brand = {
  navy: '#1e4a6d',
  navyLight: '#2a5f8a',
  navyDark: '#153a55',
  gold: '#c9a962',
  goldLight: '#d4b97a',
};

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
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        >
          {/* Animated Background */}
          <div 
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${brand.navyDark} 0%, ${brand.navy} 50%, ${brand.navyLight} 100%)` }}
          />
          
          {/* Animated Gradient Orbs */}
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full"
            style={{ 
              background: `radial-gradient(circle, ${brand.gold}40 0%, transparent 70%)`,
              top: '-20%',
              right: '-10%'
            }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full"
            style={{ 
              background: `radial-gradient(circle, ${brand.navyLight}50 0%, transparent 70%)`,
              bottom: '-15%',
              left: '-10%'
            }}
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Floating Particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}

          {/* Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative text-center px-8"
          >
            {/* Logo Container with Glow */}
            <div className="relative mx-auto mb-8">
              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 rounded-3xl blur-2xl"
                style={{ background: brand.gold }}
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Logo Card */}
              <motion.div 
                className="relative h-32 w-32 md:h-40 md:w-40 mx-auto rounded-3xl bg-white shadow-2xl p-4 md:p-5"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <motion.img
                  src={logo}
                  alt="DirectHome"
                  className="h-full w-full object-contain"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </motion.div>
            </div>

            {/* Brand Name */}
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-white mb-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Direct<span style={{ color: brand.gold }}>Home</span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              className="text-white/80 text-base md:text-lg font-medium mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Nigeria's #1 Agent-Free Rental Platform
            </motion.p>

            {/* Progress Bar */}
            <motion.div
              className="w-56 md:w-64 mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${brand.gold}, ${brand.goldLight})` }}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.6 }}
                />
              </div>
              <motion.p
                className="text-white/50 text-sm mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Loading your experience...
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
