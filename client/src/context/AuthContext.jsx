import React, {
    createContext,
    useEffect,
    useState,
} from "react";

import api from "../services/api";
import {
    login as passwordLogin,
    telegramLogin,
    logout as apiLogout,
} from "../services/auth";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        const res = await api.get("/api/auth/me");
        setUser(res.data);
    };

    useEffect(() => {
        async function init() {
            try {
                const tg = window.Telegram?.WebApp;

                if (tg?.initData) {
                    try {
                        await telegramLogin(tg.initData);
                        await loadUser();
                    } catch (e) {
                        console.log("Telegram login skipped.");
                    }
                } else {
                    const token = localStorage.getItem("access_token");

                    if (token) {
                        await loadUser();
                    }
                }
            } catch (err) {
                console.error(err);
                localStorage.removeItem("access_token");
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        init();
    }, []);

    const login = async (username, password) => {
        await passwordLogin(username, password);
        await loadUser();
    };

    const logout = () => {
        apiLogout();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
