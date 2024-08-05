"use client";

import { useRouter } from "next/navigation";
import AuthContext from "../context/AuthContext";
import { useContext, useEffect } from "react";

export default function ProtectedRoutes({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      router.push("/");
    }
  }, [user, router]);

  return user ? <>{children}</> : null;
}
