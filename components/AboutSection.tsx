'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/AuthContext';
import Image from 'next/image';

const AboutSection = () => {
  const { user, openAuthModal } = useAuth();

  const handleSignUpClick = () => {
    openAuthModal();
  };

  return (
    <section id="about" className="pt-16 py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-800 leading-tight">
                  About Our Family Reunion
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-red-700 rounded-full"></div>
                <p className="text-lg text-slate-600 leading-relaxed">
                  For 58 years, the Churchwell family has gathered to reconnect, share stories, 
                  and strengthen the bonds that unite us across generations. Our annual reunion 
                  is a cherished tradition that celebrates our heritage and creates lasting 
                  memories with loved ones.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Join us for a weekend filled with family traditions, friendly competitions, 
                  delicious meals, and the joy of reconnecting with relatives from near and far.
                </p>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50 p-6 rounded-lg text-center group hover:bg-red-50 transition-colors border border-slate-200">
                  <MapPin className="w-8 h-8 text-red-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-slate-800 mb-2">Location</h3>
                  <p className="text-sm text-slate-600">
                    Casa de Fruta<br />
                    Gilroy, California
                  </p>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-lg text-center group hover:bg-red-50 transition-colors border border-slate-200">
                  <Calendar className="w-8 h-8 text-red-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-slate-800 mb-2">Dates</h3>
                  <p className="text-sm text-slate-600">
                    August 28th - September 1st<br />
                    2025
                  </p>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-lg text-center group hover:bg-red-50 transition-colors border border-slate-200">
                  <Users className="w-8 h-8 text-red-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-slate-800 mb-2">Tradition</h3>
                  <p className="text-sm text-slate-600">
                    58th Annual<br />
                    Family Gathering
                  </p>
                </div>
              </div>

              {/* Registration Button 
              <div className="pt-6">
                <Button
                  onClick={handleSignUpClick}
                  size="lg"
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Users className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                  Register Your Family
                </Button>
                <p className="text-sm text-slate-500 mt-3">
                  {!user && "Account required to register for the reunion"}
                </p>
              </div> */}
            </div>

            {/* Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                <Image
                  src="/intro-bg - Copy.jpg"
                  alt="Churchwell Family Reunion - Large family group photo"
                  width={1200} // <-- set to your image's width in pixels
                  height={500} // <-- set to your image's height in pixels
                  className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Floating badge */}
                <div className="absolute top-6 right-6 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                  58 Years of Tradition
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;