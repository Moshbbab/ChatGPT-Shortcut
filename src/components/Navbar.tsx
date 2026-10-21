import React from "react";
import { Flex, Typography, Button, Dropdown, MenuProps, Tooltip, Badge } from "antd";
import {
  FireFilled,
  AppstoreOutlined,
  BarsOutlined,
  SunOutlined,
  MoonOutlined,
  GlobalOutlined,
  UserOutlined,
  FolderOpenOutlined,
  TeamOutlined,
  ReadOutlined,
  ThunderboltFilled,
} from "@ant-design/icons";
import { LANGUAGES, LanguageCode, useI18n } from "../utils/i18n";

interface NavbarProps {
  currentTab: "all" | "myspace" | "community" | "docs";
  onTabChange: (tab: "all" | "myspace" | "community" | "docs") => void;
  viewMode: "grid" | "compact";
  onToggleViewMode: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  favoritesCount: number;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  viewMode,
  onToggleViewMode,
  isDarkMode,
  onToggleTheme,
  favoritesCount,
  onOpenAuth,
}) => {
  const { currentLanguage, setLanguage, t } = useI18n();

  const langMenuItems: MenuProps["items"] = LANGUAGES.map((lang) => ({
    key: lang.code,
    label: (
      <Flex justify="space-between" align="center" style={{ minWidth: 140 }}>
        <span>{lang.nativeName}</span>
        <span style={{ fontSize: 11, color: "var(--site-color-text-tertiary, #888)", marginLeft: 8 }}>
          {lang.name}
        </span>
      </Flex>
    ),
    onClick: () => setLanguage(lang.code),
  }));

  const currentLangInfo = LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b border-black/5 dark:border-white/10 bg-white/85 dark:bg-[#1a1f26]/90 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => onTabChange("all")}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <ThunderboltFilled style={{ fontSize: 18 }} />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-lg tracking-tight leading-none text-slate-900 dark:text-white">
                AiShort
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800/60">
                  v4.5
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                ChatGPT Shortcut
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/60 p-1 rounded-xl">
            <button
              onClick={() => onTabChange("all")}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                currentTab === "all"
                  ? "bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <FireFilled className="text-xs" />
              {t("nav.allPrompts", "Prompts")}
            </button>
            <button
              onClick={() => onTabChange("myspace")}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                currentTab === "myspace"
                  ? "bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <FolderOpenOutlined className="text-xs" />
              {t("nav.mySpace", "My Space")}
              {favoritesCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300">
                  {favoritesCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onTabChange("community")}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                currentTab === "community"
                  ? "bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <TeamOutlined className="text-xs" />
              {t("nav.community", "Community")}
            </button>
            <button
              onClick={() => onTabChange("docs")}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                currentTab === "docs"
                  ? "bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <ReadOutlined className="text-xs" />
              {t("nav.docs", "Docs")}
            </button>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <Tooltip title={viewMode === "grid" ? "Compact View" : "Grid View"}>
            <Button
              type="text"
              shape="circle"
              icon={viewMode === "grid" ? <BarsOutlined /> : <AppstoreOutlined />}
              onClick={onToggleViewMode}
              className="text-slate-600 dark:text-slate-300 hover:text-teal-600"
            />
          </Tooltip>

          {/* Theme Toggle */}
          <Tooltip title={isDarkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}>
            <Button
              type="text"
              shape="circle"
              icon={isDarkMode ? <SunOutlined className="text-amber-400" /> : <MoonOutlined />}
              onClick={onToggleTheme}
              className="text-slate-600 dark:text-slate-300 hover:text-teal-600"
            />
          </Tooltip>

          {/* Language Selector */}
          <Dropdown menu={{ items: langMenuItems }} trigger={["click"]} placement="bottomRight">
            <Button
              type="text"
              className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 text-xs px-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <GlobalOutlined />
              <span className="hidden sm:inline">{currentLangInfo.nativeName}</span>
            </Button>
          </Dropdown>

          {/* User Account / Profile */}
          <Button
            type="primary"
            icon={<UserOutlined />}
            onClick={onOpenAuth}
            className="!bg-teal-700 hover:!bg-teal-800 text-xs font-medium rounded-lg h-8 px-3 shadow-sm"
          >
            <span className="hidden sm:inline">{t("common.level", "Level")} 1</span>
          </Button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden border-t border-slate-100 dark:border-slate-800 px-4 py-2 bg-slate-50/90 dark:bg-slate-900/90 overflow-x-auto gap-2">
        <button
          onClick={() => onTabChange("all")}
          className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
            currentTab === "all"
              ? "bg-teal-600 text-white"
              : "text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          }`}
        >
          {t("nav.allPrompts", "Prompts")}
        </button>
        <button
          onClick={() => onTabChange("myspace")}
          className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
            currentTab === "myspace"
              ? "bg-teal-600 text-white"
              : "text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          }`}
        >
          {t("nav.mySpace", "My Space")} ({favoritesCount})
        </button>
        <button
          onClick={() => onTabChange("community")}
          className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
            currentTab === "community"
              ? "bg-teal-600 text-white"
              : "text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          }`}
        >
          {t("nav.community", "Community")}
        </button>
        <button
          onClick={() => onTabChange("docs")}
          className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
            currentTab === "docs"
              ? "bg-teal-600 text-white"
              : "text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          }`}
        >
          {t("nav.docs", "Docs")}
        </button>
      </div>
    </header>
  );
};
