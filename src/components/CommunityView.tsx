import React, { useState, useMemo } from "react";
import { Input, Button, Modal, Select, message, Empty, Tooltip } from "antd";
import {
  TeamOutlined,
  LikeOutlined,
  LikeFilled,
  PlusOutlined,
  SearchOutlined,
  CopyOutlined,
  CheckOutlined,
  UserOutlined,
  FireOutlined,
} from "@ant-design/icons";
import { formatCompactNumber } from "../utils/formatters";
import { useI18n } from "../utils/i18n";
import { PromptCardData } from "../services/cardLoader";

export interface CommunityPrompt {
  id: number;
  title: string;
  prompt: string;
  remark: string;
  owner: string;
  upvotes: number;
  tags: string[];
  createdAt: string;
}

const INITIAL_COMMUNITY_PROMPTS: CommunityPrompt[] = [
  {
    id: 1001,
    title: "Senior Full-Stack Architecture Consultant",
    remark: "Architectural design, system decomposition, and tech-stack evaluation",
    prompt: "Act as a Principal Software Architect. I am planning to build [project_description]. Analyze the requirements and provide: 1. High-level Architecture diagram (ASCII / text) 2. Recommended tech stack with trade-offs 3. Key database schemas 4. Scalability bottlenecks and mitigation strategies.",
    owner: "DevMaster_99",
    upvotes: 428,
    tags: ["code", "ai"],
    createdAt: "1 day ago",
  },
  {
    id: 1002,
    title: "Viral LinkedIn Post Copywriter",
    remark: "Hook-driven, readable, high-engagement B2B social posts",
    prompt: "Write a high-engagement LinkedIn post based on [topic or achievement]. Format using short punchy sentences, a strong 1-line hook that creates curiosity, bullet points with actionable takeaways, and a question at the end to prompt discussion. Keep emojis minimal and professional.",
    owner: "ContentGrowth",
    upvotes: 312,
    tags: ["write"],
    createdAt: "2 days ago",
  },
  {
    id: 1003,
    title: "Interactive Language Immersion Partner",
    remark: "Conversational roleplay with immediate feedback and grammar tips",
    prompt: "I want to practice [target_language] at [proficiency_level] level. Let's roleplay a scenario where you are [character_role] and I am [my_role]. Only reply in [target_language]. After each of my messages, first provide a small correction or alternative phrase in brackets, then continue the dialogue naturally.",
    owner: "PolyglotAI",
    upvotes: 275,
    tags: ["language", "pedagogy"],
    createdAt: "3 days ago",
  },
  {
    id: 1004,
    title: "Regex & Pattern Engineer",
    remark: "Generate and explain complex regular expressions with test cases",
    prompt: "I need a regular expression to match [description_of_pattern]. Provide: 1. The regex pattern 2. Detailed explanation of each token/group 3. Example matching strings 4. Example non-matching strings.",
    owner: "RegexWizard",
    upvotes: 189,
    tags: ["code"],
    createdAt: "4 days ago",
  },
  {
    id: 1005,
    title: "Dungeon Master AI RPG",
    remark: "Turn-based fantasy roleplaying game with stats and inventory",
    prompt: "You are the Dungeon Master of a dark fantasy text adventure RPG. Start by setting the scene for my character, a [character_class] in [setting]. Describe the environment, present me with 3 choices, and allow custom action input. Keep track of Health: 100 and Gold: 50 in a status header.",
    owner: "LoreWeaver",
    upvotes: 245,
    tags: ["games"],
    createdAt: "5 days ago",
  },
];

interface CommunityViewProps {
  onOpenDetails: (card: PromptCardData) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({ onOpenDetails }) => {
  const { t } = useI18n();
  const [prompts, setPrompts] = useState<CommunityPrompt[]>(INITIAL_COMMUNITY_PROMPTS);
  const [votedIds, setVotedIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Submit Modal
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPrompt, setNewPrompt] = useState("");
  const [newRemark, setNewRemark] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newTags, setNewTags] = useState<string[]>(["ai"]);

  const handleVote = (id: number) => {
    if (votedIds.includes(id)) {
      setVotedIds(votedIds.filter((v) => v !== id));
      setPrompts(
        prompts.map((p) => (p.id === id ? { ...p, upvotes: p.upvotes - 1 } : p))
      );
      message.info("Vote removed");
    } else {
      setVotedIds([...votedIds, id]);
      setPrompts(
        prompts.map((p) => (p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p))
      );
      message.success("Upvoted prompt!");
    }
  };

  const handleCopy = (prompt: CommunityPrompt) => {
    navigator.clipboard.writeText(prompt.prompt);
    setCopiedId(prompt.id);
    message.success("Prompt copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmitPrompt = () => {
    if (!newTitle.trim() || !newPrompt.trim()) {
      message.error("Please provide both title and prompt content");
      return;
    }
    const created: CommunityPrompt = {
      id: Date.now(),
      title: newTitle.trim(),
      prompt: newPrompt.trim(),
      remark: newRemark.trim() || newTitle.trim(),
      owner: newAuthor.trim() || "Anonymous Creator",
      upvotes: 1,
      tags: newTags,
      createdAt: "Just now",
    };
    setPrompts([created, ...prompts]);
    setVotedIds([...votedIds, created.id]);
    setSubmitModalOpen(false);
    message.success("Your prompt was submitted to the community!");
  };

  const filteredPrompts = useMemo(() => {
    return prompts.filter((p) => {
      const matchSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.remark.toLowerCase().includes(searchQuery.toLowerCase());

      const matchTag = selectedTag === "all" || p.tags.includes(selectedTag);

      return matchSearch && matchTag;
    });
  }, [prompts, searchQuery, selectedTag]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Banner */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#1a1f26] p-6 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                <TeamOutlined />
              </span>
              {t("nav.community", "Community Prompts")}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Explore community-curated prompts, upvote your favorites, and submit your own discoveries.
            </p>
          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setSubmitModalOpen(true)}
            className="!bg-teal-600 hover:!bg-teal-700 h-9 font-medium rounded-xl text-xs"
          >
            Submit Prompt
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {["all", "code", "write", "ai", "language", "games"].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedTag === tag
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <Input
            prefix={<SearchOutlined className="text-slate-400" />}
            placeholder="Search community prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-xl text-xs bg-white dark:bg-slate-800"
            allowClear
          />
        </div>
      </div>

      {/* Prompts Grid */}
      {filteredPrompts.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <Empty description={<span className="text-xs text-slate-500">No prompts matched your search.</span>} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrompts.map((p) => {
            const hasVoted = votedIds.includes(p.id);
            return (
              <div
                key={p.id}
                className="group flex flex-col justify-between rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#20262e] hover:border-teal-500/50 hover:shadow-lg transition-all p-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-1">
                      {p.title}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 shrink-0">
                      <UserOutlined className="text-xs" />
                      <span>{p.owner}</span>
                    </div>
                  </div>

                  {p.remark && (
                    <div className="mb-2.5 px-2.5 py-1 rounded bg-teal-50/70 dark:bg-teal-950/40 text-[12px] font-medium text-teal-800 dark:text-teal-300 line-clamp-1">
                      {p.remark}
                    </div>
                  )}

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 mb-4 font-normal">
                    {p.prompt}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => handleVote(p.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                        hasVoted
                          ? "bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-teal-600"
                      }`}
                    >
                      {hasVoted ? <LikeFilled /> : <LikeOutlined />}
                      <span>{formatCompactNumber(p.upvotes)}</span>
                    </button>

                    <button
                      onClick={() => handleCopy(p)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                        copiedId === p.id
                          ? "bg-teal-600 text-white"
                          : "bg-slate-100 dark:bg-slate-800 hover:bg-teal-600 hover:text-white text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      {copiedId === p.id ? <CheckOutlined /> : <CopyOutlined />}
                      <span>{copiedId === p.id ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Submit Prompt */}
      <Modal
        open={submitModalOpen}
        onCancel={() => setSubmitModalOpen(false)}
        title="Submit Prompt to Community"
        onOk={handleSubmitPrompt}
        okText="Submit"
        okButtonProps={{ className: "!bg-teal-600" }}
        centered
        destroyOnHidden
      >
        <div className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Title *
            </label>
            <Input
              placeholder="e.g. Docker Compose Generator"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Summary / Remark
            </label>
            <Input
              placeholder="e.g. Creates production-ready docker compose configurations"
              value={newRemark}
              onChange={(e) => setNewRemark(e.target.value)}
              className="rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Prompt Content *
            </label>
            <Input.TextArea
              rows={4}
              placeholder="Your prompt text. Use [placeholders] for customizable values."
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              className="rounded-lg font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Your Name / Nickname
            </label>
            <Input
              placeholder="e.g. PromptEngineer"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              className="rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tags
            </label>
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Select tags"
              value={newTags}
              onChange={setNewTags}
              options={[
                { value: "code", label: "code" },
                { value: "write", label: "write" },
                { value: "ai", label: "ai" },
                { value: "language", label: "language" },
                { value: "games", label: "games" },
              ]}
              className="rounded-lg"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
