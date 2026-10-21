import React, { useState, useMemo } from "react";
import { Modal, Tooltip, Input, message } from "antd";
import {
  CopyOutlined,
  CheckOutlined,
  HeartOutlined,
  HeartFilled,
  FireOutlined,
  QuestionCircleOutlined,
  ExportOutlined,
  SendOutlined,
  UserOutlined,
  ShareAltOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { PromptCardData } from "../services/cardLoader";
import { formatCompactNumber } from "../utils/formatters";
import { estimateTokens, extractPlaceholders, renderPromptWithPlaceholders } from "../utils/promptRender";
import { useI18n } from "../utils/i18n";

interface PromptModalProps {
  card: PromptCardData | null;
  open: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onSelectRelated: (cardId: number) => void;
}

interface LocalComment {
  id: string;
  author: string;
  text: string;
  time: string;
}

export const PromptModal: React.FC<PromptModalProps> = ({
  card,
  open,
  onClose,
  isFavorite,
  onToggleFavorite,
  onSelectRelated,
}) => {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  
  // Interactive comments state
  const [comments, setComments] = useState<LocalComment[]>([
    {
      id: "1",
      author: "Alex_AI",
      text: "Tested this with GPT-4o and Claude 3.5 Sonnet. The output was crisp, strictly adhering to conventional commit formatting!",
      time: "2 hours ago",
    },
    {
      id: "2",
      author: "PromptEngineer99",
      text: "Pro tip: You can append 'Ensure git type is feat/fix/chore/refactor' if you want explicit classification.",
      time: "Yesterday",
    },
  ]);
  const [commentText, setCommentText] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");

  // Placeholders from prompt template
  const placeholders = useMemo(() => {
    if (!card?.prompt) return [];
    return extractPlaceholders(card.prompt);
  }, [card?.prompt]);

  // Dynamic rendered prompt
  const finalPrompt = useMemo(() => {
    if (!card?.prompt) return "";
    return renderPromptWithPlaceholders(card.prompt, variableValues);
  }, [card?.prompt, variableValues]);

  // Statistics
  const charCount = finalPrompt.length;
  const tokenEstimate = estimateTokens(finalPrompt);

  const handleCopy = () => {
    if (!finalPrompt) return;
    navigator.clipboard.writeText(finalPrompt);
    setCopied(true);
    message.success(t("action.copied", "Copied prompt to clipboard!"));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newComment: LocalComment = {
      id: Date.now().toString(),
      author: commentAuthor.trim() || "AI Explorer",
      text: commentText.trim(),
      time: "Just now",
    };
    setComments([newComment, ...comments]);
    setCommentText("");
    message.success("Comment added!");
  };

  if (!card) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={760}
      centered
      destroyOnHidden
      className="prompt-detail-modal"
      styles={{
        content: {
          padding: 0,
          borderRadius: 16,
          overflow: "hidden",
        },
        body: {
          padding: 0,
          maxHeight: "85vh",
          overflowY: "auto",
        },
      }}
    >
      <div className="bg-white dark:bg-[#1f242c] text-slate-800 dark:text-slate-100">
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 font-semibold">
                  #{card.id}
                </span>
                {card.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-xs px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {card.title}
              </h2>
              {card.remark && (
                <p className="text-sm text-teal-600 dark:text-teal-400 font-medium mt-1">
                  {card.remark}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Tooltip title={isFavorite ? t("action.removeFavorite", "Remove favorite") : t("action.favorite", "Add to favorites")}>
                <button
                  onClick={() => onToggleFavorite(card.id)}
                  className={`p-2 rounded-xl transition-colors ${
                    isFavorite
                      ? "text-rose-500 bg-rose-50 dark:bg-rose-950/40"
                      : "text-slate-400 hover:text-rose-500 bg-slate-100 dark:bg-slate-800"
                  }`}
                >
                  {isFavorite ? <HeartFilled className="text-lg" /> : <HeartOutlined className="text-lg" />}
                </button>
              </Tooltip>

              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm flex items-center gap-2 shadow-sm transition-all"
              >
                {copied ? <CheckOutlined /> : <CopyOutlined />}
                <span>{copied ? t("action.copied", "Copied") : t("action.copyPrompt", "Copy Prompt")}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Interactive Placeholders Fill-in Section */}
          {placeholders.length > 0 && (
            <div className="p-4 rounded-xl border border-teal-200/80 dark:border-teal-900/60 bg-teal-50/40 dark:bg-teal-950/20">
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-3">
                <ThunderboltOutlined />
                {t("prompt.placeholders", "Interactive Fill-in")}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {placeholders.map((ph) => (
                  <div key={ph}>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                      [{ph}]
                    </label>
                    <Input
                      placeholder={`Enter ${ph}...`}
                      value={variableValues[ph] || ""}
                      onChange={(e) =>
                        setVariableValues({ ...variableValues, [ph]: e.target.value })
                      }
                      className="rounded-lg text-sm bg-white dark:bg-slate-800"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prompt Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
                {t("prompt.original", "Prompt Template")}
              </span>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span>{charCount} {t("prompt.stats.chars", "chars")}</span>
                <span>·</span>
                <span>~{tokenEstimate} {t("prompt.stats.tokens", "tokens")}</span>
              </div>
            </div>

            <div className="relative group">
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap select-all overflow-x-auto border border-slate-800 shadow-inner">
                {finalPrompt}
              </pre>
            </div>
          </div>

          {/* FAQ / Usage Tips */}
          {card.faq && card.faq.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono mb-3 flex items-center gap-1.5">
                <QuestionCircleOutlined />
                {t("prompt.faq", "Usage Tips & FAQ")}
              </div>
              <div className="space-y-3">
                {card.faq.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40"
                  >
                    <div className="font-semibold text-xs text-slate-800 dark:text-slate-200 mb-1">
                      Q: {item.q}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.a}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Prompts */}
          {card.related && card.related.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono mb-3">
                {t("prompt.related", "Related Prompts")}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {card.related.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelated(rel.id)}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-500/60 bg-white dark:bg-slate-800/60 hover:shadow-sm cursor-pointer transition-all"
                  >
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {rel.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {rel.remark}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Discussion & Comments */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono mb-3">
              {t("comments.title", "Discussion & Feedback")} ({comments.length})
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="mb-4 space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Your Name (optional)"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  className="w-40 text-xs rounded-lg bg-white dark:bg-slate-800"
                />
              </div>
              <div className="flex gap-2">
                <Input.TextArea
                  rows={2}
                  placeholder={t("comments.placeholder", "Share your test results or tips for this prompt...")}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="text-xs rounded-lg bg-white dark:bg-slate-800"
                />
                <button
                  type="submit"
                  className="px-3.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium flex items-center justify-center shrink-0 transition-colors"
                >
                  <SendOutlined />
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <UserOutlined className="text-[10px]" />
                      {c.author}
                    </span>
                    <span className="text-[10px]">{c.time}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
