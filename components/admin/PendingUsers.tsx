'use client';

import { useState, useEffect } from 'react';
import { Users, CheckCircle, XCircle, Clock, Mail, Phone, User, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAllUsers, updateUserStatus, type UserStatus } from '@/lib/user-status';
import { formatPhoneForDisplay } from '@/lib/phone-utils';
import { toast } from 'sonner';

export default function PendingUsers() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState<UserStatus[]>([]);
  const [pendingUsers, setPendingUsers] = useState<UserStatus[]>([]);
  const [formData, setFormData] = useState({
    email: '',
    givenName: '',
    familyName: '',
    phoneNumber: ''
  });

  const loadUsers = async (forceRefresh = false) => {
    setLoading(true);
    try {
      console.log('🔍 Loading users from new UserStatus system...', forceRefresh ? '(FORCE REFRESH)' : '');
      
      // Force cache clear on refresh
      if (forceRefresh && 'caches' in window) {
        try {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map(name => caches.delete(name)));
          console.log('🔍 Cache cleared');
        } catch (e) {
          console.log('🔍 Could not clear cache:', e);
        }
      }
      
      // Get all users from the new UserStatus system
      const users = await getAllUsers();
      console.log('🔍 All users loaded:', users.length);
      
      // Filter pending users
      const pending = users.filter(user => user.status === 'pending');
      console.log('🔍 Pending users found:', pending.length);
      
      setAllUsers(users);
      setPendingUsers(pending);
    } catch (error) {
      console.error('🔍 Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For now, this would need to be handled differently
      // since we're not directly adding to approved users anymore
      toast.info('Manual user addition needs to be implemented for new system');
      setFormData({ email: '', givenName: '', familyName: '', phoneNumber: '' });
      setShowAddForm(false);
    } catch (error) {
      toast.error('Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (user: UserStatus) => {
    try {
      console.log('Approving user:', user.email);
      
      const success = await updateUserStatus(user.id, 'approved');
      
      if (success) {
        toast.success(`Approved ${user.email}`);
        // Refresh the user list
        await loadUsers(true);
      } else {
        toast.error('Failed to approve user');
      }
    } catch (error) {
      console.error('Error approving user:', error);
      toast.error('Failed to approve user');
    }
  };

  const handleDenyUser = async (user: UserStatus) => {
    try {
      const success = await updateUserStatus(user.id, 'denied', 'Manual denial by admin');
      
      if (success) {
        toast.success(`Denied ${user.email}`);
        // Refresh the user list
        await loadUsers(true);
      } else {
        toast.error('Failed to deny user');
      }
    } catch (error) {
      console.error('Error denying user:', error);
      toast.error('Failed to deny user');
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Users className="w-5 h-5 mr-2 flex-shrink-0" />
          <span className="truncate">User Approval Management</span>
        </h3>
        <Button
          onClick={() => loadUsers(true)}
          disabled={loading}
          variant="outline"
          size="sm"
          className="bg-slate-700 border-slate-600 hover:bg-slate-600 text-white flex-shrink-0"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-green-600 hover:bg-green-700 flex-shrink-0"
            size="sm"
          >
            {showAddForm ? 'Cancel' : 'Add User'}
          </Button>
        </div>
      </div>

      {/* Pending Users List */}
      {pendingUsers.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white mb-3">Pending Approvals ({pendingUsers.length})</h4>
          <div className="space-y-3">
            {pendingUsers.map((user) => (
              <div
                key={user.email}
                className="bg-slate-700 rounded-lg p-4 border border-slate-600"
              >
                <div className="flex flex-col space-y-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-2">
                      <User className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                      <span className="text-white font-medium truncate">
                        {user.givenName} {user.familyName}
                      </span>
                      <span className="ml-2 px-2 py-1 rounded-full text-xs bg-yellow-900/30 text-yellow-300 flex-shrink-0">
                        PENDING
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-300">
                      <div className="flex items-center">
                        <Mail className="w-3 h-3 mr-2 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      {user.phoneNumber && (
                        <div className="flex items-center">
                          <Phone className="w-3 h-3 mr-2 flex-shrink-0" />
                          <span className="truncate">
                            {user.phoneNumber.startsWith('+1') 
                              ? formatPhoneForDisplay(user.phoneNumber.slice(2))
                              : user.phoneNumber
                            }
                          </span>
                        </div>
                      )}
                      <div className="text-xs text-gray-400">
                        Signed up: {new Date(user.registrationDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 sm:ml-4 sm:flex-shrink-0">
                    <Button
                      onClick={() => handleApproveUser(user)}
                      className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                      size="sm"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleDenyUser(user)}
                      variant="outline"
                      className="border-red-400 text-red-300 hover:bg-red-400 hover:text-white w-full sm:w-auto"
                      size="sm"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Deny
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAddForm ? (
        <form onSubmit={handleAddUser} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="givenName" className="text-gray-300">First Name</Label>
              <Input
                id="givenName"
                type="text"
                value={formData.givenName}
                onChange={(e) => handleInputChange('givenName', e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="familyName" className="text-gray-300">Last Name</Label>
              <Input
                id="familyName"
                type="text"
                value={formData.familyName}
                onChange={(e) => handleInputChange('familyName', e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="phoneNumber" className="text-gray-300">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="+1234567890"
            />
          </div>

          <div className="flex space-x-3">
            <Button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Adding...' : 'Approve User'}
            </Button>
            <Button
              type="button"
              onClick={() => setShowAddForm(false)}
              variant="outline"
              className="border-slate-600 text-slate-300"
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="mb-2">Manually approve individual users</p>
          <p className="text-sm">Users not in the CSV can be approved here</p>
        </div>
      )}
    </div>
  );
}