import React, { createContext, useState } from "react";
import { Themes } from "./themes";

export type ThemeContextType = {
  themeName: Themes;
  setTheme: (theme: Themes) => void;
};

export const ThemeContext =
  createContext<ThemeContextType>(
    {} as ThemeContextType
  );

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [themeName, setThemeName] =
    useState<Themes>("light");

  return (
    <ThemeContext.Provider
      value={{
        themeName,
        setTheme: setThemeName,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}