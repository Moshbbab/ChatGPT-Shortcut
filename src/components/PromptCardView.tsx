import React, { useState } from "react";
import { Tooltip, message } from "antd";
import {
  FireOutlined,
  HeartOutlined,
  HeartFilled,
  CopyOutlined,
  CheckOutlined,
  ExportOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { PromptCardData } from "../services/cardLoader";
import { formatCompactNumber } from "../utils/formatters";
import { useI18n } from "../utils/i18n";

interface PromptCardViewProps {
  card: PromptCardData;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onOpenDetails: (card: PromptCardData) => void;
  viewMode?: "grid" | "compact";
}

export const PromptCardView: React.FC<PromptCardViewProps> = ({
  card,
  isFavorite,
  onToggleFavorite,
  onOpenDetails,
  viewMode = "grid",
}) => {
  const [copied, setCopied] = useState(false);
  const { t } = useI18n();

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(card.prompt);
    setCopied(true);
    message.success(t("action.copied", "Copied prompt to clipboard!"));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(card.id);
  };

  if (viewMode === "compact") {
    return (
      <div
        onClick={() => onOpenDetails(card)}
        className="group relative flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#20262e] hover:border-teal-500/50 dark:hover:border-teal-500/50 hover:shadow-md transition-all cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
          <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-mono text-xs font-semibold shrink-0">
            #{card.id}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {card.title}
              </h3>
              {card.tags?.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="hidden sm:inline text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {card.remark || card.prompt}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 font-mono mr-2">
            <FireOutlined className="text-amber-500" />
            {formatCompactNumber(card.count)}
          </div>

          <Tooltip title={isFavorite ? t("action.removeFavorite", "Remove favorite") : t("action.favorite", "Add to favorites")}>
            <button
              onClick={handleFav}
              className={`p-2 rounded-lg transition-colors ${
                isFavorite
                  ? "text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  : "text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {isFavorite ? <HeartFilled /> : <HeartOutlined />}
            </button>
          </Tooltip>

          <Tooltip title={t("action.copyPrompt", "Copy Prompt")}>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {copied ? <CheckOutlined className="text-teal-600" /> : <CopyOutlined />}
            </button>
          </Tooltip>

          <button
            onClick={() => onOpenDetails(card)}
            className="p-2 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowRightOutlined />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onOpenDetails(card)}
      className="group flex flex-col justify-between rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#20262e] hover:border-teal-500/50 dark:hover:border-teal-500/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 p-4 cursor-pointer"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400">
              #{card.id}
            </span>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-1">
              {card.title}
            </h3>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 shrink-0">
            <FireOutlined className="text-amber-500 text-xs" />
            <span>{formatCompactNumber(card.count)}</span>
          </div>
        </div>

        {/* Remark banner */}
        {card.remark && (
          <div className="mb-2.5 px-2.5 py-1 rounded bg-teal-50/70 dark:bg-teal-950/40 border border-teal-100/60 dark:border-teal-900/40 text-[12px] font-medium text-teal-800 dark:text-teal-300 line-clamp-1">
            {card.remark}
          </div>
        )}

        {/* Prompt preview */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 mb-4 font-normal">
          {card.prompt}
        </p>
      </div>

      <div>
        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {card.tags?.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Bottom Bar */}
        <div
          className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleFav}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                isFavorite
                  ? "text-rose-500 bg-rose-50 dark:bg-rose-950/40"
                  : "text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {isFavorite ? <HeartFilled className="text-sm" /> : <HeartOutlined className="text-sm" />}
            </button>
            {card.website && (
              <a
                href={card.website}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Source Link"
              >
                <ExportOutlined className="text-xs" />
              </a>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 shadow-sm ${
                copied
                  ? "bg-teal-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 hover:bg-teal-600 hover:text-white dark:hover:bg-teal-600 text-slate-700 dark:text-slate-200"
              }`}
            >
              {copied ? <CheckOutlined /> : <CopyOutlined />}
              <span>{copied ? t("action.copied", "Copied") : t("action.copy", "Copy")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
