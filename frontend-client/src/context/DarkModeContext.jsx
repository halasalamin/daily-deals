import React, { createContext, useContext, useState, useEffect } from "react";

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
const [darkMode, setDarkMode] = useState(() => {
const saved = localStorage.getItem("darkMode");
return saved === "true" || false;
});

useEffect(() => {
localStorage.setItem("darkMode", darkMode);
}, [darkMode]);

const toggleDarkMode = () => setDarkMode((prev) => !prev);

return (
<DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
{children}
</DarkModeContext.Provider>
);
};

export const useDarkMode = () => {
const context = useContext(DarkModeContext);
if (!context) {
throw new Error("useDarkMode must be used within DarkModeProvider");
}
return context;
};