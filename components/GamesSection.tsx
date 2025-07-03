import React, { useState } from 'react';
import { Trophy, Users, Target, Gamepad2 } from 'lucide-react';
import TournamentBracket from './tournaments/TournamentBracket';

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
              Here are the prices for each tournament.
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
          {/* Game Tabs */}
          <div className="grid w-full grid-cols-2 mb-8 bg-slate-100 rounded-xl p-1 max-w-md mx-auto">
            {games.map((game) => {
              const IconComponent = game.icon;
              return (
                <button
                  key={game.id}
                  onClick={() => setActiveGame(game.id)}
                  className={`${
                    activeGame === game.id
                      ? 'bg-white text-slate-800 shadow-md'
                      : 'text-slate-600 hover:text-slate-800'
                  } rounded-lg py-3 px-6 transition-all duration-300`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <IconComponent className="w-4 h-4" />
                    <span className="font-medium">{game.name}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tournament Brackets */}
          {games.map((game) => (
            <div
              key={game.id}
              className={`${activeGame === game.id ? 'block' : 'hidden'} space-y-8`}
            >
              {/* Tournament Bracket */}
              <TournamentBracket gameType={game.name} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default GamesSection;