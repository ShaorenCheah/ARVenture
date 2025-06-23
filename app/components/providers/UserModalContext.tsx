'use client';
import React, { createContext, useContext, useState } from 'react';

interface UserModalContextType {
  openUserModal: boolean;
  setOpenUserModal: (value: boolean) => void;
}

const UserModalContext = createContext<UserModalContextType | undefined>(undefined);

export const UserModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [openUserModal, setOpenUserModal] = useState(false);
  return (
    <UserModalContext.Provider value={{ openUserModal, setOpenUserModal }}>
      {children}
    </UserModalContext.Provider>
  );
};

export const useUserModal = () => {
  const context = useContext(UserModalContext);
  if (!context) throw new Error('useUserModal must be used within a UserModalProvider');
  return context;
};
