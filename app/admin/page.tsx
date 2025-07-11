'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { Shield, Users, BarChart3, Settings, LogOut, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PendingUsers from '@/components/admin/PendingUsers';
import UserEditor from '@/components/admin/UserEditor';

const ADMIN_EMAIL = 'mudge.andrew@gmail.com';

export default function AdminDashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showUserEditor, setShowUserEditor] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/?admin=true');
        return;
      }
      
      if (user.email === ADMIN_EMAIL) {
        setIsAuthorized(true);
      } else {
        router.push('/');
      }
    }
  }, [user, loading, router]);

  // Redirect authenticated admin users from home page
  useEffect(() => {
    if (user && user.email === ADMIN_EMAIL && window.location.pathname === '/' && window.location.search.includes('admin=true')) {
      router.push('/admin');
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Access Denied</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-red-500 mr-3" />
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {user?.attributes?.given_name || 'Admin'}</span>
              <Button
                onClick={signOut}
                variant="outline"
                size="sm"
                className="border-red-400 text-red-300 hover:bg-red-400 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
          {/* Right-justified Back Button */}
          <div className="flex justify-end pb-4">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-blue-400 text-blue-600 hover:bg-blue-400 hover:text-white"
            >
              <a href="https://churchwellreunion.com" target="_blank" rel="noopener noreferrer">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to churchwellreunion.com
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-white">--</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Photos Uploaded</p>
                <p className="text-2xl font-bold text-white">--</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center">
              <Settings className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">System Status</p>
                <p className="text-2xl font-bold text-green-400">Online</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              onClick={() => setShowUserEditor(!showUserEditor)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {showUserEditor ? 'Hide User Editor' : 'Edit Users'}
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Manage Photos
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              System Logs
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              Settings
            </Button>
          </div>
        </div>

        {/* User Editor */}
        {showUserEditor && (
          <div className="mt-8">
            <UserEditor />
          </div>
        )}

        {/* Manual User Approval */}
        <div className="mt-8">
          <PendingUsers />
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="text-gray-400">
            <p>No recent activity to display.</p>
          </div>
        </div>
      </main>
    </div>
  );
}