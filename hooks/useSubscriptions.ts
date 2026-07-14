"use client";

import { useState, useEffect, useCallback } from "react";
import { Subscription } from "@/types/subscription";

const STORAGE_KEY = "subscription-alert-system-data";

function loadFromStorage(): Subscription[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(data: Subscription[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage full or unavailable
  }
}

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setSubscriptions(loadFromStorage());
    setHydrated(true);
  }, []);

  // Auto-save to localStorage whenever subscriptions change
  useEffect(() => {
    if (hydrated) {
      saveToStorage(subscriptions);
    }
  }, [subscriptions, hydrated]);

  const addSubscription = useCallback((sub: Omit<Subscription, "id" | "createdAt">) => {
    const newSub: Subscription = {
      ...sub,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setSubscriptions((prev) => [newSub, ...prev]);
  }, []);

  const updateSubscription = useCallback((id: string, updates: Omit<Subscription, "id" | "createdAt">) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    setEditingId(null);
  }, []);

  const deleteSubscription = useCallback((id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return {
    subscriptions,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    editingId,
    setEditingId,
  };
}
