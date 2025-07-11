"use client";

import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function TokenExpirationWarning() {
  const { tokenExpiresAt, refreshUser } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<string>('');

  useEffect(() => {
    if (!tokenExpiresAt) {
      setShowWarning(false);
      return;
    }

    const updateTimeUntilExpiry = () => {
      const now = new Date();
      const timeDiff = tokenExpiresAt.getTime() - now.getTime();
      const hoursUntilExpiry = timeDiff / (1000 * 60 * 60);

      if (hoursUntilExpiry <= 24 && hoursUntilExpiry > 0) {
        setShowWarning(true);
        
        if (hoursUntilExpiry < 1) {
          const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
          setTimeUntilExpiry(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
        } else {
          const hours = Math.floor(hoursUntilExpiry);
          setTimeUntilExpiry(`${hours} hour${hours !== 1 ? 's' : ''}`);
        }
      } else {
        setShowWarning(false);
      }
    };

    updateTimeUntilExpiry();
    const interval = setInterval(updateTimeUntilExpiry, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [tokenExpiresAt]);

  const handleRefreshSession = async () => {
    try {
      await refreshUser();
      setShowWarning(false);
    } catch (error) {
      console.error('Failed to refresh session:', error);
    }
  };

  if (!showWarning) return null;

  return (
    <Alert className="mb-4 border-yellow-200 bg-yellow-50">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="flex items-center justify-between w-full">
        <span className="text-yellow-800">
          Your session will expire in {timeUntilExpiry}. Would you like to extend it?
        </span>
        <div className="flex gap-2 ml-4">
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefreshSession}
            className="bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200"
          >
            Extend Session
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowWarning(false)}
            className="text-yellow-600 hover:text-yellow-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
} 