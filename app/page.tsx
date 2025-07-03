'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import CabinetSection from '@/components/CabinetSection';
import ThemeSection from '@/components/ThemeSection';
import ScheduleSection from '@/components/ScheduleSection';
import GamesSection from '@/components/GamesSection';
import FamilyOnlySection from '@/components/FamilyOnlySection';
import PaymentsSection from '@/components/PaymentsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import AuthModal from '@/components/auth/AuthModal';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { Toaster } from '@/components/ui/sonner';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <Header />
        <main>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <HeroSection />
            <AboutSection />
            <CabinetSection />
            <ThemeSection />
            <ScheduleSection />
            <GamesSection /> 
            <FamilyOnlySection />
            <PaymentsSection />
            <ContactSection />
          </motion.div>
        </main>
        <Footer />
        <AuthModal />
        <Toaster />
      </div>
    </AuthProvider>
  );
}