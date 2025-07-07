'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, LogIn, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { user, signOut, openAuthModal } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '#home', label: 'Home' },
    // { href: '#about', label: 'About' },
    { href: '#cabinet', label: 'Cabinet' },
    { href: '#theme', label: 'Theme' },
    { href: '#schedule', label: 'Schedule' },
    // { href: '#games', label: 'Games' },
    { href: '#family-only', label: 'Family Only' },
    { href: '#payments', label: 'Payments' },
    { href: '#contact', label: 'Contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 50 
          ? 'bg-slate-900/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-red-600 shadow-lg">
              <img 
                src="/favicon.png" 
                alt="Churchwell Family Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <div className="text-white">
              <h1 className="text-xl font-bold">CFR 2025</h1>
              <p className="text-xs text-red-300">Family Reunion</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="text-white hover:text-red-300 transition-colors relative group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-400 group-hover:w-full transition-all duration-300" />
              </motion.button>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-white">
                  <User className="w-4 h-4" />
                  <span className="text-sm">
                    {user.attributes?.given_name || user.username}
                  </span>
                </div>
                <Button
                  onClick={signOut}
                  variant="outline"
                  size="sm"
                  className="border-red-400 text-red-300 hover:bg-red-400 hover:text-white"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={openAuthModal}
                variant="outline"
                size="sm"
                className="border-red-400 text-red-300 hover:bg-red-400 hover:text-white"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Log In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-white p-2"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav
            className="lg:hidden mt-4 pb-4 border-t border-slate-700 bg-slate-900/95 rounded-xl shadow-xl"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex flex-col space-y-3 pt-4">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="text-white hover:text-red-300 transition-colors text-left py-2"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-3 border-t border-slate-700">
                {user ? (
                  <div className="space-y-2">
                    <div className="text-white text-sm">
                      Welcome, {user.attributes?.given_name || user.username}
                    </div>
                    <Button
                      onClick={signOut}
                      variant="outline"
                      size="sm"
                      className="border-red-400 text-red-300 hover:bg-red-400 hover:text-white w-full"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={openAuthModal}
                    variant="outline"
                    size="sm"
                    className="border-red-400 text-red-300 hover:bg-red-400 hover:text-white w-full"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Log In
                  </Button>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
};

export default Header;