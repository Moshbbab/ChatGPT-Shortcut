import React, { useState } from "react";
import { Modal, Input, Button, Tabs, Progress, message, Popconfirm } from "antd";
import {
  UserOutlined,
  CrownOutlined,
  SafetyOutlined,
  DeleteOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ open, onClose }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("Guest Prompt Engineer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      message.error("Please enter email");
      return;
    }
    setUsername(email.split("@")[0] || "AI User");
    setIsLoggedIn(true);
    message.success("Logged in successfully!");
  };

  const handleClearCache = () => {
    localStorage.removeItem("aishort_user_favorites");
    message.success("Cache cleared! Reloading...");
    setTimeout(() => window.location.reload(), 800);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={480}
      centered
      title={
        <div className="flex items-center gap-2">
          <CrownOutlined className="text-teal-600" />
          <span>User Profile & Level</span>
        </div>
      }
    >
      <div className="py-2 space-y-5">
        {/* User Card */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-950/30 border border-teal-200/60 dark:border-teal-900/60 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            <UserOutlined />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">{username}</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-600 text-white font-mono font-medium">
                LVL 1
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Explorer · 120 / 300 XP to Level 2
            </p>
          </div>
        </div>

        {/* Level Progression */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-500 font-medium">
            <span>Next Rank: Prompt Apprentice</span>
            <span>40%</span>
          </div>
          <Progress percent={40} strokeColor="#0d9488" showInfo={false} />
          <p className="text-[11px] text-slate-400">
            Earn XP by saving prompts, creating custom shortcuts, and sharing community contributions.
          </p>
        </div>

        {/* Tabs for Account / Security */}
        <Tabs
          defaultActiveKey="account"
          items={[
            {
              key: "account",
              label: "Account Status",
              children: (
                <div className="space-y-3 pt-1 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Mode</span>
                    <span className="font-medium text-teal-600 dark:text-teal-400">
                      Local Offline Mode (Safe & Private)
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Local Storage</span>
                    <span className="font-mono text-emerald-600 flex items-center gap-1">
                      <CheckCircleFilled /> Active & Synced
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Cloud Sync API</span>
                    <span>Strapi Backend (https://api.newzone.top)</span>
                  </div>
                </div>
              ),
            },
            {
              key: "data",
              label: "Data Management",
              children: (
                <div className="space-y-3 pt-1">
                  <p className="text-xs text-slate-500">
                    Manage your cached favorites and browser data:
                  </p>
                  <Popconfirm
                    title="Clear cached favorites?"
                    description="This will reset your favorites to the defaults."
                    onConfirm={handleClearCache}
                    okText="Clear"
                    cancelText="Cancel"
                  >
                    <Button danger icon={<DeleteOutlined />} className="text-xs rounded-lg">
                      Reset Local Favorites Cache
                    </Button>
                  </Popconfirm>
                </div>
              ),
            },
          ]}
        />
      </div>
    </Modal>
  );
};
