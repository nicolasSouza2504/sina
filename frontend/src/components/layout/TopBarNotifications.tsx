"use client";

import React, { useEffect, useState } from 'react';
import { NotificationsBell } from '@/components/ui/notifications-bell';
import getUserFromToken from "@/lib/auth/userToken";
import { UserFromToken } from "@/lib/interfaces/userInterfaces";

export function TopBarNotifications() {
  const [user, setUser] = useState<UserFromToken | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await getUserFromToken();
      setUser(userData);
    };
    loadUser();
  }, []);

  if (!user?.roles?.includes("TEACHER")) {
    return null;
  }

  return (
    <div className="fixed top-4 right-2 z-30">
      <div className="bg-white rounded-full shadow-lg p-2 hover:shadow-xl transition-shadow border border-gray-200">
        <NotificationsBell />
      </div>
    </div>
  );
}

