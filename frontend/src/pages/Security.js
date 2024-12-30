import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Security = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    passwordLastChanged: null,
    loginHistory: []
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    const fetchSecuritySettings = async () => {
      try {
        const response = await fetch('https://localhost:5000/api/security/settings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setSecuritySettings(data);
        }
      } catch (error) {
        console.error('Error fetching security settings:', error);
      }
    };

    fetchSecuritySettings();
  }, []);

  const handleToggle2FA = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/security/2fa/toggle', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        setSecuritySettings(prev => ({
          ...prev,
          twoFactorEnabled: !prev.twoFactorEnabled
        }));
      }
    } catch (error) {
      console.error('Error toggling 2FA:', error);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Security Settings</h1>

        <div className="space-y-6">
          <div className="border-b dark:border-gray-700 pb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Two-Factor Authentication
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400">
                  {securitySettings.twoFactorEnabled
                    ? 'Two-factor authentication is enabled'
                    : 'Enable two-factor authentication for additional security'}
                </p>
              </div>
              <button
                onClick={handleToggle2FA}
                className={`px-4 py-2 rounded-md ${
                  securitySettings.twoFactorEnabled
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                } text-white transition duration-200`}
              >
                {securitySettings.twoFactorEnabled ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>

          <div className="border-b dark:border-gray-700 pb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Password
            </h2>
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Last changed: {securitySettings.passwordLastChanged
                  ? new Date(securitySettings.passwordLastChanged).toLocaleDateString()
                  : 'Never'}
              </p>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
              >
                Change Password
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Recent Login Activity
            </h2>
            <div className="space-y-4">
              {securitySettings.loginHistory.map((login, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-gray-600 dark:text-gray-400"
                >
                  <span>{new Date(login.timestamp).toLocaleString()}</span>
                  <span>{login.ipAddress}</span>
                  <span>{login.device}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;
