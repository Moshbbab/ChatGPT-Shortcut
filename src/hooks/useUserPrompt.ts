import { useState, useEffect, useCallback } from "react";
import { message } from "antd";

export interface UserPrompt {
  id: number;
  title: string;
  prompt: string;
  description?: string;
  remark?: string;
  notes?: string;
  tags?: string[];
  customTags?: string[];
  share?: boolean;
  owner?: string;
  createdAt?: string;
  updatedAt?: string;
}

const STORAGE_KEY = "aishort_custom_prompts";

export function useUserPrompt() {
  const [prompts, setPrompts] = useState<UserPrompt[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      // Sample default user custom prompt if empty
      return [
        {
          id: 9991,
          title: "My Code Reviewer Prompt",
          prompt: "Please review the following code for best practices, edge cases, potential bugs, and performance improvements: [paste code here]",
          remark: "Thorough code review checklist",
          description: "Inspects code structure and warns about potential defects",
          tags: ["code"],
          customTags: ["Work", "Daily"],
          owner: "You",
          share: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
    } catch {
      return [];
    }
  });

  const savePrompts = useCallback((newPrompts: UserPrompt[]) => {
    setPrompts(newPrompts);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrompts));
    } catch {}
  }, []);

  const addPrompt = useCallback(
    async (promptData: Partial<UserPrompt>) => {
      const newPrompt: UserPrompt = {
        id: Date.now(),
        title: promptData.title || "Untitled Prompt",
        prompt: promptData.prompt || "",
        description: promptData.description || "",
        remark: promptData.remark || promptData.title || "",
        tags: promptData.tags || ["ai"],
        customTags: promptData.customTags || [],
        share: promptData.share ?? false,
        owner: promptData.owner || "You",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updated = [newPrompt, ...prompts];
      savePrompts(updated);
      message.success("Prompt created successfully!");
      return newPrompt;
    },
    [prompts, savePrompts]
  );

  const updatePrompt = useCallback(
    async (id: number, promptData: Partial<UserPrompt>) => {
      const updated = prompts.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            ...promptData,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      savePrompts(updated);
      message.success("Prompt updated successfully!");
    },
    [prompts, savePrompts]
  );

  const removePrompt = useCallback(
    async (id: number) => {
      const updated = prompts.filter((p) => p.id !== id);
      savePrompts(updated);
      message.success("Prompt deleted");
    },
    [prompts, savePrompts]
  );

  const confirmRemovePrompt = useCallback(
    (id: number) => {
      removePrompt(id);
    },
    [removePrompt]
  );

  return {
    prompts,
    userPrompts: prompts,
    addPrompt,
    updatePrompt,
    removePrompt,
    confirmRemovePrompt,
  };
}
