"use client";

// import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TopNav } from "@/components/top-nav";

interface User {
  id: number;
  username: string;
  name: string;
  email: string | null;
  facility_id: number | null;
  facility_name: string | null;
  hub_id: number | null;
  hub_name: string | null;
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Comment out real auth for demo
  // const { data: session, isPending } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // Not authenticated, redirect to login
          const currentPath = window.location.pathname;
          router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
          return;
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/auth/login');
        return;
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Uganda VLM...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      <TopNav />
      {children}
    </div>
  );
}
