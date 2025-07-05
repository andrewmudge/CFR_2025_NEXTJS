'use client';

import { motion } from 'framer-motion';
import { Heart, Users, Calendar, MapPin, Award, Camera } from 'lucide-react';

const ThemeSection = () => {
  return (
    <section id="theme" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Professional background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.03),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(99,102,241,0.03),transparent_50%)]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            2025 Theme
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full mb-8"></div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            The theme this year is Harry Potter and the Chamber of Churchwells. Witches, wizards, and wild relatives—your Hogwarts letter has arrived! This year, the Churchwell family is conjuring chaos and cousinly love at the legendary Casa de Fruta. Expect magical mayhem, family feasts worthy of the Great Hall, and enough enchantment to make even Aunt Edna’s fruitcake levitate. Don’t forget your wand—or your stretchy pants.
          </p>
          <div className="flex justify-center mt-6">
            <img
              src="/CFR_LOGO_25.png"
              alt="CFR 2025 Logo"
              style={{ width: '75%', maxWidth: '24rem' }}
              className="object-contain"
            />
          </div>
        </motion.div>

       
      </div>
    </section>
  );
};

export default ThemeSection;