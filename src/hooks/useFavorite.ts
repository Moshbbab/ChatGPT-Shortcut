import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { DEFAULT_FAVORITE_IDS } from "../data/constants";

const STORAGE_KEY = "aishort_user_favorites";

export function useFavorite() {
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      return DEFAULT_FAVORITE_IDS;
    } catch {
      return DEFAULT_FAVORITE_IDS;
    }
  });

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setFavorites(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const saveFavorites = useCallback((newFavs: number[]) => {
    setFavorites(newFavs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavs));
    } catch {}
  }, []);

  const isFavorite = useCallback(
    (id: number | string) => {
      const numId = Number(id);
      return favorites.includes(numId);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (id: number | string, isComm = false) => {
      const numId = Number(id);
      setFavorites((prev) => {
        const next = prev.includes(numId) ? prev.filter((i) => i !== numId) : [...prev, numId];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {}
        if (next.includes(numId)) {
          message.success("Added to favorites");
        } else {
          message.info("Removed from favorites");
        }
        return next;
      });
    },
    []
  );

  const removeFavorite = useCallback((id: number | string) => {
    const numId = Number(id);
    setFavorites((prev) => {
      const next = prev.filter((i) => i !== numId);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const confirmRemoveFavorite = useCallback(
    (id: number | string) => {
      removeFavorite(id);
      message.success("Removed from favorites");
    },
    [removeFavorite]
  );

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    confirmRemoveFavorite,
  };
}
