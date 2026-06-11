'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Role } from '@/types';

interface UseRoleReturn {
  role: Role | null;
  isLoading: boolean;
  isEmployer: boolean;
  isCandidate: boolean;
  isAdmin: boolean;
}

export function useRole(): UseRoleReturn {
  const { getToken } = useAuth();
  const { isLoaded } = useUser();
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    async function fetchRole() {
      try {
        const token = await getToken();
        if (!token) { setIsLoading(false); return; }

        const res = await api.get<{ role: Role }>('/users/me', token);
        const fetched = res.data?.role ?? null;
        setRole(fetched);
      } catch {
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRole();
  }, [isLoaded, getToken]);

  return {
    role,
    isLoading,
    isEmployer: role === 'employer',
    isCandidate: role === 'candidate',
    isAdmin: role === 'admin',
  };
}
