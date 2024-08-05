"use client";

import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: any;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

interface User {
  access_token: string;
  token_type: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser({ access_token: token, token_type: "Bearer" });
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      const response = await axios.post(
        "http://localhost:8000/auth/token",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      // check if response is ok
      if (!response.data.access_token) {
        console.log("Invalid username or password");
        setError("Invalid username or password");
      } else {
        setError(null);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.access_token}`;
        localStorage.setItem("token", response.data.access_token);
        setUser(response.data);
        router.push("/");
      }
    } catch (error) {
      setError("Invalid username or password");
      // console.log("Login Failed", error);
    }
  };

  const register = async (username: string, password: string) => {
    console.log(username, password);
    try {
      const response = await axios.post(
        "http://localhost:8000/auth",
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // check if response is ok
      if (response.status !== 201) {
        console.log("Something went wrong");
        setError("Error creating user");
      } else {
        setError(null);
        router.push("/login");
      }
    } catch (error) {
      setError("Error creating user");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, error, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
