"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginRegisterRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push("/loginregister/login"); // Redirigir automáticamente a login
  }, [router]);

  return null; // No renderiza nada, solo redirige
}

