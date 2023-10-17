import {useState, createContext, useEffect} from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {

    const [theme, setTheme] = useState(localStorage.getItem('theme') !== 'dark' ? 'ligth' : 'dark');

    useEffect(() => {
        
        const root = window.document.documentElement;

        const removeTheme = theme == "dark" ? "ligth" : "dark";

        root.classList.remove(removeTheme);
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
        
    }, [theme])

    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            {children}
        </ThemeContext.Provider>
    )
};

export default ThemeProvider;