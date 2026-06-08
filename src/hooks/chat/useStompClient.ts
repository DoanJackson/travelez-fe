"use client";

import { useEffect, useState, useCallback } from 'react';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { AuthCookies } from '@/lib/cookie';
import SockJS from 'sockjs-client';

const RAW_DOMAIN = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8080';
const HTTP_DOMAIN = RAW_DOMAIN.replace(/^ws:\/\//i, 'http://').replace(/^wss:\/\//i, 'https://');
const SOCKJS_URL = `${HTTP_DOMAIN}/ws`;

declare global {
  interface Window {
    __globalStompClient?: Client | null;
    __globalIsConnected?: boolean;
    __stompListeners?: Set<(connected: boolean) => void>;
  }
}

if (typeof window !== 'undefined' && !window.__stompListeners) {
  window.__stompListeners = new Set();
}

function notifyListeners(status: boolean) {
  if (typeof window === 'undefined' || !window.__stompListeners) return;
  window.__globalIsConnected = status;
  window.__stompListeners.forEach(listener => listener(status));
}

export function disconnectGlobalStomp() {
  if (typeof window !== 'undefined' && window.__globalStompClient) {
    window.__globalStompClient.deactivate();
    window.__globalStompClient = null;
    notifyListeners(false);
    console.log('🔌 Stomp WebSocket Connection closed.');
  }
}

function initGlobalConnection() {
  if (typeof window === 'undefined') return;
  if (window.__globalStompClient) return;

  const token = AuthCookies.getToken();
  if (!token) return;

  const client = new Client({
    webSocketFactory: () => new SockJS(SOCKJS_URL),
    connectHeaders: { Authorization: `Bearer ${token}` },
    debug: (msg: string) => {
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 20000,
    heartbeatOutgoing: 20000,
  });

  client.onConnect = () => {
    console.log('✅ Connected to Stomp WebSocket Server via SockJS');
    notifyListeners(true);
  };

  client.onStompError = (frame) => {
    console.error('❌ Broker error:', frame.headers['message']);
  };

  client.onWebSocketError = (event) => {
    console.error('❌ WebSocket encountered an error and dropped the connection', event);
    notifyListeners(false);
  };

  client.onWebSocketClose = () => {
    notifyListeners(false);
  };

  window.__globalStompClient = client;
  window.__globalStompClient.activate();
}

export function useStompClient() {
  const [isConnected, setIsConnected] = useState(
    typeof window !== 'undefined' ? !!window.__globalIsConnected : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    initGlobalConnection();

    const listener = (status: boolean) => setIsConnected(status);
    window.__stompListeners?.add(listener);

    setIsConnected(!!window.__globalIsConnected);

    return () => {
      window.__stompListeners?.delete(listener);
    };
  }, []);

  const subscribe = useCallback((topic: string, callback: (message: IMessage) => void): StompSubscription | null => {
    const client = typeof window !== 'undefined' ? window.__globalStompClient : null;
    
    if (!client || !client.connected) {
      return null;
    }
    try {
      return client.subscribe(topic, callback);
    } catch (e) {
      console.error(`[useStompClient] Lỗi đăng ký Subscribe ở topic: ${topic}`, e);
      return null;
    }
  }, []);

  return { 
    stompClient: typeof window !== 'undefined' ? window.__globalStompClient : null, 
    isConnected, 
    subscribe 
  };
}