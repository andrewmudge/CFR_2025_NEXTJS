'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { AuthProvider, useAuth } from '@/lib/auth/AuthContext';
import { Toaster } from '@/components/ui/sonner';

function AdminRedirectHandler() {
  const { user, openAuthModal } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('admin') === 'true') {
      if (user && user.email === 'mudge.andrew@gmail.com') {
        window.location.href = '/admin';
        return;
      }
      if (!user) {
        openAuthModal();
      }
    }
  }, [searchParams, openAuthModal, user]);

  return null;
}

function HomeContent() {
  const [mounted, setMounted] = useState(false);
  const { user, openAuthModal } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);



  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Suspense fallback={null}>
        <AdminRedirectHandler />
      </Suspense>
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
          {/* <GamesSection />  */}
          <FamilyOnlySection />
          <PaymentsSection />
          <ContactSection />
        </motion.div>
      </main>
      <Footer />
      <AuthModal />
      <Toaster />
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <HomeContent />
    </AuthProvider>
  );
}