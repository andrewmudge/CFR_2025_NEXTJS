'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Crown, Camera } from 'lucide-react';

interface Reunion {
  year: number;
  theme: string;
  location: string;
  attendance: number;
  president: string;
  vicePresident: string;
  secretary: string;
  highlights: string[];
  photos: string[];
}

const PastReunions = () => {
  const reunions: Reunion[] = [
    {
      year: 2024,
      theme: 'Superheroes Unite',
      location: 'Casa de Fruta, Gilroy CA',
      attendance: 47,
      president: 'Rachelle Bennett',
      vicePresident: 'Mackenzie Boone',
      secretary: 'Janet Mudge',
      highlights: [
        'Epic costume contest',
        'Cornhole championship won by Team Miller',
        'Kids superhero training camp',
        'Record-breaking attendance'
      ],
      photos: [
        'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg',
        'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
      ]
    },
    {
      year: 2023,
      theme: 'Wild West Adventure',
      location: 'Casa de Fruta, Gilroy CA',
      attendance: 42,
      president: 'Mike Bennett',
      vicePresident: 'Sarah Churchwell',
      secretary: 'Angela Mudge',
      highlights: [
        'Line dancing lessons',
        'Horseshoe tournament final showdown',
        'Chili cook-off competition',
        'Western photo booth'
      ],
      photos: [
        'https://images.pexels.com/photos/1128317/pexels-photo-1128317.jpeg',
      ]
    },
    {
      year: 2022,
      theme: 'Under the Sea',
      location: 'Casa de Fruta, Gilroy CA',
      attendance: 38,
      president: 'Tom Mudge',
      vicePresident: 'Lisa Bennett',
      secretary: 'Toni Vasquez',
      highlights: [
        'Underwater themed decorations',
        'Seafood BBQ feast',
        'Kids treasure hunt',
        'Mermaid and pirate costumes'
      ],
      photos: []
    },
    {
      year: 2021,
      theme: 'Space Odyssey',
      location: 'Casa de Fruta, Gilroy CA',
      attendance: 35,
      president: 'Dave Boone',
      vicePresident: 'Emma Churchwell',
      secretary: 'Chris Vasquez',
      highlights: [
        'Out of this world costumes',
        'Rocket building contest',
        'Star gazing night',
        'Galaxy themed games'
      ],
      photos: []
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h3 className="text-2xl font-bold text-slate-800 mb-4">
          Past Reunion Chronicles
        </h3>
        <p className="text-slate-600">
          A journey through our family gathering history
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="space-y-8">
        {reunions.map((reunion, index) => (
          <motion.div
            key={reunion.year}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center space-x-8`}
          >
            {/* Year Badge */}
            <div className="flex-shrink-0">
              <motion.div
                className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <span className="text-2xl font-bold text-white">{reunion.year}</span>
              </motion.div>
            </div>

            {/* Content Card */}
            <motion.div
              className="flex-1 bg-white border border-slate-200 rounded-xl p-6 shadow-lg"
              whileHover={{ y: -2, scale: 1.01 }}
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <h4 className="text-2xl font-bold text-slate-800">{reunion.theme}</h4>
                  <div className="flex flex-wrap items-center space-x-6 text-slate-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{reunion.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>{reunion.attendance} attendees</span>
                    </div>
                  </div>
                </div>

                {/* Leadership */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Crown className="w-4 h-4 text-red-500" />
                      <h5 className="font-semibold text-red-600">President</h5>
                    </div>
                    <p className="text-slate-800">{reunion.president}</p>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Crown className="w-4 h-4 text-blue-500" />
                      <h5 className="font-semibold text-blue-600">Vice President</h5>
                    </div>
                    <p className="text-slate-800">{reunion.vicePresident}</p>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-4 h-4 text-green-500" />
                      <h5 className="font-semibold text-green-600">Secretary</h5>
                    </div>
                    <p className="text-slate-800">{reunion.secretary}</p>
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-3">
                  <h5 className="text-lg font-semibold text-slate-800">
                    Highlights
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {reunion.highlights.map((highlight, idx) => (
                      <motion.div
                        key={idx}
                        className="flex items-center space-x-2 text-slate-700"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                        <span>{highlight}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Photos */}
                {reunion.photos.length > 0 && (
                  <div className="space-y-3">
                    <h5 className="text-lg font-semibold text-slate-800 flex items-center">
                      <Camera className="w-5 h-5 mr-2" />
                      Memories
                    </h5>
                    <div className="flex space-x-3 overflow-x-auto pb-2">
                      {reunion.photos.map((photo, idx) => (
                        <motion.img
                          key={idx}
                          src={photo}
                          alt={`${reunion.year} reunion`}
                          className="w-24 h-24 object-cover rounded-lg flex-shrink-0 cursor-pointer border border-slate-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12"
      >
        <div className="bg-white border border-slate-200 p-6 rounded-xl text-center shadow-lg">
          <Calendar className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <h4 className="text-2xl font-bold text-slate-800">58</h4>
          <p className="text-slate-600">Years of Tradition</p>
        </div>
        
        <div className="bg-white border border-slate-200 p-6 rounded-xl text-center shadow-lg">
          <Users className="w-8 h-8 text-blue-500 mx-auto mb-3" />
          <h4 className="text-2xl font-bold text-slate-800">2,500+</h4>
          <p className="text-slate-600">Total Attendees</p>
        </div>
        
        <div className="bg-white border border-slate-200 p-6 rounded-xl text-center shadow-lg">
          <Crown className="w-8 h-8 text-green-500 mx-auto mb-3" />
          <h4 className="text-2xl font-bold text-slate-800">20+</h4>
          <p className="text-slate-600">Family Leaders</p>
        </div>
        
        <div className="bg-white border border-slate-200 p-6 rounded-xl text-center shadow-lg">
          <Camera className="w-8 h-8 text-purple-500 mx-auto mb-3" />
          <h4 className="text-2xl font-bold text-slate-800">10,000+</h4>
          <p className="text-slate-600">Memories Captured</p>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <div className="bg-gradient-to-r from-red-50 to-blue-50 border border-slate-200 p-8 rounded-xl">
          <h4 className="text-2xl font-bold text-slate-800 mb-4">
            Help Us Document 2025! 📸
          </h4>
          <p className="text-slate-600 mb-6">
            Share your photos and memories to help create the chronicle of our 2025 
            family reunion. Every photo tells part of our family story!
          </p>
          <motion.div
            className="text-4xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🏡✨📷✨🏡
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PastReunions;