"use client";

// import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  // Comment out real auth for demo
  // const { data: session, isPending } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check localStorage for demo auth
    const authFlag = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(authFlag === "true");
    
    if (authFlag === "true") {
      router.push("/dashboard");
    } else {
      router.push("/auth/login");
    }
  }, [router]);

  // Show loading spinner while checking auth status
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}
