"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from 'react'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        
        if (response.ok) {
          // User is already authenticated, redirect to dashboard
          router.push("/dashboard");
        } else {
          // User is not authenticated, allow access to auth pages
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // On error, allow access to auth pages
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
        {children}
    </>
  )
}
