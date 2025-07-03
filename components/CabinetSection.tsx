'use client';

import { motion } from 'framer-motion';
import { Crown, Shield, Scroll, Coins, BookOpen, Users } from 'lucide-react';

const CabinetSection = () => {
  const cabinetMembers = [
    {
      title: 'President',
      name: 'Rachelle Bennett',
      icon: Crown,
      color: 'from-red-600 to-red-700',
      bgColor: 'bg-red-50',
      hoverBg: 'hover:bg-red-100',
    },
    {
      title: 'Vice President',
      name: 'Mackenzie Boone',
      icon: Shield,
      color: 'from-slate-600 to-slate-700',
      bgColor: 'bg-slate-50',
      hoverBg: 'hover:bg-slate-100',
    },
    {
      title: 'Chief of Staff',
      name: 'Angela Mudge',
      icon: Users,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      hoverBg: 'hover:bg-red-100',
    },
    {
      title: 'Secretary',
      name: 'Janet Mudge',
      icon: Scroll,
      color: 'from-slate-500 to-slate-600',
      bgColor: 'bg-slate-50',
      hoverBg: 'hover:bg-slate-100',
    },
    {
      title: 'Treasurer',
      name: 'Toni Vasquez',
      icon: Coins,
      color: 'from-red-600 to-red-700',
      bgColor: 'bg-red-50',
      hoverBg: 'hover:bg-red-100',
    },
    {
      title: 'Historian',
      name: 'Sarah Churchwell',
      icon: BookOpen,
      color: 'from-slate-600 to-slate-700',
      bgColor: 'bg-slate-50',
      hoverBg: 'hover:bg-slate-100',
    },
  ];

  return (
    <section id="cabinet" className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            2025 Cabinet
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Meet the dedicated family members organizing this year's reunion and ensuring 
            every detail creates lasting memories for our family.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {cabinetMembers.map((member, index) => {
            const IconComponent = member.icon;
            
            return (
              <motion.div
                key={member.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`${member.bgColor} ${member.hoverBg} p-8 rounded-xl shadow-lg transition-all duration-300 group cursor-pointer border border-white/50`}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="text-center space-y-4">
                  {/* Icon */}
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${member.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                      {member.title}
                    </h3>
                    <p className="text-lg text-slate-700 font-medium">
                      {member.name}
                    </p>
                  </div>

                  {/* Decorative element */}
                  <div className="flex justify-center space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CabinetSection;