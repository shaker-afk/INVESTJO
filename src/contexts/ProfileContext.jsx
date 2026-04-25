import React, { createContext, useState, useContext } from 'react';

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [activeProfile, setActiveProfile] = useState('Investor'); // 'Investor' | 'Company'
  
  // Default selected sectors
  const [sectorInterests, setSectorInterests] = useState([
    '1', // Green Energy
    '2', // Real Estate
    '3', // MedTech
    '4', // FinTech
    '5', // AgriTech
  ]);

  return (
    <ProfileContext.Provider
      value={{
        activeProfile,
        setActiveProfile,
        sectorInterests,
        setSectorInterests,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
