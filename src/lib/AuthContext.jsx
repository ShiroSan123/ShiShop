import React, { createContext, useState, useContext, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  const checkAppState = async () => {
    try {
      setIsLoadingAuth(true);
      setIsLoadingPublicSettings(true);
      setAuthError(null);
      setAppPublicSettings(null);

      if (!isSupabaseConfigured()) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        setIsAuthenticated(true);
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setAuthError({
        type: "unknown",
        message: error?.message || "Auth initialization failed",
      });
    } finally {
      setIsLoadingAuth(false);
      setIsLoadingPublicSettings(false);
    }
  };

  useEffect(() => {
    let unsubscribe = null;

    checkAppState();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      const subscription = supabase.auth.onAuthStateChange(async () => {
        await checkAppState();
      });

      unsubscribe = () => {
        subscription.data.subscription.unsubscribe();
      };
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const logout = async (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);

    if (shouldRedirect && typeof window !== "undefined") {
      await base44.auth.logout(window.location.href);
    } else {
      await base44.auth.logout();
    }
  };

  const navigateToLogin = () => {
    if (typeof window !== "undefined") {
      base44.auth.redirectToLogin(window.location.href);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        appPublicSettings,
        logout,
        navigateToLogin,
        checkAppState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
