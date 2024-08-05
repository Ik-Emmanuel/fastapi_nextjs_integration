"use client";

import Link from "next/link";
import React, { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";

const LoginCard: React.FC = () => {
  const { login, error } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="glassmorphic p-8 max-w-sm w-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-8 text-center text-white">
            U-Fitness
          </h2>
          <span className="text-cyan-400 text-center">Login</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-white"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white  text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white  text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-cyan-500 hover:bg-cyan-700 text-white font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            Login
          </button>

          {error && error.length > 1 && (
            <div className="mt-6 rounded-md bg-red-200 px-4 py-2">
              <p className="text-red-500">{error}</p>
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <Link href="/register" className="mt-6 text-center">
            <span className="text-gray-400 text-center text-sm">
              {" "}
              New to U-fitness?{" "}
              <span className="font-semibold text-cyan-500">
                Register New Account
              </span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
