import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Only connect when user is authenticated
    if (!isAuthenticated || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const socketUrl = window.location.origin.includes('5173')
      ? 'http://localhost:5001'
      : window.location.origin;

    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      // Join personal user room
      newSocket.emit('join:user', user._id);

      // Join admin room if admin
      if (isAdmin) {
        newSocket.emit('join:admin');
      }
    });

    // Handle incoming status change notification for citizen
    newSocket.on('complaint:status_change', (data) => {
      toast((t) => (
        <div className="flex items-start gap-3">
          <div className="text-xl">🔔</div>
          <div>
            <p className="font-semibold text-sm text-slate-900">
              Complaint Status Updated: {data.trackingId}
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              Status changed to: <span className="font-bold text-indigo-600">{data.newStatus}</span>
            </p>
          </div>
        </div>
      ), {
        duration: 5000,
        position: 'top-right',
        style: {
          background: '#ffffff',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }
      });
    });

    // Handle new complaint created (for administrators)
    if (isAdmin) {
      newSocket.on('complaint:created', (data) => {
        toast((t) => (
          <div className="flex items-start gap-3">
            <div className="text-xl">⚡</div>
            <div>
              <p className="font-semibold text-sm text-slate-900">
                New Complaint Filed: {data.complaint.trackingId}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                Category: {data.complaint.category} • Priority: <span className="font-semibold text-rose-600">{data.complaint.priority}</span>
              </p>
            </div>
          </div>
        ), {
          duration: 6000,
          position: 'top-right'
        });
      });
    }

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, user?._id, isAdmin]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
