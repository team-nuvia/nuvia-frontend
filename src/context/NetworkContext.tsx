'use client';

import mutationKeys from '@/store/lib/mutation-key';
import { getHealthCheck } from '@api/server/get-health-check';
import ErrorTemplate from '@components/template/error/ErrorTemplate';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

interface NetworkContextType {
  isOnline: boolean;
  isChecking: boolean;
  isServerAlive: boolean;
}

export const NetworkContext = createContext<NetworkContextType>({
  isOnline: true,
  isChecking: false,
  isServerAlive: true,
});

const ONLINE_INTERVAL = 30000;
const OFFLINE_INTERVAL = 5000;

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [intervalTime, setIntervalTime] = useState(ONLINE_INTERVAL);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connection, setConnection] = useState(0);
  const [isInitialize, setIsInitialize] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isServerAlive, setIsServerAlive] = useState(true);
  const { mutate: healthCheckMutation } = useMutation({
    mutationKey: mutationKeys.server.healthCheck(),
    mutationFn: () => getHealthCheck(),
    onSuccess: (data) => {
      if (data.code === 'ERR_NETWORK') {
        setIsServerAlive(false);
        setIntervalTime(OFFLINE_INTERVAL);
      } else {
        setIsServerAlive(true);
        setIntervalTime(ONLINE_INTERVAL);
      }
      setConnection(connection + 1);
      setIsOnline(true);
      setIsChecking(false);
    },
    onError: (error: AxiosError) => {
      if (
        error.message === 'Failed to fetch' ||
        error.code === 'ERR_NETWORK' ||
        error.code === 'ERR_CONNECTION_REFUSED' ||
        error.code === 'ECONNABORTED'
      ) {
        setIsOnline(false);
        setIsServerAlive(false);
        setIntervalTime(OFFLINE_INTERVAL);
      }
      setConnection(connection + 1);
      setIsChecking(false);
    },
  });

  const checkConnection = async () => {
    if (isChecking) return;
    setIsChecking(true);
    healthCheckMutation();
  };

  useEffect(() => {
    setIsInitialize(true);
    checkConnection();

    const handleOnline = () => {
      setIsOnline(true);
      setIntervalTime(ONLINE_INTERVAL);
      checkConnection();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIntervalTime(OFFLINE_INTERVAL);
      checkConnection();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 주기적 확인
    const interval = setInterval(checkConnection, intervalTime);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [intervalTime]);

  if (isInitialize && !isOnline) {
    return <ErrorTemplate type="offline" />;
  }

  return <NetworkContext.Provider value={{ isOnline, isChecking, isServerAlive }}>{children}</NetworkContext.Provider>;
}

export const useNetwork = () => useContext(NetworkContext);
