import React from 'react';
import { Film, Shirt, Play, Sparkles, Download, Copy, RefreshCw } from 'lucide-react';

interface HeaderProps {
  activeTab: 'storyboard' | 'lookbook' | 'simulator';
  setActiveTab: (tab: 'storyboard' | 'lookbook' | 'simulator') => void;
  selectedPresetId: string;
  onSelectPreset: (id: string) => void;
  onExport: () => void;
  onCopyPrompts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedPresetId,
  onSelectPreset,
  onExport,
  onCopyPrompts,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-200/80 text-zinc-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-16 py-3 sm:py-0 gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shadow-sm shrink-0">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-zinc-900">
                  Storyboard & Lookbook Studio <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 font-semibold border border-zinc-200">AI</span>
                </h1>
              </div>
              <p className="text-xs text-zinc-500">
                Generator Storyboard Video 10s-30s & Product Showcase AI (TikTok / Reels / Shorts)
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Sleek Interface Pills */}
          <div className="flex items-center bg-zinc-100/80 p-1 rounded-full border border-zinc-200 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('storyboard')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                activeTab === 'storyboard'
                  ? 'bg-black text-white shadow-sm font-bold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              Video Storyboard
            </button>
            <button
              onClick={() => setActiveTab('lookbook')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                activeTab === 'lookbook'
                  ? 'bg-black text-white shadow-sm font-bold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
              }`}
            >
              <Shirt className="w-3.5 h-3.5" />
              Product Lookbook
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-black text-white shadow-sm font-bold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              Simulasi Video 10s
            </button>
          </div>

          {/* Actions & Presets */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-1.5">
              <span className="text-xs text-zinc-500 font-medium">Preset:</span>
              <select
                value={selectedPresetId}
                onChange={(e) => onSelectPreset(e.target.value)}
                className="bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-800 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
              >
                <option value="tomkins-sepatu-tk">👟 Tomkins Sepatu (ASMR Table)</option>
                <option value="tiny-world-indomaret">🏗️ Tiny World Indomaret (Grid)</option>
                <option value="parfum-hmns-vlog">✨ Parfum HMNS Alpha (UGC Vlog)</option>
                <option value="tas-sekolah-unboxing">🎒 Tas Sekolah (10 Frame)</option>
              </select>
            </div>

            <button
              onClick={onCopyPrompts}
              className="flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-xs font-semibold text-zinc-800 px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
              title="Salin Prompt Video AI (Veo / Sora / Kling)"
            >
              <Copy className="w-3.5 h-3.5 text-zinc-700" />
              <span className="hidden sm:inline">Copy Prompt AI</span>
            </button>

            <button
              onClick={onExport}
              className="flex items-center gap-1.5 bg-black hover:bg-zinc-800 text-xs font-semibold text-white px-4 py-1.5 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF / Image</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
