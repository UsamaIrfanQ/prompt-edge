import React, { createContext, useContext, useState, useEffect } from 'react';

interface SessionContextType {
  sessions: string[];
  fetchSessions: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [sessions, setSessions] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchSessions = async () => {
    if (!userId) return;

    try {
      const response = await fetch('/api/getAllChats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });

      const data = await response.json();
      console.log('data', data);
      setSessions(data.history);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  // Effect to fetch user ID and sessions
  useEffect(() => {
    const id = localStorage.getItem('user_id'); // Get user_id from localStorage
    setUserId(id); // Set userId state
  }, []);

  // Effect to fetch sessions only when userId changes
  useEffect(() => {
    if (userId) {
      fetchSessions(); // Fetch sessions when user_id is set
    }
  }, [userId]);

  return (
    <SessionContext.Provider value={{ sessions, fetchSessions }}>
      {children}
    </SessionContext.Provider>
  );
};
