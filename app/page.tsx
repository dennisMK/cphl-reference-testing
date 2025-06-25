"use client";

import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";

export default function Home() {
  const { isLoading, isAuthenticated } = useAuth();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!isLoading && !hasRedirected) {
      setHasRedirected(true);
      if (isAuthenticated) {
        // User is authenticated, redirect to dashboard
        window.location.href = "/dashboard";
      } else {
        // User is not authenticated, redirect to login
        window.location.href = "/auth/login";
      }
    }
  }, [isLoading, isAuthenticated, hasRedirected]);

  // Show loading spinner while checking auth status
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}
