'use client';

import { motion } from 'framer-motion';
import { Heart, Mail, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-red-600">
                <img 
                  src="/favicon.png" 
                  alt="Churchwell Family Logo" 
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">CFR 2025</h3>
                <p className="text-sm text-slate-300">Family Reunion</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              58 years of family tradition, memories, and togetherness. 
              Join us for another wonderful gathering at Casa de Fruta.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-red-300">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                { label: 'About', href: '#about' },
                { label: 'Cabinet', href: '#cabinet' },
                { label: 'Schedule', href: '#schedule' },
                { label: 'Games', href: '#games' },
                { label: 'Family Only', href: '#family-only' },
                { label: 'Payments', href: '#payments' },
                { label: 'Contact', href: '#contact' },
              ].map((link) => (
                <button
                  key={link.label}
                  onClick={() => document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-slate-300 hover:text-red-300 transition-colors text-left"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-red-300">Stay Connected</h4>
            <div className="space-y-3">
              <a
                href="mailto:info@churchwellreunion.com"
                className="flex items-center space-x-3 text-slate-300 hover:text-red-300 transition-colors group"
              >
                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm">info@churchwellreunion.com</span>
              </a>
              <a
                href="https://www.instagram.com/Churchwell_family_reunion"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-slate-300 hover:text-red-300 transition-colors group"
              >
                <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm">@Churchwell_family_reunion</span>
              </a>
            </div>
            
            {/* Event Details */}
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <h5 className="font-semibold text-red-300 mb-2">Event Details</h5>
              <p className="text-sm text-slate-300">
                Aug 28 - Sep 1, 2025<br />
                Casa de Fruta, Gilroy CA
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-white/20 pt-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-slate-300">
              <span>&copy; 2025 Churchwell Family Reunion. All Rights Reserved.</span>
              <Heart className="w-4 h-4 text-red-400" />
              <span>A BOFA Brainchild Production</span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-slate-300">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400" />
              <span>for the family</span>
              <motion.span
                className="text-red-400"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                🏡
              </motion.span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;