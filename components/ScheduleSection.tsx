'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Trophy, Utensils, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ScheduleSection = () => {
  const [activeDay, setActiveDay] = useState('friday');

  const scheduleData = {
    friday: [
      {
        time: '09:30 AM',
        title: 'Welcoming Committee',
        description: 'Christina Enns & Dana Miller',
        icon: Users,
        color: 'from-blue-500 to-blue-700',
        bgColor: 'bg-blue-50',
        subtitle: undefined,
        price: undefined,
      },
      {
        time: '12:00 PM',
        title: 'Cornhole Tournament',
        description: 'Angela Jachetti and Mykel Vallar',
        price: '$10',
        icon: Trophy,
        color: 'from-green-500 to-green-700',
        bgColor: 'bg-green-50',
      },
      {
        time: '4:00 PM',
        title: 'Food Challenge',
        description: 'Food Challenge Details Coming Soon',
        price: 'TBD',
        icon: Utensils,
        color: 'from-orange-500 to-orange-700',
        bgColor: 'bg-orange-50',
      },
      {
        time: '6:00 PM',
        title: 'Friday Night Meeting',
        description: 'Grab your chairs and tune in for the weekends festivities',
        icon: Users,
        color: 'from-purple-500 to-purple-700',
        bgColor: 'bg-purple-50',
      },
      /*
      {
        time: '10:00 PM',
        title: 'Danger Zone Dogs',
        description: 'DZD Chefs are back. Quality products only.',
        subtitle: 'Cleared hot for another year',
        icon: Utensils,
        color: 'from-red-500 to-red-700',
        bgColor: 'bg-red-50',
      },
      */
    ],
    saturday: [
      {
        time: '11:00 AM',
        title: 'Horseshoe Tournament',
        description: 'Nancy Reineking and Brycen Swanson',
        price: '$10',
        icon: Trophy,
        color: 'from-yellow-500 to-yellow-700',
        bgColor: 'bg-yellow-50',
      },
      {
        time: '12:00 PM',
        title: 'Darts Tournament',
        description: 'Paul Riker',
        price: '$10',
        icon: Trophy,
        color: 'from-indigo-500 to-indigo-700',
        bgColor: 'bg-indigo-50',
      },
      {
        time: '12:00 PM',
        title: 'Kids Games',
        description: 'Volunteers TBD',
        icon: Users,
        color: 'from-pink-500 to-pink-700',
        bgColor: 'bg-pink-50',
      },
      {
        time: '07:00 PM',
        title: 'Dinner',
        description: 'Dinner Theme TBD',
        icon: Utensils,
        color: 'from-green-500 to-green-700',
        bgColor: 'bg-green-50',
      },
      {
        time: 'After Dinner',
        title: 'After Dinner Game',
        description: 'After Dinner Game Details TBD',
        icon: Trophy,
        color: 'from-blue-500 to-blue-700',
        bgColor: 'bg-blue-50',
      },
      {
        time: '10:00 PM',
        title: 'Charades',
        description: '2024 Winners: Jackie Riker, Morgan Trivitt, Tony Burton, Matt Greenberg, and Christina Enns.',
        icon: Users,
        color: 'from-purple-500 to-purple-700',
        bgColor: 'bg-purple-50',
      },
    ],
    sunday: [
      {
        time: '10:30 AM',
        title: 'Brunch',
        description: 'Mimosas and Deliciousness',
        icon: Utensils,
        color: 'from-orange-500 to-orange-700',
        bgColor: 'bg-orange-50',
      },
      {
        time: '12:00 PM',
        title: 'Poker Tournament',
        description: 'Clint Blackburn',
        price: '$20',
        icon: Trophy,
        color: 'from-red-500 to-red-700',
        bgColor: 'bg-red-50',
      },
      {
        time: '1:00 PM',
        title: 'Kids Checkers Tournament',
        description: 'Dylan Enns',
        icon: Trophy,
        color: 'from-blue-500 to-blue-700',
        bgColor: 'bg-blue-50',
      },
      {
        time: '04:00 PM',
        title: 'Egg Toss',
        description: 'Devin Riker and Gino Burton',
        icon: Trophy,
        color: 'from-yellow-500 to-yellow-700',
        bgColor: 'bg-yellow-50',
      },
      {
        time: '07:00 PM',
        title: 'Dinner',
        description: 'Dinner Theme TBD',
        icon: Utensils,
        color: 'from-green-500 to-green-700',
        bgColor: 'bg-green-50',
      },
      {
        time: '08:30 PM',
        title: 'Raffle',
        description: 'Raffle Volunteers',
        icon: Trophy,
        color: 'from-purple-500 to-purple-700',
        bgColor: 'bg-purple-50',
      },
    ],
  } as Record<string, Event[]>;

  const days = [
    { id: 'friday', label: 'Friday', date: 'Aug 29' },
    { id: 'saturday', label: 'Saturday', date: 'Aug 30' },
    { id: 'sunday', label: 'Sunday', date: 'Aug 31' },
  ];

  return (
    <section id="schedule" className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Weekend Schedule
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            2025 Churchwell Family Reunion Activities - A wonderful weekend full of family fun and memorable events
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs value={activeDay} onValueChange={setActiveDay} className="w-full">
            {/* Day Tabs */}
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-100 rounded-xl p-1">
              {days.map((day) => (
                <TabsTrigger
                  key={day.id}
                  value={day.id}
                  className="data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-md rounded-lg py-3 px-6 transition-all duration-300"
                >
                  <div className="text-center">
                    <div className="font-bold">{day.label}</div>
                    <div className="text-xs opacity-70">{day.date}</div>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Schedule Content */}
            <AnimatePresence mode="wait">
              {days.map((day) => (
                <TabsContent key={day.id} value={day.id} className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {scheduleData[day.id as keyof typeof scheduleData].map((event, index) => {
                      const IconComponent = event.icon;
                      
                      return (
                        <div
                          key={index}
                          className={`${event.bgColor} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-white/50`}
                        >
                          <div className="flex items-start space-x-4">
                            {/* Time */}
                            <div className="flex-shrink-0 text-center">
                              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${event.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                <Clock className="w-6 h-6 text-white" />
                              </div>
                              <div className="mt-2 text-sm font-medium text-slate-600">
                                {event.time}
                              </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-3">
                                    <IconComponent className="w-5 h-5 text-slate-700" />
                                    <h3 className="text-xl font-bold text-slate-800">
                                      {event.title}
                                    </h3>
                                    {event.price && (
                                      <span className={`px-3 py-1 bg-gradient-to-r ${event.color} text-white text-sm font-semibold rounded-full shadow-sm`}>
                                        {event.price}
                                      </span>
                                    )}
                                  </div>
                                  
                                  {event.subtitle && (
                                    <p className="text-sm font-medium text-slate-700">
                                      {event.subtitle}
                                    </p>
                                  )}
                                  
                                  <p className="text-slate-600 leading-relaxed">
                                    {event.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                </TabsContent>
              ))}
            </AnimatePresence>
          </Tabs>
        </div>

        
      </div>
    </section>
  );
};

export default ScheduleSection;

type Event = {
  time: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  price?: string;
  subtitle?: string; // <-- add this line
};