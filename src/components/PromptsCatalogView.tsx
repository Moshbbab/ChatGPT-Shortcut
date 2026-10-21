import React, { useState, useMemo } from "react";
import { Input, Tooltip, Empty } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  CloseCircleOutlined,
  FireFilled,
} from "@ant-design/icons";
import { PromptCardData, getAllCards, filterCards } from "../services/cardLoader";
import { PromptCardView } from "./PromptCardView";
import { TagList, Tags, TagType } from "../data/tags";
import { useI18n } from "../utils/i18n";
import { SLOGAN, SUPPORTED_AI_TOOLS } from "../data/constants";

interface PromptsCatalogViewProps {
  viewMode: "grid" | "compact";
  isFavorite: (id: number) => boolean;
  onToggleFavorite: (id: number) => void;
  onOpenDetails: (card: PromptCardData) => void;
}

export const PromptsCatalogView: React.FC<PromptsCatalogViewProps> = ({
  viewMode,
  isFavorite,
  onToggleFavorite,
  onOpenDetails,
}) => {
  const { currentLanguage, t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  // Load all cards for the current language
  const allCards = useMemo(() => {
    return getAllCards(currentLanguage);
  }, [currentLanguage]);

  // Tag list for filter buttons
  const availableTags = useMemo(() => {
    return ["all", ...TagList];
  }, []);

  // Filtered cards
  const filteredCards = useMemo(() => {
    const tags = selectedTag === "all" ? [] : [selectedTag];
    return filterCards(allCards, searchQuery, tags);
  }, [allCards, searchQuery, selectedTag]);

  const hasActiveFilters = searchQuery.trim().length > 0 || selectedTag !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTag("all");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Hero Header */}
      <section className="text-center py-6 sm:py-10 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-slate-900 dark:text-white mb-2">
          AiShort
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed mb-2">
          {t("hero.slogan", SLOGAN)}
        </p>
        <div className="font-mono text-xs sm:text-sm text-slate-400 dark:text-slate-400 tracking-wide">
          {SUPPORTED_AI_TOOLS.join(" · ")}
        </div>
      </section>

      {/* Search & Tag Filter Section */}
      <div className="mb-6 space-y-4">
        {/* Search Input Bar */}
        <div className="relative max-w-2xl mx-auto">
          <Input
            size="large"
            prefix={<SearchOutlined className="text-slate-400 text-base ml-1" />}
            placeholder={t("search.placeholder", "Search prompts by title, description, or keyword...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
            className="rounded-2xl shadow-sm text-sm py-2.5 px-3 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-teal-500 focus:border-teal-500"
          />
        </div>

        {/* Tag Selection Chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-1">
          {availableTags.map((tag) => {
            const isSelected = selectedTag === tag;
            const tagMeta = Tags[tag];
            const label = tag === "all" ? t("common.all", "All") : tagMeta?.label || tag;

            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-teal-600 text-white shadow-sm shadow-teal-600/20 scale-105"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 hover:border-teal-500/50 hover:text-teal-600"
                }`}
              >
                {label}
              </button>
            );
          })}

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-1 transition-colors"
            >
              <CloseCircleOutlined />
              <span>{t("action.cancel", "Clear")}</span>
            </button>
          )}
        </div>

        {/* Match Count Info */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1 pt-1">
          <span>
            {t("search.totalCount", "Total: {count} prompts", { count: filteredCards.length })}
          </span>
          <span className="font-mono">
            {currentLanguage}
          </span>
        </div>
      </div>

      {/* Prompts Cards Grid / Compact List */}
      {filteredCards.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <Empty
            description={
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  No prompts matched your criteria
                </p>
                <p className="text-xs text-slate-400">
                  Try adjusting keywords or selecting another category tag.
                </p>
              </div>
            }
          />
        </div>
      ) : viewMode === "compact" ? (
        <div className="space-y-2">
          {filteredCards.map((card) => (
            <PromptCardView
              key={card.id}
              card={card}
              isFavorite={isFavorite(card.id)}
              onToggleFavorite={onToggleFavorite}
              onOpenDetails={onOpenDetails}
              viewMode="compact"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCards.map((card) => (
            <PromptCardView
              key={card.id}
              card={card}
              isFavorite={isFavorite(card.id)}
              onToggleFavorite={onToggleFavorite}
              onOpenDetails={onOpenDetails}
              viewMode="grid"
            />
          ))}
        </div>
      )}
    </div>
  );
};
