import React, { useState } from 'react';
import { LookbookProject, LookbookItem, ModelOption } from '../types';
import { Upload, Sparkles, Download, Maximize2, RefreshCw, Shirt, Image as ImageIcon, Camera, Check } from 'lucide-react';

interface ProductLookbookGridProps {
  lookbook: LookbookProject;
  onGenerateLookbook: (items: LookbookItem[], model: ModelOption, theme: string, cameraAngle: string, aspectRatio: string) => void;
  isGenerating: boolean;
}

export const ProductLookbookGrid: React.FC<ProductLookbookGridProps> = ({
  lookbook,
  onGenerateLookbook,
  isGenerating,
}) => {
  const [selectedTheme, setSelectedTheme] = useState(lookbook.theme || 'Original Bedroom Daylight');
  const [selectedRatio, setSelectedRatio] = useState(lookbook.aspectRatio || '9:16');
  const [selectedAngle, setSelectedAngle] = useState(lookbook.cameraAngle || 'Medium Shot');
  const [selectedModelType, setSelectedModelType] = useState<'generate' | 'upload'>('upload');
  const [activeShotModal, setActiveShotModal] = useState<string | null>(null);

  const [items, setItems] = useState<LookbookItem[]>(lookbook.items);

  const handleGenerate = () => {
    onGenerateLookbook(items, lookbook.model, selectedTheme, selectedAngle, selectedRatio);
  };

  return (
    <div className="my-4 grid grid-cols-1 lg:grid-cols-12 gap-6 text-zinc-900">
      {/* Left Pane: 3 Steps Controls */}
      <div className="lg:col-span-4 bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm space-y-6 text-xs">
        {/* STEP 1: Upload Your Lookbook Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <h3 className="font-bold text-zinc-900 uppercase text-xs tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-black text-white font-black text-[11px] flex items-center justify-center">1</span>
              STEP 1: Upload Your Lookbook Items
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="relative aspect-square rounded-xl bg-zinc-50 border border-zinc-200 p-1 flex flex-col items-center justify-center text-center overflow-hidden group"
              >
                <img src={item.imageUrl} alt={item.label} className="w-full h-full object-cover rounded-lg" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity p-1 flex flex-col justify-center items-center text-[10px] text-white">
                  <span className="font-bold truncate w-full">{item.label}</span>
                </div>
              </div>
            ))}

            {/* Empty Slots */}
            {['Outerwear', 'Gaun', 'Tas', 'Headwear'].slice(0, 6 - items.length).map((categoryName, idx) => (
              <label
                key={idx}
                className="aspect-square rounded-xl border-2 border-dashed border-zinc-200 hover:border-zinc-900 bg-zinc-50/50 flex flex-col items-center justify-center text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer p-1 text-center font-medium"
              >
                <Upload className="w-4 h-4 mb-1 text-zinc-400" />
                <span className="text-[10px]">Upload {categoryName}</span>
              </label>
            ))}
          </div>
        </div>

        {/* STEP 2: Add a Model */}
        <div className="space-y-3 border-t border-zinc-100 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-zinc-900 uppercase text-xs tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-black text-white font-black text-[11px] flex items-center justify-center">2</span>
              STEP 2: Add a Model
            </h3>
          </div>

          {/* Toggle Generate vs Upload */}
          <div className="grid grid-cols-2 gap-2 bg-zinc-100/80 p-1 rounded-xl border border-zinc-200">
            <button
              onClick={() => setSelectedModelType('generate')}
              className={`py-1.5 px-3 rounded-lg font-bold transition-all cursor-pointer ${
                selectedModelType === 'generate' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Generate Model
            </button>
            <button
              onClick={() => setSelectedModelType('upload')}
              className={`py-1.5 px-3 rounded-lg font-bold transition-all cursor-pointer ${
                selectedModelType === 'upload' ? 'bg-black text-white shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Upload Model
            </button>
          </div>

          {/* Selected Model Card */}
          <div className="flex items-center gap-3 bg-zinc-50 p-2.5 rounded-xl border border-zinc-200">
            <img
              src={lookbook.model.imageUrl}
              alt={lookbook.model.name}
              className="w-14 h-16 object-cover rounded-lg border border-zinc-200"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-zinc-900 text-xs truncate">{lookbook.model.name}</div>
              <p className="text-[10px] text-zinc-500 line-clamp-2 mt-0.5 font-medium">{lookbook.model.description}</p>
            </div>
          </div>
        </div>

        {/* STEP 3: Customize Your Shot */}
        <div className="space-y-3 border-t border-zinc-100 pt-4">
          <h3 className="font-bold text-zinc-900 uppercase text-xs tracking-wider flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-black text-white font-black text-[11px] flex items-center justify-center">3</span>
            STEP 3: Customize Your Shot
          </h3>

          <div className="space-y-2.5">
            <div>
              <label className="block text-zinc-700 text-[11px] font-semibold mb-1">Photoshoot Theme</label>
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
              >
                <option value="Original Bedroom Daylight">Original (Bedroom Daylight)</option>
                <option value="Minimalist Studio White">Minimalist Studio (White Background)</option>
                <option value="Urban Outdoor Streetwear">Urban Outdoor / Streetwear</option>
                <option value="Warm Sunset Cafe">Warm Sunset Cafe</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-700 text-[11px] font-semibold mb-1">Aspect Ratio</label>
              <select
                value={selectedRatio}
                onChange={(e) => setSelectedRatio(e.target.value as any)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
              >
                <option value="9:16">9:16 (Story / TikTok)</option>
                <option value="1:1">1:1 (Square Feed)</option>
                <option value="4:5">4:5 (Instagram Portrait)</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-700 text-[11px] font-semibold mb-1">Camera Angle</label>
              <select
                value={selectedAngle}
                onChange={(e) => setSelectedAngle(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
              >
                <option value="Medium Shot">Medium Shot</option>
                <option value="Full Body">Full Body</option>
                <option value="Close-up Macro">Close-up Macro Detail</option>
                <option value="Low Angle">Low Angle</option>
              </select>
            </div>
          </div>
        </div>

        {/* Generate Showcase Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-3 bg-black hover:bg-zinc-800 text-white font-bold text-xs rounded-full shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Generating Showcase...' : 'Generate Showcase'}</span>
        </button>
      </div>

      {/* Right Pane: Showcase Grid Gallery */}
      <div className="lg:col-span-8 bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
        <div>
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-4">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              Your Product Showcase
            </h2>

            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-xs font-semibold text-zinc-800 px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-zinc-900" />
                <span>Hasilkan 6 Lagi</span>
              </button>

              <button
                onClick={() => alert('Semua foto showcase siap diunduh dalam file ZIP!')}
                className="flex items-center gap-1.5 bg-black hover:bg-zinc-800 text-white text-xs font-bold px-4 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download All</span>
              </button>
            </div>
          </div>

          {/* 6 Grid Showcase Photo Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {lookbook.shots.map((shot) => (
              <div
                key={shot.id}
                className="group relative aspect-[9/16] rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200/80 shadow-xs hover:shadow-md transition-all"
              >
                <img
                  src={shot.imageUrl}
                  alt={shot.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Hover Overlay Controls */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between text-white">
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={() => setActiveShotModal(shot.imageUrl)}
                      className="p-2 rounded-lg bg-zinc-900/80 hover:bg-black text-white transition-colors cursor-pointer"
                      title="Fullscreen preview"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => alert(`Downloaded ${shot.title}`)}
                      className="p-2 rounded-lg bg-zinc-900/80 hover:bg-black text-white transition-colors cursor-pointer"
                      title="Download image"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="font-bold text-xs text-white">{shot.title}</div>
                    <p className="text-[10px] text-zinc-300 line-clamp-2">{shot.pose}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen Image Preview Modal */}
      {activeShotModal && (
        <div
          onClick={() => setActiveShotModal(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-lg max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
            <img src={activeShotModal} alt="Preview" className="w-full h-full object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};
