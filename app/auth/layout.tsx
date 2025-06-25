"use client";

import React from 'react'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
  // Simple layout - no auth checks to avoid conflicts
  // Let individual pages handle their own auth logic
  return (
    <>
        {children}
    </>
  )
}
