'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/utils';
import { Session } from '@/auth';

export type SessionData = {
  user: Session | null;
  isLoading: boolean;
  error: Error | null;
};

/**
 * 自定义钩子用于获取和管理用户会话
 * @returns 包含用户数据、加载状态和错误信息的对象
 */
export function useSession(): SessionData {
  const [sessionData, setSessionData] = useState<SessionData>({
    user: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchSession() {
      try {
        const data = await fetchApi("/api/user/info", {
          credentials: "include",
        });

        if (isMounted) {
          setSessionData({
            user: data?.user || null,
            isLoading: false,
            error: null
          });
        }
      } catch (error) {
        if (isMounted) {
          console.error("获取会话信息失败:", error);
          setSessionData({
            user: null,
            isLoading: false,
            error: error instanceof Error ? error : new Error('获取会话失败')
          });
        }
      }
    }

    fetchSession();

    // 清理函数防止组件卸载后更新状态
    return () => {
      isMounted = false;
    };
  }, []);

  return sessionData;
}

// 导出 useSession 作为默认导出，方便引入
export default useSession;
