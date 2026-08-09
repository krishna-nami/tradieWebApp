"use client";
import { useAuthStore } from "@/store/authStore";

export default function Home() {
  const { user } = useAuthStore();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">TradieHub</h1>
      <h2 className="flex items-center justify-center">
        User:{JSON.stringify(user)}
      </h2>
    </main>
  );
}
