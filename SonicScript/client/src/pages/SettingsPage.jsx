// ===========================================
// SettingsPage — Application Settings
// ===========================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiGlobe, HiInformationCircle } from 'react-icons/hi';
import PageTransition from '../components/common/PageTransition';

export default function SettingsPage() {
  const [language, setLanguage] = useState('en-US');

  const languages = [
    { code: 'en-US', label: 'English (US)' },
    { code: 'en-GB', label: 'English (UK)' },
    { code: 'es-ES', label: 'Spanish' },
    { code: 'fr-FR', label: 'French' },
    { code: 'de-DE', label: 'German' },
    { code: 'hi-IN', label: 'Hindi' },
    { code: 'ja-JP', label: 'Japanese' },
    { code: 'zh-CN', label: 'Chinese (Simplified)' },
  ];

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-1">
            <span className="gradient-text">Settings</span>
          </h2>
          <p className="text-sm text-sonic-text-dim">
            Configure your SonicScript experience.
          </p>
        </div>

        <div className="space-y-6">
          {/* Language Preference */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 hover:transform-none hover:bg-sonic-card hover:border-sonic-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sonic-accent/20 to-sonic-cyan/20 flex items-center justify-center">
                <HiGlobe className="w-5 h-5 text-sonic-accent-light" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-sonic-text">
                  Language
                </h3>
                <p className="text-xs text-sonic-text-dim">
                  Default language for speech recognition
                </p>
              </div>
            </div>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-sonic-border text-sm text-sonic-text outline-none focus:border-sonic-accent transition-colors cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-sonic-dark">
                  {lang.label}
                </option>
              ))}
            </select>
          </motion.div>

          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 hover:transform-none hover:bg-sonic-card hover:border-sonic-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sonic-pink/20 to-rose-600/20 flex items-center justify-center">
                <HiInformationCircle className="w-5 h-5 text-sonic-pink" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-sonic-text">
                  About SonicScript
                </h3>
                <p className="text-xs text-sonic-text-dim">
                  Version & system information
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-sonic-border/50">
                <span className="text-sonic-text-dim">Version</span>
                <span className="text-sonic-text font-medium">1.0.0</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-sonic-border/50">
                <span className="text-sonic-text-dim">Frontend</span>
                <span className="text-sonic-text font-medium">React + Vite</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-sonic-border/50">
                <span className="text-sonic-text-dim">Backend</span>
                <span className="text-sonic-text font-medium">Node.js + Express</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-sonic-border/50">
                <span className="text-sonic-text-dim">Database</span>
                <span className="text-sonic-text font-medium">MongoDB</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sonic-text-dim">Speech Engine</span>
                <span className="text-sonic-text font-medium">Web Speech API</span>
              </div>
            </div>
          </motion.div>

          {/* Credits */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center py-4"
          >
            <p className="text-xs text-sonic-text-dim">
              Built with ♥ by Advay Sharma • MERN Stack Project
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
