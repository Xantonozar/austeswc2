'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ExecutiveDashboard from '../../components/dashboard/ExecutiveDashboard';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('🏠 [DASHBOARD] Starting authentication check...');
      
      const token = localStorage.getItem('token');
      console.log('🏠 [DASHBOARD] Token from localStorage:', token ? `${token.substring(0, 50)}...` : 'null');
      
      if (!token) {
        console.log('❌ [DASHBOARD] No token found, redirecting to login');
        router.push('/login');
        return;
      }

      console.log('🏠 [DASHBOARD] Making request to /api/auth/me with token');
      
      // Log the exact headers being sent
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      console.log('🏠 [DASHBOARD] Request headers:', headers);
      
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: headers
      });

      console.log('🏠 [DASHBOARD] Response received:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ [DASHBOARD] Authentication successful:', {
          userId: data.data._id,
          email: data.data.email,
          role: data.data.role
        });
        setUser(data.data);
      } else {
        const errorData = await response.json();
        console.error('❌ [DASHBOARD] Authentication failed:', {
          status: response.status,
          error: errorData
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
    } catch (error) {
      console.error('❌ [DASHBOARD] Auth check failed:', {
        error: error.message,
        stack: error.stack
      });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    console.log('🏠 [DASHBOARD] User logging out');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-green-600 text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">ESWC Dashboard</h1>
                <p className="text-sm text-gray-600">Environmental Science & Wildlife Conservation</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-600 capitalize">{user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ExecutiveDashboard user={user} />
      </main>
    </div>
  );
}
