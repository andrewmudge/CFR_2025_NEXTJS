'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Target, Gamepad2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TournamentBracket from './tournaments/TournamentBracket';

interface TournamentBracketProps {
  gameType: string;
}

const GamesSection = () => {
  const [activeGame, setActiveGame] = useState('cornhole');

  const games = [
    {
      id: 'cornhole',
      name: 'Cornhole',
      icon: Target,
      color: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'horseshoes',
      name: 'Horseshoes',
      icon: Trophy,
      color: 'from-green-500 to-green-700',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <section id="games" className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Tournament Games
          </h2>
        </div>

        {/* Quick Info */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-xl shadow-xl max-w-2xl mx-auto">
            <p className="text-blue-100 mb-4">
              Entry fees for tournaments help fund prizes and activities. 
              All skill levels welcome - it's about family fun!
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <span className="bg-white/20 px-3 py-1 rounded-full">Cornhole: $10</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">Horseshoes: $10</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">Darts: $10</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">Poker: $20</span>
            </div>
          </div>
        </div>

        {/* Add extra space after Quick Info */}
        <div className="my-12" />

        <div className="max-w-6xl mx-auto">
          <Tabs value={activeGame} onValueChange={setActiveGame} className="w-full">
            {/* Game Tabs */}
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-100 rounded-xl p-1 max-w-md mx-auto">
              {games.map((game) => {
                const IconComponent = game.icon;
                return (
                  <TabsTrigger
                    key={game.id}
                    value={game.id}
                    className="data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-md rounded-lg py-3 px-6 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-2">
                      <IconComponent className="w-4 h-4" />
                      <span className="font-medium">{game.name}</span>
                    </div>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Tournament Brackets */}
            {games.map((game) => (
              <TabsContent key={game.id} value={game.id} className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  

                  {/* Tournament Bracket */}
                  <TournamentBracket gameType={game.id} />
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Tournament Rules */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-xl shadow-xl max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">🏆 Tournament Rules & Information</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-blue-200 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Team Formation
                </h4>
                <ul className="space-y-2 text-blue-100">
                  <li>• Teams consist of 1 male + 1 female player</li>
                  <li>• If more males than females, first eliminated female fills open slot</li>
                  <li>• Extra players get alternate positions in first round</li>
                  <li>• All family members welcome regardless of skill level!</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-blue-200 flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Tournament Format
                </h4>
                <ul className="space-y-2 text-blue-100">
                  <li>• Single elimination bracket style</li>
                  <li>• Winners advance automatically to next round</li>
                  <li>• Brackets update in real-time on this page</li>
                  <li>• Finals feature the ultimate family showdown!</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-blue-100">
                🏆 Glory, bragging rights, and prizes await the champions! 🏆
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GamesSection;

