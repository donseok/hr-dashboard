'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, type Socket } from 'socket.io-client';

interface UseRealtimeDataOptions {
  url?: string;
  channel: string;
  enabled?: boolean;
  onMessage?: (data: unknown) => void;
}

export function useRealtimeData<T = unknown>({
  url = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000',
  channel,
  enabled = true,
  onMessage,
}: UseRealtimeDataOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const token = localStorage.getItem('hr-dashboard-token');
    const socket = io(url, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      setIsConnected(true);
      setError(null);
      socket.emit('subscribe', { channel });
    });

    socket.on('disconnect', () => setIsConnected(false));
    socket.on('connect_error', (err) => setError(err.message));

    socket.on(channel, (data: T) => {
      setLastMessage(data);
      onMessage?.(data);
    });

    socketRef.current = socket;
  }, [url, channel, onMessage]);

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
    socketRef.current = null;
    setIsConnected(false);
  }, []);

  useEffect(() => {
    if (enabled) {
      connect();
    } else {
      disconnect();
    }
    return disconnect;
  }, [enabled, connect, disconnect]);

  return { isConnected, lastMessage, error, disconnect };
}
