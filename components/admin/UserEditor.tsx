'use client';

import { useState, useEffect } from 'react';
import { Users, Search, Trash2, CheckCircle, XCircle, Mail, Phone, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { listAllCognitoUsers, deleteCognitoUser, type CognitoUserDetails } from '@/lib/cognito-admin';
import { checkUserApproval } from '@/lib/approved-users';
import { formatPhoneForDisplay } from '@/lib/phone-utils';
import { toast } from 'sonner';

export default function UserEditor() {
  const [users, setUsers] = useState<CognitoUserDetails[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<CognitoUserDetails[]>([]);
  const [approvalStatus, setApprovalStatus] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyNonApproved, setShowOnlyNonApproved] = useState(false);
  const [deleteUser, setDeleteUser] = useState<CognitoUserDetails | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const cognitoUsers = await listAllCognitoUsers();
      setUsers(cognitoUsers);
      setFilteredUsers(cognitoUsers);
      
      // Check approval status for each user
      const approvals: Record<string, boolean> = {};
      for (const user of cognitoUsers) {
        try {
          approvals[user.email] = await checkUserApproval(user.email);
        } catch (error) {
          approvals[user.email] = false;
        }
      }
      setApprovalStatus(approvals);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    let filtered = users;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.givenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phoneNumber.includes(searchTerm)
      );
    }
    
    // Apply approval filter
    if (showOnlyNonApproved) {
      filtered = filtered.filter(user => !approvalStatus[user.email]);
    }
    
    setFilteredUsers(filtered);
  }, [searchTerm, users, showOnlyNonApproved, approvalStatus]);

  const handleDeleteUser = async () => {
    if (!deleteUser) return;
    
    setDeleting(true);
    try {
      await deleteCognitoUser(deleteUser.username);
      toast.success(`Deleted user ${deleteUser.email}`);
      setDeleteUser(null);
      // Reload users after deletion
      await loadUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Users className="w-5 h-5 mr-2" />
          User Management
        </h3>
        <Button
          onClick={loadUsers}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
          size="sm"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search users by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-gray-400"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => setShowOnlyNonApproved(!showOnlyNonApproved)}
            variant={showOnlyNonApproved ? "default" : "outline"}
            className={showOnlyNonApproved 
              ? "bg-red-600 hover:bg-red-700 text-white" 
              : "border-red-400 text-red-300 hover:bg-red-400 hover:text-white"
            }
            size="sm"
          >
            <XCircle className="w-4 h-4 mr-2" />
            {showOnlyNonApproved ? 'Show All Users' : 'Show Non-Approved Only'}
          </Button>
          
          <span className="text-gray-400 text-sm">
            Showing {filteredUsers.length} of {users.length} users
          </span>
        </div>
      </div>

      {/* Users List */}
      {loading ? (
        <div className="text-center py-8 text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>{searchTerm ? 'No users found matching your search' : 'No users found'}</p>
        </div>
      ) : (
        <div className="h-96 overflow-y-auto space-y-4 pr-2">
          {filteredUsers.slice(0, 5).map((user) => (
            <div
              key={user.username}
              className="bg-slate-700 rounded-lg p-4 border border-slate-600"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-white font-medium">
                      {user.givenName} {user.familyName}
                    </span>
                    <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                      approvalStatus[user.email] 
                        ? 'bg-green-900/30 text-green-300' 
                        : 'bg-red-900/30 text-red-300'
                    }`}>
                      {approvalStatus[user.email] ? 'Approved' : 'Not Approved'}
                    </span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      user.userStatus === 'CONFIRMED' 
                        ? 'bg-blue-900/30 text-blue-300' 
                        : 'bg-yellow-900/30 text-yellow-300'
                    }`}>
                      {user.userStatus}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
                    <div className="flex items-center">
                      <Mail className="w-3 h-3 mr-2" />
                      {user.email}
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-3 h-3 mr-2" />
                      {formatPhoneForDisplay(user.phoneNumber.replace('+1', ''))}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-2" />
                      Joined: {user.userCreateDate.toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-400">
                        Username: {user.username}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  <Button
                    onClick={() => setDeleteUser(user)}
                    variant="outline"
                    className="border-red-400 text-red-300 hover:bg-red-400 hover:text-white"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredUsers.length > 5 && (
            <div className="text-center py-4 text-gray-400 text-sm border-t border-slate-600">
              Scroll up to see more users ({filteredUsers.length - 5} more)
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Delete User Account</DialogTitle>
            <DialogDescription className="text-gray-300">
              Are you sure you want to delete this user account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {deleteUser && (
            <div className="bg-slate-700 rounded-lg p-4 my-4">
              <div className="text-white font-medium mb-2">
                {deleteUser.givenName} {deleteUser.familyName}
              </div>
              <div className="text-gray-300 text-sm space-y-1">
                <div>Email: {deleteUser.email}</div>
                <div>Phone: {formatPhoneForDisplay(deleteUser.phoneNumber.replace('+1', ''))}</div>
                <div>Status: {deleteUser.userStatus}</div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteUser(null)}
              className="border-slate-600 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteUser}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? 'Deleting...' : 'Delete User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}