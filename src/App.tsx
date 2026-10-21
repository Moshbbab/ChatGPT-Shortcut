import React, { useState, useEffect } from "react";
import { ConfigProvider, theme, App as AntdApp } from "antd";
import { Navbar } from "./components/Navbar";
import { PromptsCatalogView } from "./components/PromptsCatalogView";
import { MySpaceView } from "./components/MySpaceView";
import { CommunityView } from "./components/CommunityView";
import { DocsView } from "./components/DocsView";
import { PromptModal } from "./components/PromptModal";
import { AuthModal } from "./components/AuthModal";
import { useFavorite } from "./hooks/useFavorite";
import { PromptCardData, getLocalizedCard } from "./services/cardLoader";
import { useI18n } from "./utils/i18n";
import { GithubOutlined, HeartFilled } from "@ant-design/icons";

export function AppContent() {
  const { currentLanguage } = useI18n();
  const { favorites, isFavorite, toggleFavorite } = useFavorite();

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<"all" | "myspace" | "community" | "docs">("all");

  // View Mode: grid or compact
  const [viewMode, setViewMode] = useState<"grid" | "compact">(() => {
    try {
      return (localStorage.getItem("aishort_view_mode") as "grid" | "compact") || "grid";
    } catch {
      return "grid";
    }
  });

  const toggleViewMode = () => {
    setViewMode((prev) => {
      const next = prev === "grid" ? "compact" : "grid";
      try {
        localStorage.setItem("aishort_view_mode", next);
      } catch {}
      return next;
    });
  };

  // Dark Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("aishort_theme");
      if (stored) return stored === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("aishort_theme", next ? "dark" : "light");
      } catch {}
      return next;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [isDarkMode]);

  // Prompt Detail Modal state
  const [selectedCard, setSelectedCard] = useState<PromptCardData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenDetails = (card: PromptCardData) => {
    setSelectedCard(card);
    setModalOpen(true);
  };

  const handleSelectRelated = (relatedId: number) => {
    const nextCard = getLocalizedCard(relatedId, currentLanguage);
    if (nextCard) {
      setSelectedCard(nextCard);
    }
  };

  // Auth / Profile modal
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#0d9488",
          borderRadius: 10,
          fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
        },
      }}
    >
      <AntdApp>
        <div className="min-h-screen flex flex-col bg-[#f8f9fa] dark:bg-[#15191e] text-slate-800 dark:text-slate-100 transition-colors">
          {/* Main App Navigation */}
          <Navbar
            currentTab={currentTab}
            onTabChange={setCurrentTab}
            viewMode={viewMode}
            onToggleViewMode={toggleViewMode}
            isDarkMode={isDarkMode}
            onToggleTheme={toggleTheme}
            favoritesCount={favorites.length}
            onOpenAuth={() => setAuthOpen(true)}
          />

          {/* Main Body Content based on active tab */}
          <main className="flex-1">
            {currentTab === "all" && (
              <PromptsCatalogView
                viewMode={viewMode}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
                onOpenDetails={handleOpenDetails}
              />
            )}

            {currentTab === "myspace" && (
              <MySpaceView onOpenDetails={handleOpenDetails} />
            )}

            {currentTab === "community" && (
              <CommunityView onOpenDetails={handleOpenDetails} />
            )}

            {currentTab === "docs" && <DocsView />}
          </main>

          {/* Footer */}
          <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-[#181d24]/70 backdrop-blur-sm py-8 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 font-medium">
                <span>AiShort (ChatGPT Shortcut)</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  Crafted with <HeartFilled className="text-rose-500 text-[10px]" /> for AI creators
                </span>
              </div>

              <div className="flex items-center gap-6">
                <button onClick={() => setCurrentTab("all")} className="hover:text-teal-600 transition-colors">
                  Prompts
                </button>
                <button onClick={() => setCurrentTab("community")} className="hover:text-teal-600 transition-colors">
                  Community
                </button>
                <button onClick={() => setCurrentTab("docs")} className="hover:text-teal-600 transition-colors">
                  Documentation
                </button>
                <a
                  href="https://github.com/rockbenben/ChatGPT-Shortcut"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-teal-600 transition-colors"
                >
                  <GithubOutlined />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </footer>

          {/* Prompt Detail Modal */}
          <PromptModal
            card={selectedCard}
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            isFavorite={selectedCard ? isFavorite(selectedCard.id) : false}
            onToggleFavorite={toggleFavorite}
            onSelectRelated={handleSelectRelated}
          />

          {/* User Profile / Auth Modal */}
          <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
        </div>
      </AntdApp>
    </ConfigProvider>
  );
}
