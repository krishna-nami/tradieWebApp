"use client";

import { useAuthStore, UserRole } from "@/store/authStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "../ui/Spinner";
import { useAuthCheck } from "@/hooks/useAuthCheck";

interface ProtectedRoutesProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}
export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRoutesProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, hasHydrated, logout } = useAuthStore();
  const { isError, isLoading: isVerifying } = useAuthCheck();

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (isError) {
      // Zustand thought we were logged in, but the server disagrees
      logout();
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.replace("/");
    }
  }, [hasHydrated, isAuthenticated, user, allowedRoles, pathname, router]);

  if (!hasHydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size={28} />
      </div>
    );
  }
  if (
    !isAuthenticated ||
    (allowedRoles && user && !allowedRoles.includes(user.role))
  ) {
    return null;
  }
  return <>{children}</>;
}
