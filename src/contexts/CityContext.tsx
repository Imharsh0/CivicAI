import React, { createContext, useContext, useState } from 'react';
import { CityInfo } from '../types';
import { INDIAN_CITIES, DEFAULT_CITY } from '../data/cities';

interface CityContextType {
  currentCity: CityInfo;
  setCityByName: (cityName: string) => void;
  allCities: CityInfo[];
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCity, setCurrentCity] = useState<CityInfo>(() => {
    const saved = localStorage.getItem('civicai_selected_city');
    if (saved) {
      const found = INDIAN_CITIES.find((c) => c.name.toLowerCase() === saved.toLowerCase());
      if (found) return found;
    }
    return DEFAULT_CITY;
  });

  const setCityByName = (cityName: string) => {
    const found = INDIAN_CITIES.find((c) => c.name.toLowerCase() === cityName.toLowerCase());
    if (found) {
      setCurrentCity(found);
      localStorage.setItem('civicai_selected_city', found.name);
    }
  };

  return (
    <CityContext.Provider
      value={{
        currentCity,
        setCityByName,
        allCities: INDIAN_CITIES,
      }}
    >
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
};
