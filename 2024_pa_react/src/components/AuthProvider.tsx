import { createContext, useContext, useState, useEffect } from 'react';
import { PublicClientApplication, EventType, AccountInfo } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './authConfig';

const msalInstance = new PublicClientApplication(msalConfig);

const AuthContext = createContext<{ account: AccountInfo | null }>({ account: null });

export const AuthProvider: React.FC = ({ children }) => {
    const [account, setAccount] = useState<AccountInfo | null>(null);

    useEffect(() => {
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
            setAccount(accounts[0]);
        }

        msalInstance.addEventCallback((event) => {
            if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
                const account = event.payload.account;
                setAccount(account);
            }
        });
    }, []);

    return (
        <AuthContext.Provider value={{ account }}>
            <MsalProvider instance={msalInstance}>
                {children}
            </MsalProvider>
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
