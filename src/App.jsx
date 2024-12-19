import React, { useState } from 'react';
    import AuthPage from './pages/AuthPage';
    import NotesPage from './pages/NotesPage';

    const App = () => {
      const [isAuthenticated, setIsAuthenticated] = useState(false);

      const handleLogin = (token) => {
        setIsAuthenticated(true);
        localStorage.setItem('authToken', token);
      };

      const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
      };

      return (
        <div className="min-h-screen bg-gradient-to-b from-yellow-700 to-neutral-900">
          {isAuthenticated ? (
            <NotesPage onLogout={handleLogout} />
          ) : (
            <AuthPage onLogin={handleLogin} />
          )}
        </div>
      );
    };

    export default App;
