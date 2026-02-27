
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function ProfileRedirectPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 1. Giriş yapmamışsa login'e gönder
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // 2. Giriş yapmışsa kendi kullanıcı adına yönlendir (Örn: /profile/berk)
    if (user?.username) {
      router.push(`/profile/${user.username}`);
    }
  }, [user, isAuthenticated, router]);

  return <LoadingSpinner />;
}