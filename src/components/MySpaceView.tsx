import React, { useState, useMemo } from "react";
import { Modal, Input, Select, Button, Popconfirm, message, Tooltip, Empty } from "antd";
import {
  PlusOutlined,
  HeartFilled,
  DownloadOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  CheckOutlined,
  TagOutlined,
  SearchOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { UserPrompt, useUserPrompt } from "../hooks/useUserPrompt";
import { useFavorite } from "../hooks/useFavorite";
import { getAllCards, PromptCardData } from "../services/cardLoader";
import { useI18n } from "../utils/i18n";
import { PromptCardView } from "./PromptCardView";

interface MySpaceViewProps {
  onOpenDetails: (card: PromptCardData) => void;
}

export const MySpaceView: React.FC<MySpaceViewProps> = ({ onOpenDetails }) => {
  const { currentLanguage, t } = useI18n();
  const { favorites, isFavorite, toggleFavorite, removeFavorite } = useFavorite();
  const { prompts: userPrompts, addPrompt, updatePrompt, removePrompt } = useUserPrompt();

  const [activeSubTab, setActiveSubTab] = useState<"all" | "favorites" | "custom">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  // Modal for Create/Edit Custom Prompt
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<UserPrompt | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formPrompt, setFormPrompt] = useState("");
  const [formRemark, setFormRemark] = useState("");
  const [formTags, setFormTags] = useState<string[]>(["ai"]);

  // Tag Manager Modal
  const [customTags, setCustomTags] = useState<string[]>(["Work", "Coding", "Writing", "Daily"]);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [newTagInput, setNewTagInput] = useState("");

  // All catalog cards for mapping favorite IDs to full card data
  const catalogCards = useMemo(() => {
    return getAllCards(currentLanguage);
  }, [currentLanguage]);

  const favoriteCards = useMemo(() => {
    return catalogCards.filter((c) => favorites.includes(c.id));
  }, [catalogCards, favorites]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingPrompt(null);
    setFormTitle("");
    setFormPrompt("");
    setFormRemark("");
    setFormTags(["ai"]);
    setEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (prompt: UserPrompt) => {
    setEditingPrompt(prompt);
    setFormTitle(prompt.title);
    setFormPrompt(prompt.prompt);
    setFormRemark(prompt.remark || "");
    setFormTags(prompt.tags || ["ai"]);
    setEditModalOpen(true);
  };

  // Submit Prompt
  const handleSavePrompt = async () => {
    if (!formTitle.trim() || !formPrompt.trim()) {
      message.error("Please provide both title and prompt content");
      return;
    }

    if (editingPrompt) {
      await updatePrompt(editingPrompt.id, {
        title: formTitle.trim(),
        prompt: formPrompt.trim(),
        remark: formRemark.trim() || formTitle.trim(),
        tags: formTags,
      });
    } else {
      await addPrompt({
        title: formTitle.trim(),
        prompt: formPrompt.trim(),
        remark: formRemark.trim() || formTitle.trim(),
        tags: formTags,
      });
    }
    setEditModalOpen(false);
  };

  // Export Data as JSON
  const handleExportData = () => {
    const data = {
      favorites,
      customPrompts: userPrompts,
      customTags,
      exportedAt: new Date().toISOString(),
      version: "4.5.0",
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aishort-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    message.success("Backup downloaded successfully!");
  };

  // Import Data from JSON
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.favorites && Array.isArray(parsed.favorites)) {
          localStorage.setItem("aishort_user_favorites", JSON.stringify(parsed.favorites));
        }
        if (parsed.customPrompts && Array.isArray(parsed.customPrompts)) {
          localStorage.setItem("aishort_custom_prompts", JSON.stringify(parsed.customPrompts));
        }
        if (parsed.customTags && Array.isArray(parsed.customTags)) {
          setCustomTags(parsed.customTags);
        }
        message.success("Data imported successfully! Refreshing view...");
        window.location.reload();
      } catch (err) {
        message.error("Invalid backup JSON file");
      }
    };
    reader.readAsText(file);
  };

  // Add custom tag
  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    if (!customTags.includes(newTagInput.trim())) {
      setCustomTags([...customTags, newTagInput.trim()]);
    }
    setNewTagInput("");
  };

  // Filter custom prompts
  const filteredCustomPrompts = useMemo(() => {
    return userPrompts.filter((p) => {
      const matchSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.remark && p.remark.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchTag =
        selectedTag === "all" ||
        (p.tags && p.tags.includes(selectedTag)) ||
        (p.customTags && p.customTags.includes(selectedTag));

      return matchSearch && matchTag;
    });
  }, [userPrompts, searchQuery, selectedTag]);

  // Filter favorites
  const filteredFavorites = useMemo(() => {
    return favoriteCards.filter((c) => {
      const matchSearch =
        !searchQuery ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.prompt.toLowerCase().includes(searchQuery.toLowerCase());

      const matchTag = selectedTag === "all" || c.tags.includes(selectedTag);

      return matchSearch && matchTag;
    });
  }, [favoriteCards, searchQuery, selectedTag]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header Stat & Actions Banner */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#1a1f26] p-6 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                <HeartFilled />
              </span>
              {t("myspace.title", "My Space")}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage your personal favorites, custom AI shortcuts, and local prompts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenCreate}
              className="!bg-teal-600 hover:!bg-teal-700 h-9 font-medium rounded-xl text-xs"
            >
              {t("action.addPrompt", "Create Prompt")}
            </Button>

            <Button
              icon={<TagOutlined />}
              onClick={() => setTagModalOpen(true)}
              className="h-9 rounded-xl text-xs"
            >
              {t("myspace.tags", "Tags")}
            </Button>

            <Button
              icon={<DownloadOutlined />}
              onClick={handleExportData}
              className="h-9 rounded-xl text-xs"
            >
              {t("myspace.export", "Export")}
            </Button>

            <label className="cursor-pointer">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors h-9">
                <UploadOutlined />
                {t("myspace.import", "Import")}
              </span>
              <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
            </label>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <div className="text-xs text-slate-500 dark:text-slate-400">Total Saved</div>
            <div className="text-xl font-bold font-mono text-slate-800 dark:text-slate-100 mt-0.5">
              {favorites.length + userPrompts.length}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <div className="text-xs text-slate-500 dark:text-slate-400">{t("myspace.favorites", "Favorites")}</div>
            <div className="text-xl font-bold font-mono text-rose-500 mt-0.5">
              {favorites.length}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <div className="text-xs text-slate-500 dark:text-slate-400">{t("myspace.customPrompts", "My Prompts")}</div>
            <div className="text-xl font-bold font-mono text-teal-600 dark:text-teal-400 mt-0.5">
              {userPrompts.length}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <div className="text-xs text-slate-500 dark:text-slate-400">{t("myspace.tags", "Tags")}</div>
            <div className="text-xl font-bold font-mono text-indigo-500 mt-0.5">
              {customTags.length}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSubTab === "all"
                ? "bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            All Items ({favoriteCards.length + userPrompts.length})
          </button>
          <button
            onClick={() => setActiveSubTab("favorites")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSubTab === "favorites"
                ? "bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            {t("myspace.favorites", "Favorites")} ({favoriteCards.length})
          </button>
          <button
            onClick={() => setActiveSubTab("custom")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSubTab === "custom"
                ? "bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            {t("myspace.customPrompts", "My Prompts")} ({userPrompts.length})
          </button>
        </div>

        <div className="w-full sm:w-72">
          <Input
            prefix={<SearchOutlined className="text-slate-400" />}
            placeholder="Search your saved items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-xl text-xs bg-white dark:bg-slate-800"
            allowClear
          />
        </div>
      </div>

      {/* Prompts Display */}
      {activeSubTab === "custom" ? (
        /* Only Custom Prompts */
        <div>
          {filteredCustomPrompts.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <Empty
                description={
                  <span className="text-xs text-slate-500">
                    No custom prompts created yet. Click "Create Prompt" to make your first shortcut!
                  </span>
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCustomPrompts.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#20262e] p-4 flex flex-col justify-between hover:shadow-md transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <LockOutlined className="text-xs text-amber-500" />
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {p.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1 text-slate-400 hover:text-teal-600 rounded"
                        >
                          <EditOutlined className="text-xs" />
                        </button>
                        <Popconfirm
                          title="Delete this prompt?"
                          onConfirm={() => removePrompt(p.id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <button className="p-1 text-slate-400 hover:text-rose-500 rounded">
                            <DeleteOutlined className="text-xs" />
                          </button>
                        </Popconfirm>
                      </div>
                    </div>

                    {p.remark && (
                      <div className="mb-2 px-2 py-0.5 rounded bg-teal-50/80 dark:bg-teal-950/40 text-[11px] text-teal-700 dark:text-teal-300 font-medium">
                        {p.remark}
                      </div>
                    )}

                    <p className="text-xs text-slate-600 dark:text-slate-300 font-mono bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg line-clamp-3 mb-3">
                      {p.prompt}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {p.tags?.map((t) => (
                        <span key={t} className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(p.prompt);
                        message.success("Copied to clipboard!");
                      }}
                      className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-teal-600 hover:text-white text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <CopyOutlined />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeSubTab === "favorites" ? (
        /* Only Favorites */
        <div>
          {filteredFavorites.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <Empty
                description={
                  <span className="text-xs text-slate-500">
                    No favorite prompts found. Star prompts from the Prompts tab to collect them here!
                  </span>
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFavorites.map((card) => (
                <PromptCardView
                  key={card.id}
                  card={card}
                  isFavorite={isFavorite(card.id)}
                  onToggleFavorite={toggleFavorite}
                  onOpenDetails={onOpenDetails}
                  viewMode="grid"
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* All: Both Favorites and Custom Prompts */
        <div className="space-y-8">
          {filteredCustomPrompts.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3 font-mono flex items-center gap-2">
                <span>{t("myspace.customPrompts", "Custom Prompts")}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                  {filteredCustomPrompts.length}
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCustomPrompts.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#20262e] p-4 flex flex-col justify-between hover:shadow-md transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          <LockOutlined className="text-xs text-amber-500" />
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {p.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1 text-slate-400 hover:text-teal-600 rounded"
                          >
                            <EditOutlined className="text-xs" />
                          </button>
                          <Popconfirm
                            title="Delete this prompt?"
                            onConfirm={() => removePrompt(p.id)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <button className="p-1 text-slate-400 hover:text-rose-500 rounded">
                              <DeleteOutlined className="text-xs" />
                            </button>
                          </Popconfirm>
                        </div>
                      </div>

                      {p.remark && (
                        <div className="mb-2 px-2 py-0.5 rounded bg-teal-50/80 dark:bg-teal-950/40 text-[11px] text-teal-700 dark:text-teal-300 font-medium">
                          {p.remark}
                        </div>
                      )}

                      <p className="text-xs text-slate-600 dark:text-slate-300 font-mono bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg line-clamp-3 mb-3">
                        {p.prompt}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {p.tags?.map((t) => (
                          <span key={t} className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                            #{t}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(p.prompt);
                          message.success("Copied to clipboard!");
                        }}
                        className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-teal-600 hover:text-white text-xs font-medium transition-colors flex items-center gap-1"
                      >
                        <CopyOutlined />
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3 font-mono flex items-center gap-2">
              <span>{t("myspace.favorites", "Saved Favorites")}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                {filteredFavorites.length}
              </span>
            </h2>
            {filteredFavorites.length === 0 ? (
              <div className="py-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500">
                  No favorites added yet. Click the heart icon on any prompt to save it here!
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFavorites.map((card) => (
                  <PromptCardView
                    key={card.id}
                    card={card}
                    isFavorite={isFavorite(card.id)}
                    onToggleFavorite={toggleFavorite}
                    onOpenDetails={onOpenDetails}
                    viewMode="grid"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Create or Edit Prompt */}
      <Modal
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        title={editingPrompt ? "Edit Prompt" : "Create New Prompt"}
        onOk={handleSavePrompt}
        okText="Save Prompt"
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
              placeholder="e.g. SQL Query Generator"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Remark / Short Summary
            </label>
            <Input
              placeholder="e.g. Converts natural language into clean SQL queries"
              value={formRemark}
              onChange={(e) => setFormRemark(e.target.value)}
              className="rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Prompt Template Content *
            </label>
            <Input.TextArea
              rows={4}
              placeholder="Type your prompt template here. Use [brackets] for dynamic placeholders, e.g. [table_name], [question]"
              value={formPrompt}
              onChange={(e) => setFormPrompt(e.target.value)}
              className="rounded-lg font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tags
            </label>
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Select or enter tags"
              value={formTags}
              onChange={setFormTags}
              options={[
                { value: "code", label: "code" },
                { value: "write", label: "write" },
                { value: "ai", label: "ai" },
                { value: "language", label: "language" },
                { value: "pedagogy", label: "pedagogy" },
                { value: "games", label: "games" },
                { value: "academic", label: "academic" },
              ]}
              className="rounded-lg"
            />
          </div>
        </div>
      </Modal>

      {/* Modal: Custom Tag Manager */}
      <Modal
        open={tagModalOpen}
        onCancel={() => setTagModalOpen(false)}
        title="Manage Custom Tags"
        footer={[
          <Button key="close" onClick={() => setTagModalOpen(false)}>
            Close
          </Button>,
        ]}
        centered
      >
        <div className="space-y-4 py-2">
          <div className="flex gap-2">
            <Input
              placeholder="New tag name..."
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onPressEnter={handleAddTag}
              className="rounded-lg text-sm"
            />
            <Button type="primary" onClick={handleAddTag} className="!bg-teal-600 rounded-lg">
              Add Tag
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {customTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-medium"
              >
                #{tag}
                <button
                  onClick={() => setCustomTags(customTags.filter((t) => t !== tag))}
                  className="hover:text-rose-500 ml-1 text-slate-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};
