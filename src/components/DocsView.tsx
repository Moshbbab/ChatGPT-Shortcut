import React, { useState } from "react";
import { Collapse, Tag } from "antd";
import {
  ReadOutlined,
  ThunderboltOutlined,
  AppstoreOutlined,
  ChromeOutlined,
  BulbOutlined,
  HeartOutlined,
} from "@ant-design/icons";

export const DocsView: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState("getting-started");

  const topics = [
    { id: "getting-started", label: "Getting Started", icon: <ThunderboltOutlined /> },
    { id: "interface", label: "Interface & Features", icon: <AppstoreOutlined /> },
    { id: "extension", label: "Browser Extension", icon: <ChromeOutlined /> },
    { id: "prompting", label: "Prompt Engineering Tips", icon: <BulbOutlined /> },
    { id: "myspace", label: "My Space & Backup", icon: <HeartOutlined /> },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#1a1f26] p-6 mb-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
            <ReadOutlined />
          </span>
          Guides & Documentation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Learn how to get the most out of ChatGPT Shortcut, craft better prompts, and manage your custom library.
        </p>

        {/* Topic navigation tabs */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          {topics.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTopic(t.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedTopic === t.id
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900"
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#1a1f26] p-6 sm:p-8 space-y-6">
        {selectedTopic === "getting-started" && (
          <div className="prose dark:prose-invert max-w-none space-y-4 text-slate-700 dark:text-slate-300 text-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">What is ChatGPT Shortcut (AiShort)?</h2>
            <p>
              ChatGPT Shortcut is an open-source AI prompt repository and productivity management suite.
              It categorizes proven, battle-tested prompt templates across programming, writing, language learning,
              roleplay, education, and creative disciplines.
            </p>
            <div className="p-4 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-900/40">
              <h3 className="text-sm font-semibold text-teal-900 dark:text-teal-200 mb-1">Quick 3-Step Workflow:</h3>
              <ol className="list-decimal pl-5 space-y-1 text-xs text-teal-800 dark:text-teal-300">
                <li>Search or filter prompts by category tag (e.g. #code, #write, #language).</li>
                <li>Click on any card to open the interactive filler, or click <strong>Copy</strong> directly.</li>
                <li>Paste into ChatGPT, Claude, Gemini, DeepSeek, or your favorite LLM interface.</li>
              </ol>
            </div>
          </div>
        )}

        {selectedTopic === "interface" && (
          <div className="space-y-4 text-slate-700 dark:text-slate-300 text-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Interface Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="font-semibold text-slate-900 dark:text-white mb-1">Grid & Compact Views</div>
                <p className="text-xs text-slate-500">
                  Toggle between detailed cards with descriptions and tags, or high-density compact rows for rapid scanning.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="font-semibold text-slate-900 dark:text-white mb-1">Interactive Placeholders</div>
                <p className="text-xs text-slate-500">
                  Placeholders in brackets like <code>[topic]</code> generate live inputs in the detail view, updating the prompt in real time.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="font-semibold text-slate-900 dark:text-white mb-1">Multilingual Support</div>
                <p className="text-xs text-slate-500">
                  Full localization in 18 languages, switching prompt titles, prompts, remarks, and UI instantly.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="font-semibold text-slate-900 dark:text-white mb-1">Token Estimation</div>
                <p className="text-xs text-slate-500">
                  Built-in token counter helps you budget context window consumption before sending prompts to models.
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedTopic === "extension" && (
          <div className="space-y-4 text-slate-700 dark:text-slate-300 text-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Browser Extension Integration</h2>
            <p>
              The ChatGPT Shortcut extension injects a convenient shortcut drawer or sidebar right into ChatGPT, Claude, and Gemini web interfaces.
            </p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <p><strong>Chrome Web Store:</strong> Search for "ChatGPT Shortcut" or "AiShort".</p>
              <p><strong>Firefox Add-ons:</strong> Available as "ChatGPT Shortcut" in Firefox Add-on gallery.</p>
              <p><strong>Offline / Manual Install:</strong> Unpack the extension zip and enable Developer mode in Chrome extensions.</p>
            </div>
          </div>
        )}

        {selectedTopic === "prompting" && (
          <div className="space-y-4 text-slate-700 dark:text-slate-300 text-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Effective Prompt Engineering Principles</h2>
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-teal-600 dark:text-teal-400">1. Persona Assignment:</span>{" "}
                Begin with "Act as an expert [Role]" to steer tone, vocabulary, and depth.
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-teal-600 dark:text-teal-400">2. Output Constraints:</span>{" "}
                Specify structure (e.g. JSON, bullet list, table, Conventional Commit format).
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-teal-600 dark:text-teal-400">3. Delimiters:</span>{" "}
                Use triple backticks or brackets to clearly isolate input context from instructions.
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-teal-600 dark:text-teal-400">4. Few-Shot Examples:</span>{" "}
                Providing 1-2 positive examples significantly improves formatting fidelity.
              </div>
            </div>
          </div>
        )}

        {selectedTopic === "myspace" && (
          <div className="space-y-4 text-slate-700 dark:text-slate-300 text-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Space, Privacy & Data Backup</h2>
            <p>
              All your favorites, customized tags, and created prompts are persisted safely in your browser's local storage.
              No cloud login is required to organize your prompt collection.
            </p>
            <p>
              Use the <strong>Export</strong> feature in My Space to download a JSON snapshot at any time,
              and <strong>Import</strong> on another browser or device to restore your workspace.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
