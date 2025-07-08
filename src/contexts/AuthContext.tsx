import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API base URL from environment
const AUTH_API_BASE_URL =
  import.meta.env.VITE_AUTH_SERVICE_URL || "http://localhost:8081";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token and validate it
    const token = localStorage.getItem("oms_token");
    if (token) {
      validateTokenAndSetUser(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateTokenAndSetUser = async (token: string) => {
    try {
      const response = await fetch(`${AUTH_API_BASE_URL}/api/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        const user: User = {
          id: userData.id.toString(),
          name: userData.username,
          email: userData.email,
          role: userData.email === "admin@oms.com" ? "admin" : "user",
        };
        setUser(user);
      } else {
        // Token is invalid, remove it
        localStorage.removeItem("oms_token");
        localStorage.removeItem("oms_user");
      }
    } catch (error) {
      console.error("Error validating token:", error);
      localStorage.removeItem("oms_token");
      localStorage.removeItem("oms_user");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserDetails = async (token: string) => {
    try {
      const response = await fetch(`${AUTH_API_BASE_URL}/api/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        const user: User = {
          id: userData.id.toString(),
          name: userData.username,
          email: userData.email,
          role: userData.email === "admin@oms.com" ? "admin" : "user",
        };
        setUser(user);
        localStorage.setItem("oms_user", JSON.stringify(user));
        return true;
      } else {
        throw new Error("Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      localStorage.removeItem("oms_token");
      localStorage.removeItem("oms_user");
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await fetch(`${AUTH_API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usernameOrEmail: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Store token
        localStorage.setItem("oms_token", data.token);

        // Fetch user details using /me endpoint
        const userDetailsFetched = await fetchUserDetails(data.token);

        if (userDetailsFetched) {
          toast.success(`Welcome back, ${data.username}!`);
          setIsLoading(false);
          return true;
        } else {
          toast.error("Failed to fetch user details");
          setIsLoading(false);
          return false;
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Invalid credentials");
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
      setIsLoading(false);
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await fetch(`${AUTH_API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(
          `Account created successfully! Please login to continue.`
        );
        setIsLoading(false);
        return true;
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Registration failed");
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("oms_token");
    localStorage.removeItem("oms_user");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
