'use client';

import { useEffect } from 'react';

export default function NotificationProvider() {
  useEffect(() => {
    // ブラウザ通知の許可を要求
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return null;
} 