// src/context/UserContext.jsx

import { createContext, useEffect, useState, useCallback } from "react";

export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("course_app_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("course_app_token") || null;
  });

  const [loading, setLoading] = useState(true);

  // Authenticated fetch helper
  const authFetch = useCallback(
    async (endpoint, options = {}) => {
      const url = endpoint.startsWith("http")
        ? endpoint
        : `${API_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      };

      const config = {
        ...options,
        headers,
        credentials: "include",
      };

      const res = await fetch(url, config);

      if (res.status === 401) {
        // Token expired or invalid
        setUser(null);
        setToken(null);
        localStorage.removeItem("course_app_user");
        localStorage.removeItem("course_app_token");
      }

      return res;
    },
    [token],
  );

  // Check auth on initial mount
  useEffect(() => {
    async function verifySession() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await authFetch("/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          localStorage.setItem("course_app_user", JSON.stringify(data.user));
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem("course_app_user");
          localStorage.removeItem("course_app_token");
        }
      } catch (err) {
        console.error("Session verification failed:", err);
      } finally {
        setLoading(false);
      }
    }

    verifySession();
  }, [token, authFetch]);

  // Login action
  const login = async (identifier, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ emailOrUsername: identifier, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to log in");
    }

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("course_app_user", JSON.stringify(data.user));
    if (data.token) {
      localStorage.setItem("course_app_token", data.token);
    }
    return data.user;
  };

  // Logout action
  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout request error:", err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("course_app_user");
      localStorage.removeItem("course_app_token");
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        authFetch,
        apiUrl: API_URL,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
