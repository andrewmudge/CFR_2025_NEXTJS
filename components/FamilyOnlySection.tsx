'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Camera, TreePine, Clock, Upload, Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/AuthContext';
import PhotoGallery from '@/components/family/PhotoGallery';
import FamilyTree from '@/components/family/FamilyTree';
import PastReunions from '@/components/family/PastReunions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FamilyOnlySection = () => {
  const { user, openAuthModal } = useAuth();
  const [previewMode, setPreviewMode] = useState(false);

  // Show authenticated content if user is logged in OR preview mode is enabled
  const showAuthenticatedContent = user || previewMode;

  if (!showAuthenticatedContent) {
    return (
      <section id="family-only" className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <div className="mb-8">
              <motion.div
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Lock className="w-12 h-12 text-white" />
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                Family Only Area
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                This exclusive area contains family treasures, memories, and private content. 
                Only authenticated family members may access this section.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-lg">
              <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Authentication Required</h3>
              <p className="text-slate-600 mb-6">
                Please log in to access the family photo gallery, family tree, and past reunion archives.
              </p>
              
              <div className="space-y-4">
                <Button
                  onClick={openAuthModal}
                  size="lg"
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-8 py-3 rounded-full w-full"
                >
                  <Lock className="w-5 h-5 mr-2" />
                  Access Family Content
                </Button>
                
                {/* Preview Mode Toggle - For Development Only */}
                <Button
                  onClick={() => setPreviewMode(true)}
                  size="sm"
                  variant="outline"
                  className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 w-full"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Mode (Development)
                </Button>
              </div>
            </div>

            {/* Preview of what's inside */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                <Camera className="w-8 h-8 text-red-500 mx-auto mb-3" />
                <h4 className="text-slate-800 font-semibold mb-2">Photo Gallery</h4>
                <p className="text-slate-600 text-sm">Upload and share family memories</p>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                <TreePine className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <h4 className="text-slate-800 font-semibold mb-2">Family Tree</h4>
                <p className="text-slate-600 text-sm">Explore our family connections</p>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                <Clock className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <h4 className="text-slate-800 font-semibold mb-2">Past Reunions</h4>
                <p className="text-slate-600 text-sm">Relive previous gatherings</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="family-only" className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800">
              Welcome to the Family Area
            </h2>
            
            {/* Preview Mode Indicator */}
            {previewMode && !user && (
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setPreviewMode(false)}
                  size="sm"
                  variant="outline"
                  className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700"
                >
                  <EyeOff className="w-4 h-4 mr-2" />
                  Exit Preview
                </Button>
              </div>
            )}
          </div>
          
          {previewMode && !user && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg mb-6 max-w-md mx-auto">
              <p className="text-sm">
                <strong>Preview Mode:</strong> You&apos;re viewing the authenticated content for development purposes.
              </p>
            </div>
          )}
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Exclusive family content, memories, and treasures. Share photos, explore our family tree, 
            and relive past reunion memories.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="gallery" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-100 rounded-xl p-1">
              <TabsTrigger
                value="gallery"
                className="data-[state=active]:bg-white data-[state=active]:text-slate-800 text-slate-600 rounded-lg py-3 px-6 transition-all duration-300"
              >
                <Camera className="w-4 h-4 mr-2" />
                Photo Gallery
              </TabsTrigger>
              <TabsTrigger
                value="tree"
                className="data-[state=active]:bg-white data-[state=active]:text-slate-800 text-slate-600 rounded-lg py-3 px-6 transition-all duration-300"
              >
                <TreePine className="w-4 h-4 mr-2" />
                Family Tree
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="data-[state=active]:bg-white data-[state=active]:text-slate-800 text-slate-600 rounded-lg py-3 px-6 transition-all duration-300"
              >
                <Clock className="w-4 h-4 mr-2" />
                Past Reunions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="gallery" className="mt-0">
              <PhotoGallery />
            </TabsContent>

            <TabsContent value="tree" className="mt-0">
              <FamilyTree />
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <PastReunions />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default FamilyOnlySection;