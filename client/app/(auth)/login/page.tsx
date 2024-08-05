"use client";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

import LoginCard from "@/app/components/LoginCard";
import React from "react";
import AuthContext from "@/app/context/AuthContext";

const LoginPage = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);
  return (
    <div>
      <LoginCard />
    </div>
  );
};

export default LoginPage;
