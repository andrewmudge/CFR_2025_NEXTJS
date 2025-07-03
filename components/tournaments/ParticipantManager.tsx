import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, UserPlus, X, TestTube } from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  gender: 'male' | 'female';
  gameType: string;
}

interface ParticipantManagerProps {
  gameType: string;
  onParticipantsChange: (participants: Participant[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ParticipantManager: React.FC<ParticipantManagerProps> = ({
  gameType,
  onParticipantsChange,
  isOpen,
  onClose,
}) => {
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
      alert('Please enter a participant name');
      return;
    }

    const participant: Participant = {
      id: Date.now().toString(),
      name: newParticipant.name.trim(),
      gender: newParticipant.gender,
      gameType,
    };

    setParticipants((prev) => [...prev, participant]);
    setNewParticipant({ name: '', gender: 'male' });
    setShowAddForm(false);
  };

  const handleRemoveParticipant = (participantId: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== participantId));
  };

  // Production test function to add sample participants
  const addTestParticipants = () => {
    const testParticipants: Participant[] = [];
    for (let i = 1; i <= 32; i++) {
      testParticipants.push({
        id: `test-male-${i}-${Date.now()}`,
        name: `Male ${i}`,
        gender: 'male',
        gameType,
      });
    }
    for (let i = 1; i <= 29; i++) {
      testParticipants.push({
        id: `test-female-${i}-${Date.now()}`,
        name: `Female ${i}`,
        gender: 'female',
        gameType,
      });
    }
    setParticipants((prev) => [...prev, ...testParticipants]);
  };

  const clearAllParticipants = () => {
    if (confirm('Are you sure you want to clear all participants?')) {
      setParticipants([]);
    }
  };

  const maleParticipants = participants.filter((p) => p.gender === 'male');
  const femaleParticipants = participants.filter((p) => p.gender === 'female');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center">
              <Users className="w-6 h-6 mr-3 text-blue-600" />
              Manage Participants - {gameType}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {/* Production Test Button */}
              <button
                onClick={addTestParticipants}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <TestTube className="w-4 h-4" />
                Add Test Data (20M/17F)
              </button>

              <button
                onClick={clearAllParticipants}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear All
              </button>
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Participant
            </button>
          </div>

          {/* Add Participant Form */}
          {showAddForm && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4">Add New Participant</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter participant name"
                    value={newParticipant.name}
                    onChange={(e) =>
                      setNewParticipant((prev) => ({ ...prev, name: e.target.value }))
                    }
                    onKeyPress={(e) => e.key === 'Enter' && handleAddParticipant()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={newParticipant.gender}
                    onChange={(e) =>
                      setNewParticipant((prev) => ({
                        ...prev,
                        gender: e.target.value as 'male' | 'female',
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={handleAddParticipant}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Participant
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Participants Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Male Participants */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                <UserPlus className="w-4 h-4 mr-2" />
                Male Participants ({maleParticipants.length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {maleParticipants.length === 0 ? (
                  <p className="text-blue-600 text-sm italic">No male participants yet</p>
                ) : (
                  maleParticipants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between bg-white p-3 rounded border border-blue-200"
                    >
                      <span className="text-gray-800 font-medium">{participant.name}</span>
                      <button
                        onClick={() => handleRemoveParticipant(participant.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Female Participants */}
            <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
              <h4 className="font-semibold text-pink-800 mb-3 flex items-center">
                <UserPlus className="w-4 h-4 mr-2" />
                Female Participants ({femaleParticipants.length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {femaleParticipants.length === 0 ? (
                  <p className="text-pink-600 text-sm italic">No female participants yet</p>
                ) : (
                  femaleParticipants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between bg-white p-3 rounded border border-pink-200"
                    >
                      <span className="text-gray-800 font-medium">{participant.name}</span>
                      <button
                        onClick={() => handleRemoveParticipant(participant.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Team Formation Status */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3">Team Formation Status</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{maleParticipants.length}</div>
                <div className="text-gray-600">Males</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">{femaleParticipants.length}</div>
                <div className="text-gray-600">Females</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.min(maleParticipants.length, femaleParticipants.length)}
                </div>
                <div className="text-gray-600">Possible Teams</div>
              </div>
            </div>

            {participants.length > 0 && (
              <div className="mt-3 text-xs text-gray-600">
                <p>
                  <strong>Note:</strong> Teams consist of 1 male + 1 female.
                  {maleParticipants.length !== femaleParticipants.length &&
                    ` Extra ${maleParticipants.length > femaleParticipants.length ? 'males' : 'females'} will be alternates.`
                  }
                </p>
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantManager;