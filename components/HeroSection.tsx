'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Professional Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(220,38,38,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(153,27,27,0.08),transparent_50%)]" />
        
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rotate-45"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border border-white/20 rotate-12"></div>
          <div className="absolute bottom-40 left-32 w-28 h-28 border border-white/20 -rotate-12"></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center border-4 border-red-600 shadow-2xl">
              <img 
                src="/favicon.png" 
                alt="Churchwell Family Logo" 
                className="w-28 h-28 object-contain"
              />
            </div>
          </motion.div>

          {/* Main Title */}
          <div className="space-y-4">
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              The 58th Annual
            </motion.h1>
            <motion.h2
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-transparent bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text leading-tight"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Churchwell Family Reunion
            </motion.h2>
          </div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-4"
          >
            <p className="text-xl md:text-2xl text-slate-300 font-medium">
              Celebrating 58 Years of Family Tradition
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-700 mx-auto rounded-full"></div>
          </motion.div>

          {/* Date and Location */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-12">
              <div className="flex items-center space-x-3 text-white bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <Calendar className="w-5 h-5 text-red-400" />
                <span className="text-lg font-medium">Aug 28th - Sep 1st 2025</span>
              </div>
              <div className="flex items-center space-x-3 text-white bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <MapPin className="w-5 h-5 text-red-400" />
                <span className="text-lg font-medium">Casa de Fruta, Gilroy CA</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;