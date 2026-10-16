import { createContext, useContext, useMemo, useCallback } from 'react';

import { useSetState } from 'src/hooks/use-set-state';
import { useAuthContext } from '../hooks';

const ProfileContext = createContext(undefined);

export function ProfileProvider({ children }) {

    const { user } = useAuthContext();

  const { state, setState } = useSetState({
    displayName: user?.displayName || user.basicInfo?.name || 'Admin',
    photoURL: user?.photoURL || user?.basicInfo?.profileIcon || '',
  });

  const updateProfile = useCallback(
    (updates) => {
      setState({
        displayName: updates.displayName || state.displayName,
        photoURL: updates.photoURL || state.photoURL,
      });
    },
    [setState, state]
  );

  const memoizedValue = useMemo(
    () => ({
      displayName: state.displayName,
      photoURL: state.photoURL,
      updateProfile,
    }),
    [state.displayName, state.photoURL, updateProfile]
  );

  return <ProfileContext.Provider value={memoizedValue}>{children}</ProfileContext.Provider>;
}

export const useProfileContext = () => {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }

  return context;
};

