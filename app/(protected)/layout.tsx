"use client";

// import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TopNav } from "@/components/top-nav";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Comment out real auth for demo
  // const { data: session, isPending } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check localStorage for demo auth
    const authFlag = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(authFlag === "true");
    
    if (authFlag !== "true") {
      router.push("/auth/login");
    }
  }, [router]);

  // Show loading while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Uganda VLM...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      <TopNav />
      {children}
    </div>
  );
}
