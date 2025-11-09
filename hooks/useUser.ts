// Fix: Provide full content for useUser.ts
import { useState, useCallback } from 'react';
import { User } from '../types';
import { MOCK_USER } from '../constants';

export const useUser = () => {
  const [user, setUser] = useState<User>(MOCK_USER);

  const updateUser = useCallback((newUserData: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...newUserData }));
  }, []);

  return {
    user,
    actions: {
      updateUser,
    },
  };
};
