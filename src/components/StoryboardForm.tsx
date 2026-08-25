import React, { useState } from 'react';
import { Sparkles, Video, Volume2, Clock, Smartphone, Target, Layers, Image as ImageIcon } from 'lucide-react';
import { StoryboardStyle, AspectRatio } from '../types';

interface StoryboardFormProps {
  onGenerate: (data: {
    productName: string;
    productCategory: string;
    targetAudience: string;
    duration: string;
    orientation: string;
    style: StoryboardStyle;
    soundFocus: string;
    customPrompt: string;
  }) => void;
  isGenerating: boolean;
  onSelectPreset: (presetId: string) => void;
}

export const StoryboardForm: React.FC<StoryboardFormProps> = ({
  onGenerate,
  isGenerating,
  onSelectPreset,
}) => {
  const [productName, setProductName] = useState('Tomkins Sepatu Anak TK');
  const [productCategory, setProductCategory] = useState('Footwear & Fashion');
  const [targetAudience, setTargetAudience] = useState('Orang tua dengan anak usia 3-6 tahun');
  const [duration, setDuration] = useState('10 DETIK');
  const [orientation, setOrientation] = useState('9:16 (VERTICAL)');
  const [style, setStyle] = useState<StoryboardStyle>('tomkins_asmr');
  const [soundFocus, setSoundFocus] = useState('ASMR Detail (Box, Velcro, Langkah Kaki, Paper)');
  const [customPrompt, setCustomPrompt] = useState('Fokus pada unboxing satisfying, pencahayaan alami, close-up macro detail material.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      productName,
      productCategory,
      targetAudience,
      duration,
      orientation,
      style,
      soundFocus,
      customPrompt,
    });
  };

  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm text-zinc-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-3 border-b border-zinc-100 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-900">Generator Storyboard AI</h2>
            <p className="text-xs text-zinc-500">Buat storyboard video pendek 10-30 detik otomatis</p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-zinc-500 font-medium hidden md:inline">Contoh Template:</span>
          <button
            type="button"
            onClick={() => {
              onSelectPreset('tomkins-sepatu-tk');
              setStyle('tomkins_asmr');
              setProductName('Tomkins Sepatu Anak TK');
            }}
            className="text-[11px] font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-200 transition-colors cursor-pointer"
          >
            👟 Tomkins
          </button>
          <button
            type="button"
            onClick={() => {
              onSelectPreset('tiny-world-indomaret');
              setStyle('tiny_world');
              setProductName('Miniatur Indomaret Kit');
            }}
            className="text-[11px] font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-200 transition-colors cursor-pointer"
          >
            🏗️ Tiny World
          </button>
          <button
            type="button"
            onClick={() => {
              onSelectPreset('parfum-hmns-vlog');
              setStyle('ugc_vlog');
              setProductName('HMNS Alpha Parfum');
            }}
            className="text-[11px] font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-200 transition-colors cursor-pointer"
          >
            ✨ UGC Vlog
          </button>
          <button
            type="button"
            onClick={() => {
              onSelectPreset('tas-sekolah-unboxing');
              setStyle('product_feature');
              setProductName('Tas Sekolah Cloud Backpack');
            }}
            className="text-[11px] font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-200 transition-colors cursor-pointer"
          >
            🎒 Tas Sekolah
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Product Name */}
          <div>
            <label className="block text-zinc-700 font-medium mb-1">Nama Produk / Topik</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Contoh: Sepatu Tomkins Anak TK"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 font-medium"
              required
            />
          </div>

          {/* Product Category */}
          <div>
            <label className="block text-zinc-700 font-medium mb-1">Kategori Produk</label>
            <input
              type="text"
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              placeholder="Contoh: Footwear, Skincare, Gadget, Mainan"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 font-medium"
            />
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-zinc-700 font-medium mb-1">Target Audience</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Contoh: Orang tua anak 3-6 tahun, Gen Z"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 font-medium"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-zinc-700 font-medium mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-zinc-700" />
              Durasi Total Video
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
            >
              <option value="10 DETIK">10 DETIK (8-10 Scene Sat-Set)</option>
              <option value="15 DETIK">15 DETIK (12-15 Scene Standard)</option>
              <option value="20 DETIK">20 DETIK (2 Part 10s Storytelling)</option>
              <option value="30 DETIK">30 DETIK (Full Review & Demo)</option>
            </select>
          </div>

          {/* Orientation */}
          <div>
            <label className="block text-zinc-700 font-medium mb-1 flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-zinc-700" />
              Orientasi & Rasio
            </label>
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
            >
              <option value="9:16 (VERTICAL)">9:16 Vertical (TikTok, Reels, Shorts)</option>
              <option value="16:9 (HORIZONTAL)">16:9 Landscape (YouTube)</option>
              <option value="1:1 (SQUARE)">1:1 Square (Instagram Feed)</option>
            </select>
          </div>

          {/* Visual Style Preset */}
          <div>
            <label className="block text-zinc-700 font-medium mb-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-zinc-700" />
              Gaya Storyboard Layout
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as StoryboardStyle)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
            >
              <option value="tomkins_asmr">Table View (Tomkins ASMR Unboxing)</option>
              <option value="tiny_world">Grid View (Tiny World Diorama)</option>
              <option value="ugc_vlog">Dual-Part Vlog (Parfum UGC Subtitle)</option>
              <option value="product_feature">10-Frame Grid (Tas Sekolah Unboxing)</option>
              <option value="custom">Custom AI Generated Storyboard</option>
            </select>
          </div>
        </div>

        {/* Sound Focus & Custom Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-zinc-700 font-medium mb-1 flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-zinc-700" />
              Fokus Suara / ASMR / SFX
            </label>
            <input
              type="text"
              value={soundFocus}
              onChange={(e) => setSoundFocus(e.target.value)}
              placeholder="Contoh: Suara box, velcro, kertas, langkah kaki, tanpa voiceover"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-zinc-700 font-medium mb-1">Catatan / Arahan Kreatif Tambahan</label>
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Contoh: Pencahayaan sore, nada santai, fokus ke detail jahitan..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 font-medium"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isGenerating}
            className="flex items-center gap-2 bg-black hover:bg-zinc-800 text-white font-bold text-xs px-6 py-2.5 rounded-full shadow-sm disabled:opacity-50 transition-all cursor-pointer"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Memproses Storyboard dengan AI...' : 'Hasilkan Storyboard Video AI'}
          </button>
        </div>
      </form>
    </div>
  );
};
