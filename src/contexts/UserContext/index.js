import React, { createContext, useContext, useState, useEffect } from 'react';
import Api from '../../services/api';
import jwtDecode from 'jwt-decode';
import { useApp } from '../AppContext';
import  { Redirect } from 'react-router-dom';

const AuthenticateContext = createContext({
    signed: false,
    signIn: null,
    signOut: null,
    loading: false,
    authenticatedUser: null,
    isUserAdmin: false,
});

export default function AuthenticateProvider({ children }) {

    const { setError, loading, setLoading } = useApp();

    const [authenticatedUser, setAuthenticatedUser] = useState(null);

    const signIn = async (email, password) => {
        setLoading(true);
        if (email && password) {
            const res = await Api.post('/users/authenticate', { email, password });
            if (res.error) {
                setError(res.error.message)
                setLoading(false);
                return;
            }

            Api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
            let decoded = await jwtDecode(res.data.token);
            localStorage.setItem("$Authenticate:token", res.data.token);
            localStorage.setItem("$Authenticate:user", JSON.stringify(decoded));
            setAuthenticatedUser(decoded);   
            window.location = '/'         
        }
        setLoading(false);
        
    }

    useEffect(() => {

        setLoading(true);
        const validateStoragedToken = async () => {

            const token = await localStorage.getItem("$Authenticate:token");
            const user = await localStorage.getItem("$Authenticate:user");
            if (token && user) {

                Api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const res = await Api.get('/users/validate');

                if (res.error) {
                    signOut();
                    return;
                }
                if (res.data) {
                    setAuthenticatedUser(JSON.parse(user));
                }
            }
        }
        validateStoragedToken();
        setLoading(false)
    }, [])

    const signOut = () => {
        localStorage.clear();
        setAuthenticatedUser(null);
        window.location = '/';
    }

    return (
        <AuthenticateContext.Provider value={{ 
            signed: !!authenticatedUser, 
            authenticatedUser, 
            isUserAdmin: (!!authenticatedUser && !!authenticatedUser.isAdmin), 
            signIn, 
            signOut, 
            loading 
        }}>
            {children}
        </AuthenticateContext.Provider>
    )
}

export const useAuthenticate = () => {
    const context = useContext(AuthenticateContext);
    return context;
}