import { io, type Socket } from 'socket.io-client';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';

let socket: Socket | null = null;

interface SocketEvents {
  notification: (data: NotificationEvent) => void;
  'kpi-alert': (data: KpiAlertEvent) => void;
  'kpi-updated': (data: KpiUpdateEvent) => void;
}

export interface NotificationEvent {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  createdAt: string;
}

export interface KpiAlertEvent {
  kpiId: string;
  module: string;
  label: string;
  value: number;
  threshold: number;
  signal: 'positive' | 'warning' | 'danger';
}

export interface KpiUpdateEvent {
  kpiId: string;
  module: string;
  value: number;
  previousValue: number;
  changePercent: number;
}

/**
 * Get or create the singleton Socket.io connection.
 * Automatically attaches JWT token and configures reconnection.
 */
export function getSocket(): Socket {
  if (socket?.connected) return socket;

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('hr-dashboard-token')
      : null;

  socket = io(WS_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
    reconnectionAttempts: Infinity,
    timeout: 10000,
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.warn('[Socket] Connection error:', err.message);
  });

  // Re-authenticate on reconnect
  socket.io.on('reconnect', () => {
    const freshToken = localStorage.getItem('hr-dashboard-token');
    if (freshToken && socket) {
      socket.auth = { token: freshToken };
    }
  });

  return socket;
}

/**
 * Subscribe to a typed event channel.
 * Returns an unsubscribe function.
 */
export function onSocketEvent<K extends keyof SocketEvents>(
  event: K,
  handler: SocketEvents[K],
): () => void {
  const s = getSocket();
  s.on(event as string, handler as (...args: unknown[]) => void);
  return () => {
    s.off(event as string, handler as (...args: unknown[]) => void);
  };
}

/**
 * Disconnect socket and clean up.
 */
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
