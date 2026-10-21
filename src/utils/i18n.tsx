import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";

export type LanguageCode =
  | "zh-Hans"
  | "en"
  | "zh-Hant"
  | "ja"
  | "ko"
  | "es"
  | "fr"
  | "de"
  | "it"
  | "ru"
  | "pt"
  | "hi"
  | "ar"
  | "th"
  | "vi"
  | "tr"
  | "ind"
  | "bn";

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  dir?: "ltr" | "rtl";
}

export const LANGUAGES: LanguageInfo[] = [
  { code: "zh-Hans", name: "Simplified Chinese", nativeName: "简体中文" },
  { code: "en", name: "English", nativeName: "English" },
  { code: "zh-Hant", name: "Traditional Chinese", nativeName: "繁體中文" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "it", name: "Italian", nativeName: "Italiano" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "ar", name: "Arabic", nativeName: "العربية", dir: "rtl" },
  { code: "th", name: "Thai", nativeName: "ไทย" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe" },
  { code: "ind", name: "Indonesian", nativeName: "Bahasa Indonesia" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
];

export function toBcp47(locale: string, _configs?: any): string {
  if (locale === "ind") return "id";
  if (locale === "zh-Hans") return "zh-CN";
  if (locale === "zh-Hant") return "zh-TW";
  return locale;
}

// Built-in essential UI strings dictionary
const COMMON_STRINGS: Record<string, Record<string, string>> = {
  en: {
    "hero.slogan": "Maximize AI productivity with refined prompts & shortcuts",
    "hero.supportedAiTools": "ChatGPT · Claude · Midjourney · Gemini · Copilot etc.",
    "nav.allPrompts": "Prompts",
    "nav.community": "Community",
    "nav.mySpace": "My Space",
    "nav.docs": "Guides & Docs",
    "search.placeholder": "Search prompts by title, description, or keyword...",
    "search.filters": "Tags & Categories",
    "search.totalCount": "{count} prompts found",
    "action.copy": "Copy",
    "action.copied": "Copied to clipboard!",
    "action.copyPrompt": "Copy prompt",
    "action.addPrompt": "Create prompt",
    "action.edit": "Edit",
    "action.delete": "Delete",
    "action.favorite": "Favorite",
    "action.removeFavorite": "Remove favorite",
    "action.viewDetails": "Details",
    "action.close": "Close",
    "action.save": "Save",
    "action.cancel": "Cancel",
    "action.clearFilters": "Clear filters ({count})",
    "prompt.private": "Private",
    "prompt.placeholders": "Interactive Fill-in",
    "prompt.original": "Prompt Template",
    "prompt.stats.chars": "Characters",
    "prompt.stats.tokens": "Est. Tokens",
    "prompt.related": "Related Prompts",
    "prompt.faq": "Usage Tips & FAQ",
    "myspace.title": "My Space",
    "myspace.favorites": "My Favorites",
    "myspace.customPrompts": "Custom Prompts",
    "myspace.empty": "No saved prompts yet. Star prompts or create your own!",
    "myspace.tags": "Custom Tags",
    "myspace.export": "Export Backup",
    "myspace.import": "Import Data",
    "common.favorites": "Favorites",
    "common.all": "All",
    "common.theme": "Theme",
    "common.language": "Language",
    "common.signin": "Sign In",
    "common.guest": "Guest Mode",
    "common.level": "Level",
    "comments.title": "Discussion & Comments",
    "comments.placeholder": "Share your thoughts or variations for this prompt...",
    "comments.submit": "Post Comment",
  },
  "zh-Hans": {
    "hero.slogan": "方便中文使用 ChatGPT 快捷指令，高效提升生产力",
    "hero.supportedAiTools": "ChatGPT · Claude · Midjourney · Gemini · Copilot 等",
    "nav.allPrompts": "精选指令",
    "nav.community": "社区分享",
    "nav.mySpace": "我的空间",
    "nav.docs": "使用文档",
    "search.placeholder": "搜索提示词标题、说明或关键词...",
    "search.filters": "分类标签",
    "search.totalCount": "共 {count} 条提示词",
    "action.copy": "复制",
    "action.copied": "已复制到剪贴板！",
    "action.copyPrompt": "复制提示词",
    "action.addPrompt": "添加提示词",
    "action.edit": "编辑",
    "action.delete": "删除",
    "action.favorite": "收藏",
    "action.removeFavorite": "取消收藏",
    "action.viewDetails": "详情",
    "action.close": "关闭",
    "action.save": "保存",
    "action.cancel": "取消",
    "action.clearFilters": "清空筛选 ({count})",
    "prompt.private": "私密",
    "prompt.placeholders": "变量快速填充",
    "prompt.original": "提示词内容",
    "prompt.stats.chars": "字符数",
    "prompt.stats.tokens": "预估 Token",
    "prompt.related": "相关推荐",
    "prompt.faq": "使用技巧与 FAQ",
    "myspace.title": "我的空间",
    "myspace.favorites": "我的收藏",
    "myspace.customPrompts": "我的指令",
    "myspace.empty": "暂无保存的提示词，可在列表中收藏或点击右上角创建！",
    "myspace.tags": "标签管理",
    "myspace.export": "导出数据",
    "myspace.import": "导入数据",
    "common.favorites": "收藏",
    "common.all": "全部",
    "common.theme": "主题模式",
    "common.language": "语言",
    "common.signin": "登录",
    "common.guest": "访客模式",
    "common.level": "等级",
    "comments.title": "讨论与评论",
    "comments.placeholder": "分享你的测试结果或提示词变体...",
    "comments.submit": "发表评论",
  },
};

interface I18nContextType {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (id: string, defaultMessage?: string, values?: Record<string, any>) => string;
}

export const I18nContext = createContext<I18nContextType>({
  currentLanguage: "zh-Hans",
  setLanguage: () => {},
  t: (_id, defaultMessage) => defaultMessage || _id,
});

let currentGlobalLanguage: LanguageCode = "zh-Hans";

export function translate({ id, message, values }: { id: string; message?: string; values?: Record<string, any> }): string {
  const lang = currentGlobalLanguage;
  let text = COMMON_STRINGS[lang]?.[id] || COMMON_STRINGS["en"]?.[id] || message || id;
  if (values) {
    Object.entries(values).forEach(([k, v]) => {
      text = text.replaceAll(`{${k}}`, String(v));
    });
  }
  return text;
}

export const Translate: React.FC<{
  id?: string;
  children?: ReactNode;
  values?: Record<string, any>;
}> = ({ id, children, values }) => {
  const { t } = useContext(I18nContext);
  const defaultText = typeof children === "string" ? children : "";
  const translated = id ? t(id, defaultText, values) : defaultText;
  return <>{translated || children}</>;
};

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem("aishort_lang") as LanguageCode;
      if (saved && LANGUAGES.some((l) => l.code === saved)) {
        return saved;
      }
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith("zh")) return "zh-Hans";
      if (browserLang.startsWith("ja")) return "ja";
      if (browserLang.startsWith("ko")) return "ko";
      if (browserLang.startsWith("es")) return "es";
      return "en";
    } catch {
      return "zh-Hans";
    }
  });

  const setLanguage = (lang: LanguageCode) => {
    setCurrentLanguageState(lang);
    currentGlobalLanguage = lang;
    try {
      localStorage.setItem("aishort_lang", lang);
    } catch {}
  };

  useEffect(() => {
    currentGlobalLanguage = currentLanguage;
    const langInfo = LANGUAGES.find((l) => l.code === currentLanguage);
    document.documentElement.lang = toBcp47(currentLanguage);
    document.documentElement.dir = langInfo?.dir || "ltr";
  }, [currentLanguage]);

  const t = (id: string, defaultMessage?: string, values?: Record<string, any>): string => {
    return translate({ id, message: defaultMessage, values });
  };

  const value = useMemo(
    () => ({
      currentLanguage,
      setLanguage,
      t,
    }),
    [currentLanguage]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useI18n() {
  return useContext(I18nContext);
}
