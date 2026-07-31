"use client";
import React, { useEffect, useState } from "react";

export function ClientOnly({ children, fallback }: { children: React.ReactNode, fallback?: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return fallback ? <>{fallback}</> : null;

  return <>{children}</>;
}
