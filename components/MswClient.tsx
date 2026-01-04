// src/app/components/MswClient.tsx
'use client'; // 标记为客户端组件

import { useEffect } from 'react';
import { worker } from '../mocks/setup';

export default function MswClient() {
  // 原有的 MSW 启动逻辑
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && worker) {
      worker.start({
        onUnhandledRequest: 'bypass'
      }).catch(err => console.error('MSW 启动失败:', err));
    }
  }, []);

  return null; 
}