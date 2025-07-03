'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Users, Trophy, Undo2, Lock, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/AuthContext';
import ParticipantManager from './ParticipantManager';

interface Team {
  id: string;
  player1: string;
  player2: string;
  isAdvanced?: boolean;
}

interface Match {
  id: string;
  team1: Team | null;
  team2: Team | null;
  winner: Team | null;
  round: number;
  position: number;
}

interface Participant {
  id: string;
  name: string;
  gender: 'male' | 'female';
  gameType: string;
}

interface TournamentBracketProps {
  gameType: string;
}

const TournamentBracket = ({ gameType }: TournamentBracketProps) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchHistory, setMatchHistory] = useState<Match[][]>([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const { user, openAuthModal } = useAuth();

  // Generate fake participants for demonstration
  const generateFakeParticipants = (gameType: string): Participant[] => {
    const maleNames = [
      'John Churchwell', 'Mike Bennett', 'Tom Mudge', 'Dave Boone', 'Chris Vasquez',
      'Paul Riker', 'Steve Miller', 'Dan Burton', 'Mark Johnson', 'Brian Smith',
      'Kevin Brown', 'Ryan Davis', 'Matt Wilson', 'Jake Taylor', 'Luke Anderson',
      'Sam Thompson', 'Alex Garcia', 'Nick Martinez', 'Tyler Robinson', 'Josh Clark',
      'Adam Lewis', 'Ben Walker', 'Cole Hall', 'Drew Allen', 'Eric Young'
    ];

    const femaleNames = [
      'Jane Churchwell', 'Sarah Bennett', 'Lisa Mudge', 'Emma Boone', 'Maria Vasquez',
      'Amy Riker', 'Kelly Miller', 'Sue Burton', 'Jennifer Johnson', 'Michelle Smith',
      'Ashley Brown', 'Jessica Davis', 'Amanda Wilson', 'Nicole Taylor', 'Rachel Anderson',
      'Stephanie Thompson', 'Christina Garcia', 'Lauren Martinez', 'Megan Robinson', 'Katie Clark',
      'Emily Lewis', 'Hannah Walker', 'Olivia Hall', 'Grace Allen', 'Sophia Young'
    ];

    const participants: Participant[] = [];
    
    // Add 25 male participants
    for (let i = 0; i < 25; i++) {
      participants.push({
        id: `male_${gameType}_${i + 1}`,
        name: maleNames[i],
        gender: 'male',
        gameType,
      });
    }

    // Add 25 female participants
    for (let i = 0; i < 25; i++) {
      participants.push({
        id: `female_${gameType}_${i + 1}`,
        name: femaleNames[i],
        gender: 'female',
        gameType,
      });
    }

    return participants;
  };

  // Generate teams from participants
  const generateTeamsFromParticipants = (participantList: Participant[]): Team[] => {
    const males = participantList.filter(p => p.gender === 'male');
    const females = participantList.filter(p => p.gender === 'female');
    
    const teams: Team[] = [];
    const minCount = Math.min(males.length, females.length);
    
    for (let i = 0; i < minCount; i++) {
      teams.push({
        id: `team_${gameType}_${i + 1}`,
        player1: males[i].name,
        player2: females[i].name,
      });
    }
    
    return teams;
  };

  // Generate bracket structure
  const generateBracket = (teamList: Team[]) => {
    const matches: Match[] = [];
    let matchId = 1;

    if (teamList.length === 0) {
      return matches;
    }

    // Round 1 (First round based on team count)
    for (let i = 0; i < teamList.length; i += 2) {
      matches.push({
        id: `${gameType}_match_${matchId}`,
        team1: teamList[i] || null,
        team2: teamList[i + 1] || null,
        winner: null,
        round: 1,
        position: Math.floor(i / 2),
      });
      matchId++;
    }

    // Generate subsequent rounds
    let currentRoundMatches = matches.filter(m => m.round === 1);
    let round = 2;
    
    while (currentRoundMatches.length > 1) {
      const nextRoundCount = Math.ceil(currentRoundMatches.length / 2);
      
      for (let i = 0; i < nextRoundCount; i++) {
        matches.push({
          id: `${gameType}_match_${matchId}`,
          team1: null,
          team2: null,
          winner: null,
          round: round,
          position: i,
        });
        matchId++;
      }
      
      currentRoundMatches = matches.filter(m => m.round === round);
      round++;
    }

    return matches;
  };

  // Handle participants change
  const handleParticipantsChange = (newParticipants: Participant[]) => {
    setParticipants(newParticipants);
    const newTeams = generateTeamsFromParticipants(newParticipants);
    setTeams(newTeams);
    
    // Reset bracket when participants change
    const newMatches = generateBracket(newTeams);
    setMatches(newMatches);
    setMatchHistory([newMatches]);
  };

  // Initialize with saved data or fake data
  useEffect(() => {
    const savedParticipants = localStorage.getItem(`participants_${gameType}`);
    if (savedParticipants) {
      try {
        const parsed = JSON.parse(savedParticipants);
        setParticipants(parsed);
        const initialTeams = generateTeamsFromParticipants(parsed);
        setTeams(initialTeams);
        
        const initialMatches = generateBracket(initialTeams);
        setMatches(initialMatches);
        setMatchHistory([initialMatches]);
      } catch (error) {
        console.error('Error parsing saved participants:', error);
        // Fall back to generating fake participants
        const fakeParticipants = generateFakeParticipants(gameType);
        setParticipants(fakeParticipants);
        localStorage.setItem(`participants_${gameType}`, JSON.stringify(fakeParticipants));
        
        const initialTeams = generateTeamsFromParticipants(fakeParticipants);
        setTeams(initialTeams);
        
        const initialMatches = generateBracket(initialTeams);
        setMatches(initialMatches);
        setMatchHistory([initialMatches]);
      }
    } else {
      // Generate fake participants for demonstration
      const fakeParticipants = generateFakeParticipants(gameType);
      setParticipants(fakeParticipants);
      localStorage.setItem(`participants_${gameType}`, JSON.stringify(fakeParticipants));
      
      const initialTeams = generateTeamsFromParticipants(fakeParticipants);
      setTeams(initialTeams);
      
      const initialMatches = generateBracket(initialTeams);
      setMatches(initialMatches);
      setMatchHistory([initialMatches]);
    }
    setLoading(false);
  }, [gameType]);

  const handleAdvanceTeam = (matchId: string, winner: Team) => {
    if (!user) {
      openAuthModal();
      return;
    }

    setMatches(prevMatches => {
      // Save current state to history
      setMatchHistory(prev => [...prev, prevMatches]);

      const updatedMatches = prevMatches.map(match => {
        if (match.id === matchId) {
          return { ...match, winner };
        }
        return match;
      });

      // Find the current match and advance winner to next round
      const currentMatch = updatedMatches.find(m => m.id === matchId);
      if (currentMatch) {
        const nextRound = currentMatch.round + 1;
        const nextPosition = Math.floor(currentMatch.position / 2);
        const nextMatch = updatedMatches.find(m => m.round === nextRound && m.position === nextPosition);
        
        if (nextMatch) {
          const isFirstSlot = currentMatch.position % 2 === 0;
          if (isFirstSlot) {
            nextMatch.team1 = winner;
          } else {
            nextMatch.team2 = winner;
          }
        }
      }

      return updatedMatches;
    });
  };

  const handleUndo = () => {
    if (!user) {
      openAuthModal();
      return;
    }

    if (matchHistory.length > 1) {
      const previousState = matchHistory[matchHistory.length - 2];
      setMatches(previousState);
      setMatchHistory(prev => prev.slice(0, -1));
    }
  };

  const MatchCard = ({ match }: { match: Match }) => {
    const isClickable = match.team1 && match.team2 && !match.winner && user;
    
    return (
      <div className={`
        p-4 rounded-lg border min-w-[280px] max-w-[280px] bg-white
        ${match.round === Math.max(...matches.map(m => m.round)) ? 'border-amber-300 shadow-lg' : 'border-slate-300'}
        ${isClickable ? 'hover:border-blue-400 cursor-pointer hover:shadow-md' : ''}
        ${match.winner ? 'border-green-400 bg-green-50' : ''}
        ${!user && match.team1 && match.team2 && !match.winner ? 'border-slate-200 opacity-75' : ''}
        transition-all duration-300 shadow-sm
      `}>
        {/* Round indicator */}
        <div className="text-center mb-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
            ${match.round === 1 ? 'bg-slate-50 text-slate-700 border-slate-200' : ''}
            ${match.round === 2 ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
            ${match.round === Math.max(...matches.map(m => m.round)) ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
            ${match.round > 2 && match.round < Math.max(...matches.map(m => m.round)) ? 'bg-green-50 text-green-700 border-green-200' : ''}
          `}>
            {match.round === Math.max(...matches.map(m => m.round)) && <Crown className="w-3 h-3 mr-1" />}
            {match.round === 1 ? 'Round 1' : 
             match.round === Math.max(...matches.map(m => m.round)) ? 'FINAL' : 
             `Round ${match.round}`}
          </span>
        </div>

        {/* Teams */}
        <div className="space-y-2">
          {[match.team1, match.team2].map((team, index) => (
            <div
              key={index}
              className={`
                p-3 rounded border transition-all duration-200
                ${!team ? 'bg-slate-50 border-slate-200' : ''}
                ${team && match.winner?.id === team.id ? 'bg-green-100 border-green-300 font-semibold' : ''}
                ${team && match.winner && match.winner.id !== team.id ? 'bg-slate-100 border-slate-200 opacity-60' : ''}
                ${team && !match.winner ? 'bg-slate-50 border-slate-200 hover:bg-slate-100' : ''}
                ${isClickable && team ? 'cursor-pointer' : ''}
                ${!user && team && !match.winner ? 'cursor-not-allowed' : ''}
              `}
              onClick={() => {
                if (isClickable && team) {
                  handleAdvanceTeam(match.id, team);
                } else if (!user && team && !match.winner) {
                  openAuthModal();
                }
              }}
            >
              {team ? (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm text-slate-800">{team.player1}</div>
                    <div className="font-medium text-sm text-slate-800">{team.player2}</div>
                  </div>
                  {match.winner?.id === team.id && (
                    <Trophy className="w-4 h-4 text-green-600" />
                  )}
                  {!user && !match.winner && (
                    <Lock className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              ) : (
                <div className="text-slate-400 text-sm text-center">
                  Waiting for winner...
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Match status */}
        <div className="mt-3 text-center">
          {!user && match.team1 && match.team2 && !match.winner && (
            <p className="text-xs text-slate-500">Login required to advance teams</p>
          )}
          {isClickable && (
            <p className="text-xs text-blue-600">Click team to advance</p>
          )}
          {match.winner && (
            <p className="text-xs text-green-600 font-semibold">
              Winner: {match.winner.player1} & {match.winner.player2}
            </p>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const maxRound = Math.max(...matches.map(m => m.round), 0);
  const finalMatch = matches.find(m => m.round === maxRound);

  return (
    <div className="space-y-8">
      {/* Tournament Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          {gameType.charAt(0).toUpperCase() + gameType.slice(1)} Tournament
        </h3>
        <p className="text-slate-600 mb-4">
          <Users className="w-4 h-4 inline mr-1" />
          {teams.length} teams • {participants.length} participants
        </p>
        
        {/* Controls */}
        <div className="flex justify-center space-x-4 mb-6">
          <Button
            onClick={() => setShowParticipants(!showParticipants)}
            variant="outline"
            size="sm"
            className="border-blue-300 text-blue-600 hover:bg-blue-50"
          >
            <UserCheck className="w-4 h-4 mr-2" />
            {showParticipants ? 'Hide' : 'Show'} Participants
          </Button>
          
          {user && matchHistory.length > 1 && (
            <Button
              onClick={handleUndo}
              variant="outline"
              size="sm"
              className="border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              <Undo2 className="w-4 h-4 mr-2" />
              Undo Last Action
            </Button>
          )}
          
          {!user && (
            <Button
              onClick={openAuthModal}
              variant="outline"
              size="sm"
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              <Lock className="w-4 h-4 mr-2" />
              Login to Advance Teams
            </Button>
          )}
        </div>
      </div>

      {/* Participant Manager */}
      {showParticipants && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-slate-200"
        >
          <ParticipantManager 
            gameType={gameType} 
            onParticipantsChange={handleParticipantsChange}
          />
        </motion.div>
      )}

      {/* Tournament Bracket */}
      <div className="overflow-x-auto">
        <div className="min-w-[1000px] p-6">
          {/* Bracket Layout */}
          <div className="flex items-start justify-center space-x-12">
            {/* Render rounds dynamically */}
            {Array.from({ length: maxRound }, (_, roundIndex) => {
              const round = roundIndex + 1;
              const roundMatches = matches.filter(m => m.round === round);
              
              return (
                <div key={round} className="space-y-12">
                  <h4 className="text-lg font-semibold text-slate-800 text-center mb-4">
                    {round === maxRound ? 'Championship' : `Round ${round}`}
                  </h4>
                  {roundMatches.map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              );
            })}
          </div>

          {/* Champion Display */}
          {finalMatch?.winner && (
            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-6 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg shadow-lg max-w-md mx-auto">
                <Crown className="w-12 h-12 mx-auto mb-3" />
                <h5 className="font-bold text-2xl mb-2">Tournament Champions!</h5>
                <p className="text-lg">
                  {finalMatch.winner.player1} & {finalMatch.winner.player2}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center">
        <div className="bg-slate-50 p-4 rounded-lg max-w-2xl mx-auto border border-slate-200">
          <p className="text-slate-700">
            <strong>Tournament Management:</strong> Anyone can add or remove participants to generate teams automatically. 
            {user 
              ? ' Click on team names to advance them through the bracket. Use the undo button to correct mistakes.' 
              : ' Login is required to advance teams through the bracket.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default TournamentBracket;