'use client';

import { useState } from 'react';

export default function DebugPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
  };

  const clearLogs = () => setLogs([]);

  const testLogin = async () => {
    setLoading(true);
    addLog('🔐 Starting login test...', 'info');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'admin@eswc.com',
          password: 'admin123456'
        })
      });
      
      const data = await response.json();
      addLog(`📡 Login response status: ${response.status}`, 'info');
      addLog(`📡 Login response data: ${JSON.stringify(data, null, 2)}`, 'info');
      
      if (data.success && data.data.token) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        addLog('✅ Token stored in localStorage', 'success');
        addLog(`🔑 Token: ${data.data.token.substring(0, 50)}...`, 'success');
      } else {
        addLog('❌ Login failed', 'error');
      }
    } catch (error) {
      addLog(`❌ Login error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const testLocalStorage = () => {
    addLog('🔍 Checking localStorage...', 'info');
    
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    addLog(`🔑 Token exists: ${!!token}`, 'info');
    addLog(`🔑 Token length: ${token ? token.length : 0}`, 'info');
    addLog(`👤 User exists: ${!!user}`, 'info');
    
    if (token) {
      addLog(`🔑 Token preview: ${token.substring(0, 50)}...`, 'info');
    }
    
    if (user) {
      try {
        const userObj = JSON.parse(user);
        addLog(`👤 User data: ${JSON.stringify(userObj, null, 2)}`, 'info');
      } catch (e) {
        addLog(`❌ Error parsing user data: ${e.message}`, 'error');
      }
    }
  };

  const testAuthMe = async () => {
    setLoading(true);
    addLog('🔐 Testing /api/auth/me endpoint...', 'info');
    
    const token = localStorage.getItem('token');
    if (!token) {
      addLog('❌ No token found in localStorage', 'error');
      setLoading(false);
      return;
    }
    
    addLog(`🔑 Using token: ${token.substring(0, 50)}...`, 'info');
    
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      addLog(`📡 /me response status: ${response.status}`, 'info');
      addLog(`📡 /me response statusText: ${response.statusText}`, 'info');
      
      const data = await response.json();
      addLog(`📡 /me response data: ${JSON.stringify(data, null, 2)}`, 'info');
      
      if (response.ok) {
        addLog('✅ /me endpoint successful!', 'success');
      } else {
        addLog('❌ /me endpoint failed', 'error');
      }
    } catch (error) {
      addLog(`❌ /me endpoint error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const testDebugAuth = async () => {
    setLoading(true);
    addLog('🔍 Testing debug-auth endpoint...', 'info');
    
    const token = localStorage.getItem('token');
    if (!token) {
      addLog('❌ No token found in localStorage', 'error');
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch('/api/debug-auth', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      addLog(`📡 Debug-auth response status: ${response.status}`, 'info');
      
      const data = await response.json();
      addLog(`📡 Debug-auth response: ${JSON.stringify(data, null, 2)}`, 'info');
      
    } catch (error) {
      addLog(`❌ Debug-auth error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const clearStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    addLog('🗑️ LocalStorage cleared', 'info');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Debug Page</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={testLogin}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Test Login
          </button>
          
          <button
            onClick={testLocalStorage}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Check LocalStorage
          </button>
          
          <button
            onClick={testAuthMe}
            disabled={loading}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Test /me Endpoint
          </button>
          
          <button
            onClick={testDebugAuth}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Test Debug Auth
          </button>
          
          <button
            onClick={clearStorage}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Clear Storage
          </button>
          
          <button
            onClick={clearLogs}
            disabled={loading}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Clear Logs
          </button>
        </div>

        {loading && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-blue-600">Loading...</p>
          </div>
        )}

        <div className="bg-white border border-gray-300 rounded p-4">
          <h3 className="font-bold mb-4">Debug Logs:</h3>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {logs.map((log, index) => (
              <div key={index} className={`p-2 rounded text-sm font-mono ${
                log.type === 'error' ? 'bg-red-50 text-red-700' :
                log.type === 'success' ? 'bg-green-50 text-green-700' :
                'bg-gray-50 text-gray-700'
              }`}>
                <span className="text-gray-500">[{log.timestamp}]</span> {log.message}
              </div>
            ))}
            {logs.length === 0 && (
              <p className="text-gray-500 italic">No logs yet. Start testing to see results.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
