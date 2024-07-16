import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../lib/appwrite';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    // Declare whatever you want the entire app to have access to
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        getCurrentUser()
            .then(res => {
                // If the function returns a response
                // Update state variables to true
                // else update state variables to false
                if(res){
                    setIsLoggedIn(true);
                    setUser(res);
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }, [])
    


    return (
        <GlobalContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                user,
                setUser,
                isLoading,
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
} 

export default GlobalProvider;