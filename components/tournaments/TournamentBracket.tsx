import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Users, Crown, RotateCcw, Settings } from 'lucide-react';
import ParticipantManager from './ParticipantManager';

interface Team {
  id: string;
  name: string;
  maleId: string;
  femaleId: string;
  isReplacementTeam?: boolean;
}

interface Participant {
  id: string;
  name: string;
  gender: 'male' | 'female';
  gameType: string;
}

interface Match {
  id: string;
  team1?: Team;
  team2?: Team;
  winner?: Team;
  round: number;
  position: number;
  isBye?: boolean;
  isReplacementSlot?: boolean;
  isPreliminary?: boolean;
}

interface TournamentBracketProps {
  teams?: Team[];
  onTeamsChange?: (teams: Team[]) => void;
  gameType?: string;
}

// Add this helper at the top (or import from elsewhere)
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const TournamentBracket: React.FC<TournamentBracketProps> = ({ 
  teams: initialTeams = [], 
  onTeamsChange,
  gameType = 'Tournament'
}) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [tournamentStarted, setTournamentStarted] = useState(false);
  const [showParticipantManager, setShowParticipantManager] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [extraParticipants, setExtraParticipants] = useState<{ males: Participant[], females: Participant[] }>({ males: [], females: [] });
  const [replacementTeams, setReplacementTeams] = useState<Team[]>([]);

  // Convert participants to teams (mixed gender pairs) and track extras
  const convertParticipantsToTeams = useCallback((participantList: Participant[]): { teams: Team[], extras: { males: Participant[], females: Participant[] } } => {
    // RANDOMIZE the order here!
    const males = shuffleArray(participantList.filter(p => p.gender === 'male'));
    const females = shuffleArray(participantList.filter(p => p.gender === 'female'));
    const teamsFromParticipants: Team[] = [];

    // Create teams by pairing males and females
    const minCount = Math.min(males.length, females.length);
    for (let i = 0; i < minCount; i++) {
      teamsFromParticipants.push({
        id: `team-${males[i].id}-${females[i].id}`,
        name: `${males[i].name} & ${females[i].name}`,
        maleId: males[i].id,
        femaleId: females[i].id
      });
    }

    // Track extra participants
    const extraMales = males.slice(minCount);
    const extraFemales = females.slice(minCount);

    return {
      teams: teamsFromParticipants,
      extras: { males: extraMales, females: extraFemales }
    };
  }, []);

  // Create replacement teams from extra participants
  const createReplacementTeams = useCallback((extras: { males: Participant[], females: Participant[] }): Team[] => {
    const replacementTeamsList: Team[] = [];
    
    // Create placeholder teams for extra males (waiting for female partners)
    extras.males.forEach((male) => {
      replacementTeamsList.push({
        id: `replacement-male-${male.id}`,
        name: `${male.name} & [Waiting for partner]`,
        maleId: male.id,
        femaleId: '',
        isReplacementTeam: true
      });
    });

    // Create placeholder teams for extra females (waiting for male partners)
    extras.females.forEach((female) => {
      replacementTeamsList.push({
        id: `replacement-female-${female.id}`,
        name: `[Waiting for partner] & ${female.name}`,
        maleId: '',
        femaleId: female.id,
        isReplacementTeam: true
      });
    });

    return replacementTeamsList;
  }, []);

  // Handle participant changes from ParticipantManager
  const handleParticipantsChange = useCallback((newParticipants: Participant[]) => {
    setParticipants(newParticipants);
    
    // Convert participants to teams and track extras
    const { teams: teamsFromParticipants, extras } = convertParticipantsToTeams(newParticipants);
    setExtraParticipants(extras);
    
    // Create replacement teams for extras
    const newReplacementTeams = createReplacementTeams(extras);
    setReplacementTeams(newReplacementTeams);
    
    // Update main teams list
    setTeams(teamsFromParticipants);
    onTeamsChange?.(teamsFromParticipants);
  }, [convertParticipantsToTeams, createReplacementTeams, onTeamsChange]);

  // Check if a team is complete (has both male and female)
  const isTeamComplete = useCallback((team?: Team): boolean => {
    return !!(team && team.maleId && team.femaleId);
  }, []);

  // Calculate tournament structure
  const calculateTournamentStructure = useCallback((totalTeams: number) => {
    if (totalTeams < 2) return { preliminaryMatches: 0, mainBracketTeams: totalTeams, totalRounds: 0 };

    // Find the largest power of 2 that is less than or equal to totalTeams
    const largestPowerOf2 = Math.pow(2, Math.floor(Math.log2(totalTeams)));
    
    // If totalTeams is already a power of 2, no preliminary round needed
    if (totalTeams === largestPowerOf2) {
      return {
        preliminaryMatches: 0,
        mainBracketTeams: totalTeams,
        totalRounds: Math.log2(totalTeams)
      };
    }

    // Calculate how many teams need to play in preliminary round
    const teamsNeedingPrelim = totalTeams - largestPowerOf2;
    const preliminaryMatches = teamsNeedingPrelim;
    const mainBracketTeams = largestPowerOf2;
    const totalRounds = Math.log2(mainBracketTeams) + 1; // +1 for preliminary round

    return {
      preliminaryMatches,
      mainBracketTeams,
      totalRounds
    };
  }, []);

  // Generate bracket structure with proper preliminary rounds and byes
  const generateBracket = useCallback((teamList: Team[], replacementTeamList: Team[]): Match[] => {
    if (teamList.length < 1) return [];

    // Separate matched and replacement teams
    const matchedTeams = teamList; // Only matched teams (from convertParticipantsToTeams)
    const replacementTeamsOnly = replacementTeamList; // Only replacement teams

    const allTeams = [...matchedTeams, ...replacementTeamsOnly];
    const totalTeams = allTeams.length;
    if (totalTeams < 2) return [];

    // Calculate tournament structure
    const { preliminaryMatches, mainBracketTeams, totalRounds } = calculateTournamentStructure(totalTeams);
    
    const bracketMatches: Match[] = [];
    let matchId = 1;

    // Shuffle matched teams for preliminary round
    const shuffledMatchedTeams = [...matchedTeams].sort(() => Math.random() - 0.5);

    // Create preliminary round using only matched teams
    if (preliminaryMatches > 0) {
      for (let i = 0; i < preliminaryMatches; i++) {
        const team1 = shuffledMatchedTeams[i * 2];
        const team2 = shuffledMatchedTeams[i * 2 + 1];
        bracketMatches.push({
          id: `match-${matchId++}`,
          team1,
          team2,
          round: 1,
          position: i,
          isPreliminary: true,
          isReplacementSlot: !isTeamComplete(team1) || !isTeamComplete(team2)
        });
      }
    }

    // Remove preliminary teams from the pool for round 2
    const usedMatchedTeamIds = new Set();
    for (let i = 0; i < preliminaryMatches * 2; i++) {
      if (shuffledMatchedTeams[i]) usedMatchedTeamIds.add(shuffledMatchedTeams[i].id);
    }
    const remainingMatchedTeams = matchedTeams.filter(t => !usedMatchedTeamIds.has(t.id));

    // Now build the round 2 pool: remaining matched teams + all replacement teams
    const round2Teams = [...remainingMatchedTeams, ...replacementTeamsOnly];
    // Shuffle if you want, or keep order

    // Calculate how many teams get byes to Round 2
    const byeTeamsCount = mainBracketTeams - preliminaryMatches;

    // Assign bye teams to the top of Round 2
    const byeTeams = round2Teams.slice(0, byeTeamsCount);

    const round2Matches: Match[] = [];
    const totalRound2Matches = mainBracketTeams / 2;
    let round2MatchId = matchId;

    // Fill the top matches with bye teams
    for (let i = 0; i < byeTeams.length / 2; i++) {
      round2Matches.push({
        id: `match-${round2MatchId++}`,
        round: 2,
        position: i,
        team1: byeTeams[i * 2],
        team2: byeTeams[i * 2 + 1],
        isReplacementSlot: !isTeamComplete(byeTeams[i * 2]) || !isTeamComplete(byeTeams[i * 2 + 1]),
      });
    }

    // Fill the rest with empty slots for preliminary winners
    for (let i = byeTeams.length / 2; i < totalRound2Matches; i++) {
      round2Matches.push({
        id: `match-${round2MatchId++}`,
        round: 2,
        position: i,
        // team1 and team2 left undefined for preliminary winners
      });
    }
    matchId = round2MatchId;

    bracketMatches.push(...round2Matches);

    // Now create quarter-final, semi-final, and final rounds
    let prevRoundMatches = totalRound2Matches;
    let round = 3;
    while (prevRoundMatches > 1) {
      const matchesInThisRound = Math.floor(prevRoundMatches / 2);
      for (let i = 0; i < matchesInThisRound; i++) {
        bracketMatches.push({
          id: `match-${matchId++}`,
          round,
          position: i
        });
      }
      prevRoundMatches = matchesInThisRound;
      round++;
    }

    console.log(`Generated bracket: ${preliminaryMatches} preliminary matches, ${mainBracketTeams} main bracket teams, ${totalRounds} total rounds`);
    return bracketMatches;
  }, [isTeamComplete, calculateTournamentStructure]);

  // Handle when a team loses and needs to provide a partner for replacement team
  const handleTeamLoss = useCallback((losingTeam: Team) => {
    console.log('handleTeamLoss called with:', losingTeam);
    
    if (!losingTeam.maleId || !losingTeam.femaleId) {
      console.log('Losing team is incomplete, skipping');
      return;
    }

    // Find the first incomplete replacement team that needs the opposite gender
    const incompleteReplacementTeam = replacementTeams.find(rt => 
      (rt.maleId && !rt.femaleId) || (rt.femaleId && !rt.maleId)
    );

    console.log('Found incomplete replacement team:', incompleteReplacementTeam);
    console.log('Current replacement teams:', replacementTeams);

    if (incompleteReplacementTeam) {
      const losingMale = participants.find(p => p.id === losingTeam.maleId);
      const losingFemale = participants.find(p => p.id === losingTeam.femaleId);

      console.log('Losing male:', losingMale);
      console.log('Losing female:', losingFemale);

      // Complete the replacement team
      let updatedReplacementTeam = { ...incompleteReplacementTeam };
      let partnerFound = false;
      
      if (incompleteReplacementTeam.maleId && !incompleteReplacementTeam.femaleId && losingFemale) {
        const extraMale = participants.find(p => p.id === incompleteReplacementTeam.maleId);
        updatedReplacementTeam.femaleId = losingFemale.id;
        updatedReplacementTeam.name = `${extraMale?.name} & ${losingFemale.name}`;
        updatedReplacementTeam.isReplacementTeam = false; // Now it's a complete team
        partnerFound = true;
        console.log('Paired losing female with extra male:', updatedReplacementTeam);
      } else if (incompleteReplacementTeam.femaleId && !incompleteReplacementTeam.maleId && losingMale) {
        const extraFemale = participants.find(p => p.id === incompleteReplacementTeam.femaleId);
        updatedReplacementTeam.maleId = losingMale.id;
        updatedReplacementTeam.name = `${losingMale.name} & ${extraFemale?.name}`;
        updatedReplacementTeam.isReplacementTeam = false; // Now it's a complete team
        partnerFound = true;
        console.log('Paired losing male with extra female:', updatedReplacementTeam);
      }

      if (partnerFound) {
        // Update replacement teams list first
        setReplacementTeams(prev => {
          const updated = prev.map(rt => rt.id === incompleteReplacementTeam.id ? updatedReplacementTeam : rt);
          console.log('Updated replacement teams:', updated);
          return updated;
        });

        // Update matches to include the completed replacement team and remove replacement slot status
        setMatches(prevMatches => {
          const updatedMatches = prevMatches.map(match => {
            if ((match.team1?.id === incompleteReplacementTeam.id) || 
                (match.team2?.id === incompleteReplacementTeam.id)) {
              const updatedMatch = {
                ...match,
                team1: match.team1?.id === incompleteReplacementTeam.id ? updatedReplacementTeam : match.team1,
                team2: match.team2?.id === incompleteReplacementTeam.id ? updatedReplacementTeam : match.team2,
                isReplacementSlot: false // Now both teams are complete, so it's no longer a replacement slot
              };
              console.log('Updated match:', updatedMatch);
              return updatedMatch;
            }
            return match;
          });
          console.log('All updated matches:', updatedMatches);
          return updatedMatches;
        });
      }
    } else {
      console.log('No incomplete replacement team found');
    }
  }, [replacementTeams, participants]);

  // Advance bye winners and preliminary winners automatically
  const advanceWinners = useCallback((bracketMatches: Match[]) => {
    const updatedMatches = [...bracketMatches];
    
    // Find all bye matches and advance their winners
    const byeMatches = updatedMatches.filter(m => m.isBye && m.winner);
    
    byeMatches.forEach(byeMatch => {
      const nextRoundMatch = updatedMatches.find(
        m => m.round === byeMatch.round + 1 && 
        Math.floor(m.position) === Math.floor(byeMatch.position / 2)
      );

      if (nextRoundMatch && byeMatch.winner) {
        if (byeMatch.position % 2 === 0) {
          nextRoundMatch.team1 = byeMatch.winner;
        } else {
          nextRoundMatch.team2 = byeMatch.winner;
        }
      }
    });

    return updatedMatches;
  }, []);

  // Update matches when tournament starts (only once)
  useEffect(() => {
    if (tournamentStarted && teams.length >= 1) {
      const newMatches = generateBracket(teams, replacementTeams);
      const matchesWithAdvancement = advanceWinners(newMatches);
      setMatches(matchesWithAdvancement);
    }
  }, [tournamentStarted]); // Only depend on tournamentStarted

  const startTournament = () => {
    if (teams.length >= 1) {
      setTournamentStarted(true);
    }
  };

  const resetTournament = () => {
    setTournamentStarted(false);
    setMatches([]);
  };

  const selectWinner = (matchId: string, winner: Team) => {
    if (!winner) return;

    console.log('selectWinner called:', { matchId, winner });

    const currentMatch = matches.find(m => m.id === matchId);
    const loser = currentMatch?.team1?.id === winner.id ? currentMatch.team2 : currentMatch?.team1;

    console.log('Current match:', currentMatch);
    console.log('Loser:', loser);

    const updatedMatches = matches.map(match => {
      if (match.id === matchId) {
        return { ...match, winner };
      }
      return match;
    });

    // Clear any downstream effects of the previous winner
    if (currentMatch && currentMatch.winner && currentMatch.winner.id !== winner.id) {
      clearDownstreamWinners(updatedMatches, currentMatch);
    }

    // Handle team loss for replacement team creation - ONLY for first round matches and non-replacement teams
    if (loser && (currentMatch?.round === 1 || currentMatch?.isPreliminary) && !loser.isReplacementTeam) {
      console.log('Calling handleTeamLoss for first round loss');
      // Use setTimeout to ensure state updates happen after current render cycle
      setTimeout(() => {
        handleTeamLoss(loser);
      }, 0);
    }

    // Handle preliminary match special case FIRST
    if (currentMatch?.isPreliminary) {
      setMatches(prevMatches => {
        const updated = prevMatches.map(m => ({ ...m }));
        // Find all round 2 matches with at least one undefined team
        const round2Matches = updated.filter(
          m => m.round === 2 && (!m.team1 || !m.team2)
        );
        // Place winner in the first available slot (team1, then team2)
        for (let m of round2Matches) {
          if (!m.team1) {
            m.team1 = winner;
            break;
          } else if (!m.team2) {
            m.team2 = winner;
            break;
          }
        }
        // Now update the winner for the preliminary match
        return updated.map(match => match.id === matchId ? { ...match, winner } : match);
      });
      return;
    }

    // Advance new winner to next round (for non-preliminary matches only)
    if (currentMatch) {
      const nextRoundMatch = updatedMatches.find(
        m => m.round === currentMatch.round + 1 && 
        Math.floor(m.position) === Math.floor(currentMatch.position / 2)
      );

      if (nextRoundMatch) {
        if (currentMatch.position % 2 === 0) {
          nextRoundMatch.team1 = winner;
        } else {
          nextRoundMatch.team2 = winner;
        }
      }
    }

    setMatches(updatedMatches);
  };

  // Clear downstream winners when a match result changes
  const clearDownstreamWinners = (bracketMatches: Match[], changedMatch: Match) => {
    const nextRoundMatch = bracketMatches.find(
      m => m.round === changedMatch.round + 1 && 
      Math.floor(m.position) === Math.floor(changedMatch.position / 2)
    );

    if (nextRoundMatch) {
      // Clear the team slot that this match feeds into
      if (changedMatch.position % 2 === 0) {
        nextRoundMatch.team1 = undefined;
      } else {
        nextRoundMatch.team2 = undefined;
      }

      // If this match had a winner, clear it and cascade
      if (nextRoundMatch.winner) {
        nextRoundMatch.winner = undefined;
        clearDownstreamWinners(bracketMatches, nextRoundMatch);
      }
    }
  };

  const resetMatch = (matchId: string) => {
    const updatedMatches = matches.map(match => {
      if (match.id === matchId) {
        return { ...match, winner: undefined };
      }
      return match;
    });

    // Clear downstream effects
    const currentMatch = matches.find(m => m.id === matchId);
    if (currentMatch) {
      clearDownstreamWinners(updatedMatches, currentMatch);
    }

    setMatches(updatedMatches);
  };

  const getRoundName = (round: number, totalRounds: number, isPreliminary?: boolean) => {
    if (isPreliminary) return 'Preliminary';
    if (round === totalRounds) return 'Final';
    if (round === totalRounds - 1) return 'Semi-Final';
    if (round === totalRounds - 2) return 'Quarter-Final';
    return `Round ${round}`;
  };

  const totalRounds = matches.length > 0 ? Math.max(...matches.map(m => m.round)) : 0;
  const champion = matches.find(m => m.round === totalRounds && m.winner);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-10 h-10 text-yellow-500" />
            <h1 className="text-4xl font-bold text-gray-800">{gameType} Tournament Bracket</h1>
            <Trophy className="w-10 h-10 text-yellow-500" />
          </div>
          <p className="text-gray-600 text-lg">Single Elimination Championship</p>
        </div>

        {/* Champion Display */}
        {champion && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-8 py-4 rounded-full shadow-lg">
              <Crown className="w-8 h-8" />
              <span className="text-2xl font-bold">Champion: {champion.winner?.name}</span>
              <Crown className="w-8 h-8" />
            </div>
          </div>
        )}

        {!tournamentStarted ? (
          // Team Setup
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Tournament Setup</h2>
                </div>
                
                {/* Manage Participants Button */}
                <button
                  onClick={() => setShowParticipantManager(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Manage Participants
                </button>
              </div>

              {/* Tournament Structure Preview */}
              {teams.length > 0 && (
                <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">Tournament Structure</h3>
                  {(() => {
                    const totalTeams = teams.length + replacementTeams.length;
                    const { preliminaryMatches, mainBracketTeams, totalRounds } = calculateTournamentStructure(totalTeams);
                    
                    return (
                      <div className="text-sm text-green-700">
                        <p><strong>Total Teams:</strong> {totalTeams}</p>
                        {preliminaryMatches > 0 && (
                          <p><strong>Preliminary Round:</strong> {preliminaryMatches} matches</p>
                        )}
                        <p><strong>Main Bracket:</strong> {mainBracketTeams} teams</p>
                        <p><strong>Total Rounds:</strong> {totalRounds}</p>
                        {totalTeams - (preliminaryMatches * 2) > 0 && (
                          <p><strong>Teams with Byes:</strong> {totalTeams - (preliminaryMatches * 2)}</p>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Participant Summary */}
              {participants.length > 0 && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">Participant Summary</h3>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {participants.filter(p => p.gender === 'male').length}
                      </div>
                      <div className="text-blue-700">Males</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-pink-600">
                        {participants.filter(p => p.gender === 'female').length}
                      </div>
                      <div className="text-pink-700">Females</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {teams.length}
                      </div>
                      <div className="text-green-700">Teams</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">
                        {extraParticipants.males.length + extraParticipants.females.length}
                      </div>
                      <div className="text-orange-700">Extras</div>
                    </div>
                  </div>
                  
                  {(extraParticipants.males.length > 0 || extraParticipants.females.length > 0) && (
                    <div className="mt-3 text-xs text-gray-600 bg-yellow-50 p-2 rounded border border-yellow-200">
                      <p>
                        <strong>Note:</strong> Extra participants will be paired with the first losing team member of the opposite gender.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Teams List */}
              {teams.length > 0 && (
                <div className="space-y-3 mb-6">
                  <h3 className="font-semibold text-gray-800">Registered Teams</h3>
                  {teams.map((team, index) => (
                    <div key={team.id} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <span className="font-medium text-gray-800">{team.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Replacement Teams Preview */}
              {replacementTeams.length > 0 && (
                <div className="space-y-3 mb-6">
                  <h3 className="font-semibold text-gray-800">Waiting for Partners</h3>
                  {replacementTeams.map((team, index) => (
                    <div key={team.id} className="flex items-center justify-between bg-orange-50 px-4 py-3 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          R{index + 1}
                        </span>
                        <span className="font-medium text-gray-800">{team.name}</span>
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                          Replacement Team
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Start Tournament Button */}
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  {teams.length} teams ready to compete
                  {teams.length < 1 && ' (add participants to create teams)'}
                </p>
                <button
                  onClick={startTournament}
                  disabled={teams.length < 1}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg font-semibold"
                >
                  Start Tournament
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Tournament Bracket
          <div className="space-y-8">
            {/* Control Buttons */}
            <div className="text-center space-x-4">
              <button
                onClick={() => setShowParticipantManager(true)}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Manage Participants
              </button>
              <button
                onClick={resetTournament}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reset Tournament
              </button>
            </div>

            {/* Bracket Display */}
            <div className="bg-white rounded-2xl shadow-xl p-8 overflow-x-auto">
              <div className="flex gap-8 min-w-max">
                {Array.from({ length: totalRounds }, (_, roundIndex) => {
                  const round = roundIndex + 1;
                  const roundMatches = matches.filter(m => m.round === round);
                  const isPreliminaryRound = roundMatches.some(m => m.isPreliminary);
                  
                  return (
                    <div key={round} className="flex flex-col gap-4 min-w-64">
                      <h3 className="text-xl font-bold text-center text-gray-800 mb-4">
                        {getRoundName(round, totalRounds, isPreliminaryRound)}
                      </h3>
                      
                      <div className="flex flex-col gap-6">
                        {roundMatches.map((match, matchIdx) => {
                          // Check if match is ready for winner selection
                          const canSelectWinner = match.team1 && match.team2 && !match.isBye && 
                                                 isTeamComplete(match.team1) && isTeamComplete(match.team2);
                          
                          return (
                            <div key={match.id} className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 relative">
                              {/* Match number centered at the top */}
                              <div className="absolute left-1/2 -translate-x-1/2 top-2 text-xs text-gray-400 font-semibold pointer-events-none">
                                Match {matchIdx + 1}
                              </div>
                              <div className="pt-6">
                                {/* Special indicators */}
                                {match.isBye && (
                                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                    BYE
                                  </div>
                                )}
                                {match.isReplacementSlot && (
                                  <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                                    WAITING
                                  </div>
                                )}
                                {match.isPreliminary && (
                                  <div className="absolute -top-2 -left-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                                    PRELIM
                                  </div>
                                )}

                                <div className="space-y-3">
                                  {/* Team 1 */}
                                  <div 
                                    className={`p-3 rounded transition-colors ${
                                      match.winner?.id === match.team1?.id 
                                        ? 'bg-green-500 text-white' 
                                        : match.team1 && canSelectWinner
                                        ? 'bg-white border-2 border-gray-300 hover:border-blue-400 cursor-pointer' 
                                        : 'bg-gray-200 text-gray-500'
                                    }`}
                                    onClick={() => match.team1 && canSelectWinner && selectWinner(match.id, match.team1)}
                                  >
                                    <div className="font-medium">
                                      {match.team1?.name || 'TBD'}
                                    </div>
                                    {match.team1?.isReplacementTeam && (
                                      <div className="text-xs text-orange-600 mt-1">Replacement Team</div>
                                    )}
                                  </div>

                                  {!match.isBye && (
                                    <>
                                      <div className="text-center text-gray-400 font-bold">VS</div>

                                      {/* Team 2 */}
                                      <div 
                                        className={`p-3 rounded transition-colors ${
                                          match.winner?.id === match.team2?.id 
                                            ? 'bg-green-500 text-white' 
                                            : match.team2 && canSelectWinner
                                            ? 'bg-white border-2 border-gray-300 hover:border-blue-400 cursor-pointer' 
                                            : 'bg-gray-200 text-gray-500'
                                        }`}
                                        onClick={() => match.team2 && canSelectWinner && selectWinner(match.id, match.team2)}
                                      >
                                        <div className="font-medium">
                                          {match.team2?.name || 'TBD'}
                                        </div>
                                        {match.team2?.isReplacementTeam && (
                                          <div className="text-xs text-orange-600 mt-1">Replacement Team</div>
                                        )}
                                      </div>
                                    </>
                                  )}
                                </div>

                                {/* Match controls */}
                                {canSelectWinner && (
                                  <div className="mt-3 flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                      {match.winner ? 'Winner selected' : 'Click team to select winner'}
                                    </div>
                                    {match.winner && (
                                      <button
                                        onClick={() => resetMatch(match.id)}
                                        className="text-gray-500 hover:text-red-600 p-1"
                                        title="Reset match"
                                      >
                                        <RotateCcw className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                )}

                                {match.isBye && (
                                  <div className="mt-3 text-center text-sm text-blue-600 font-medium">
                                    Automatic advancement
                                  </div>
                                )}

                                {match.isReplacementSlot && (
                                  <div className="mt-3 text-center text-sm text-orange-600 font-medium">
                                    Waiting for replacement team
                                  </div>
                                )}

                                {match.team1 && match.team2 && !canSelectWinner && !match.isBye && !match.isReplacementSlot && (
                                  <div className="mt-3 text-center text-sm text-yellow-600 font-medium">
                                    Team formation in progress
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Participant Manager Modal */}
        <ParticipantManager
          gameType={gameType}
          onParticipantsChange={handleParticipantsChange}
          isOpen={showParticipantManager}
          onClose={() => setShowParticipantManager(false)}
        />
      </div>
    </div>
  );
};

export default TournamentBracket;