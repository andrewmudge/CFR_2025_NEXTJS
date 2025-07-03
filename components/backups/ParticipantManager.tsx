'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Trash2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Participant {
  id: string;
  name: string;
  gender: 'male' | 'female';
  gameType: string;
}

interface ParticipantManagerProps {
  gameType: string;
  onParticipantsChange: (participants: Participant[]) => void;
}

const ParticipantManager = ({ gameType, onParticipantsChange }: ParticipantManagerProps) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newParticipant, setNewParticipant] = useState({
    name: '',
    gender: 'male' as 'male' | 'female',
  });

  // Load participants from localStorage on component mount
  useEffect(() => {
    const savedParticipants = localStorage.getItem(`participants_${gameType}`);
    if (savedParticipants) {
      const parsed = JSON.parse(savedParticipants);
      setParticipants(parsed);
      onParticipantsChange(parsed);
    }
  }, [gameType, onParticipantsChange]);

  // Save participants to localStorage whenever participants change
  useEffect(() => {
    localStorage.setItem(`participants_${gameType}`, JSON.stringify(participants));
    onParticipantsChange(participants);
  }, [participants, gameType, onParticipantsChange]);

  const handleAddParticipant = () => {
    if (!newParticipant.name.trim()) {
      toast.error('Please enter a participant name');
      return;
    }

    const participant: Participant = {
      id: Date.now().toString(),
      name: newParticipant.name.trim(),
      gender: newParticipant.gender,
      gameType,
    };

    setParticipants(prev => [...prev, participant]);
    setNewParticipant({ name: '', gender: 'male' });
    setShowAddForm(false);
    toast.success(`${participant.name} added to ${gameType} tournament`);
  };

  const handleRemoveParticipant = (participantId: string) => {
    const participant = participants.find(p => p.id === participantId);
    setParticipants(prev => prev.filter(p => p.id !== participantId));
    
    if (participant) {
      toast.success(`${participant.name} removed from tournament`);
    }
  };

  const maleParticipants = participants.filter(p => p.gender === 'male');
  const femaleParticipants = participants.filter(p => p.gender === 'female');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-xl font-bold text-slate-800 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Tournament Participants
        </h4>
        
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          size="sm"
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Participant
        </Button>
      </div>

      {/* Add Participant Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-slate-50 p-4 rounded-lg border border-slate-200"
        >
          <h5 className="font-semibold text-slate-800 mb-4">Add New Participant</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="participantName">Full Name</Label>
              <Input
                id="participantName"
                type="text"
                placeholder="Enter participant name"
                value={newParticipant.name}
                onChange={(e) => setNewParticipant(prev => ({ ...prev, name: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && handleAddParticipant()}
              />
            </div>
            <div>
              <Label htmlFor="participantGender">Gender</Label>
              <select
                id="participantGender"
                value={newParticipant.gender}
                onChange={(e) => setNewParticipant(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
          <div className="flex space-x-3 mt-4">
            <Button
              onClick={handleAddParticipant}
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Participant
            </Button>
            <Button
              onClick={() => setShowAddForm(false)}
              size="sm"
              variant="outline"
              className="border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      {/* Participants Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Male Participants */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h5 className="font-semibold text-blue-800 mb-3 flex items-center">
            <UserPlus className="w-4 h-4 mr-2" />
            Male Participants ({maleParticipants.length})
          </h5>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {maleParticipants.length === 0 ? (
              <p className="text-blue-600 text-sm italic">No male participants yet</p>
            ) : (
              maleParticipants.map((participant) => (
                <motion.div
                  key={participant.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between bg-white p-2 rounded border border-blue-200"
                >
                  <span className="text-slate-800 font-medium">{participant.name}</span>
                  <Button
                    onClick={() => handleRemoveParticipant(participant.id)}
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Female Participants */}
        <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
          <h5 className="font-semibold text-pink-800 mb-3 flex items-center">
            <UserPlus className="w-4 h-4 mr-2" />
            Female Participants ({femaleParticipants.length})
          </h5>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {femaleParticipants.length === 0 ? (
              <p className="text-pink-600 text-sm italic">No female participants yet</p>
            ) : (
              femaleParticipants.map((participant) => (
                <motion.div
                  key={participant.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between bg-white p-2 rounded border border-pink-200"
                >
                  <span className="text-slate-800 font-medium">{participant.name}</span>
                  <Button
                    onClick={() => handleRemoveParticipant(participant.id)}
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Team Formation Info */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <h5 className="font-semibold text-slate-800 mb-2">Team Formation Status</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{maleParticipants.length}</div>
            <div className="text-slate-600">Males</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600">{femaleParticipants.length}</div>
            <div className="text-slate-600">Females</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.min(maleParticipants.length, femaleParticipants.length)}
            </div>
            <div className="text-slate-600">Possible Teams</div>
          </div>
        </div>
        
        {participants.length > 0 && (
          <div className="mt-3 text-xs text-slate-600">
            <p>
              <strong>Note:</strong> Teams consist of 1 male + 1 female. 
              {maleParticipants.length !== femaleParticipants.length && 
                ` Extra ${maleParticipants.length > femaleParticipants.length ? 'males' : 'females'} will be alternates.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantManager;