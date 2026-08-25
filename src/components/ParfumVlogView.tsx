import React from 'react';
import { StoryboardData } from '../types';
import { Volume2, Sparkles, MessageSquareQuote, Smartphone, Camera } from 'lucide-react';
import { soundSynth } from '../utils/audioSynth';

interface ParfumVlogViewProps {
  storyboard: StoryboardData;
  onRegenerateFrameImage?: (sceneNumber: number, prompt: string) => void;
  loadingSceneNumber?: number | null;
}

export const ParfumVlogView: React.FC<ParfumVlogViewProps> = ({
  storyboard,
  onRegenerateFrameImage,
  loadingSceneNumber,
}) => {
  const parts = storyboard.parts || [
    {
      partNumber: 1,
      partTitle: 'PART 1 (10 DETIK) - parfum yang bikin suasana lebih tenang',
      scenes: storyboard.scenes.slice(0, 4),
    },
    {
      partNumber: 2,
      partTitle: 'PART 2 (10 DETIK) - sekarang gue spill parfumnya',
      scenes: storyboard.scenes.slice(4, 8),
    },
  ];

  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-sm text-zinc-900 my-4">
      {/* Main Header */}
      <div className="p-6 bg-zinc-50 border-b border-zinc-200/80">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider mb-2">
              UGC VLOG STORYBOARD (2 PART)
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight uppercase">
              {storyboard.productName || 'PARFUM HMNS ALPHA'}
            </h1>
            <p className="text-sm text-zinc-500 font-medium mt-1">
              {storyboard.subtitle || 'Spill Parfum Fresh & Calming untuk Daily Routine'}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs bg-white p-3 rounded-xl border border-zinc-200 font-mono shadow-xs">
            <div>
              <span className="text-zinc-400 block text-[10px] font-bold">DURASI TOTAL</span>
              <span className="font-bold text-zinc-900">{storyboard.durationTotal || '20 DETIK'}</span>
            </div>
            <div className="h-6 w-px bg-zinc-200"></div>
            <div>
              <span className="text-zinc-400 block text-[10px] font-bold">RATIO</span>
              <span className="font-bold text-zinc-900">9:16 (REELS / TIKTOK)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Render Parts */}
      <div className="p-6 space-y-8 bg-zinc-50/50">
        {parts.map((part) => (
          <div key={part.partNumber} className="space-y-4">
            {/* Part Header Title */}
            <div className="flex items-center gap-3 border-b border-zinc-200 pb-2">
              <span className="bg-black text-white font-extrabold text-xs px-2.5 py-1 rounded-lg uppercase tracking-wider">
                PART {part.partNumber}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 uppercase tracking-tight">
                {part.partTitle}
              </h2>
            </div>

            {/* 4 Cards Grid per Part */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {part.scenes.map((scene, idx) => (
                <div
                  key={scene.sceneNumber || idx}
                  className="bg-white border border-zinc-200/80 hover:border-zinc-900 rounded-xl overflow-hidden shadow-xs hover:shadow-sm transition-all flex flex-col group"
                >
                  {/* Vertical 9:16 Image Frame */}
                  <div className="relative aspect-[9/16] bg-zinc-100 overflow-hidden border-b border-zinc-200">
                    {scene.imageUrl ? (
                      <img
                        src={scene.imageUrl}
                        alt={scene.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-2 text-zinc-400 text-xs">
                        <Camera className="w-6 h-6 mb-1 text-zinc-400" />
                        <span>Selfie Frame</span>
                      </div>
                    )}

                    {onRegenerateFrameImage && (
                      <button
                        onClick={() => onRegenerateFrameImage(scene.sceneNumber, scene.visualPrompt || scene.visualDescription)}
                        disabled={loadingSceneNumber === scene.sceneNumber}
                        className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-xs font-bold text-white cursor-pointer"
                      >
                        <Sparkles className={`w-5 h-5 ${loadingSceneNumber === scene.sceneNumber ? 'animate-spin' : ''}`} />
                        <span>{loadingSceneNumber === scene.sceneNumber ? 'Generating...' : 'AI Frame'}</span>
                      </button>
                    )}
                  </div>

                  {/* Details Section */}
                  <div className="p-3.5 text-xs space-y-2 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between font-extrabold text-zinc-900 uppercase text-xs border-b border-zinc-100 pb-1">
                        <span>SCENE {scene.sceneNumber}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">({scene.timestamp})</span>
                      </div>

                      <div className="text-[11px] font-bold text-zinc-900">{scene.title}</div>
                      <p className="text-[11px] text-zinc-600 leading-relaxed font-medium">{scene.visualDescription}</p>

                      {/* Dialog Subtitle Box */}
                      {scene.dialogSubtitle && (
                        <div className="mt-2 pt-2 border-t border-zinc-100">
                          <div className="flex items-center justify-between text-[10px] text-zinc-500 font-bold uppercase mb-1">
                            <span className="flex items-center gap-1 text-zinc-900">
                              <MessageSquareQuote className="w-3.5 h-3.5 text-zinc-900" />
                              Dialog / Subtitle:
                            </span>
                            <button
                              onClick={() => soundSynth.speakSubtitle(scene.dialogSubtitle || '')}
                              className="text-[10px] text-zinc-600 hover:text-black font-semibold flex items-center gap-0.5 cursor-pointer"
                              title="Dengarkan Suara TTS Subtitle"
                            >
                              <Volume2 className="w-3 h-3 text-zinc-700" />
                              <span>TTS</span>
                            </button>
                          </div>
                          <p className="font-bold text-zinc-900 text-xs italic bg-zinc-50 p-2 rounded-lg border border-zinc-200">
                            {scene.dialogSubtitle}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Notes Visual Bottom Bar */}
      <div className="p-6 bg-zinc-50 border-t border-zinc-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-[10px] font-extrabold text-zinc-900 uppercase tracking-wider block mb-1">
              NOTES VISUAL:
            </span>
            <ul className="space-y-1 text-zinc-700 text-[11px] font-medium">
              <li>• Tone natural, casual, bukan cinematic berlebihan.</li>
              <li>• Pencahayaan natural (sinar sore warm golden hour).</li>
              <li>• Kamera HP (goyang ringan, focus berubah, framing imperfect).</li>
              <li>• Suasana santai, ambience cafe & sungai.</li>
            </ul>
          </div>

          <div className="flex flex-col justify-center items-center bg-white p-3 rounded-xl border border-zinc-200 shadow-xs">
            <span className="text-[10px] text-zinc-400 uppercase font-bold">DURASI TOTAL</span>
            <span className="text-xl font-black text-zinc-900">{storyboard.durationTotal || '20 DETIK'}</span>
          </div>

          <div className="flex flex-col justify-center items-center bg-white p-3 rounded-xl border border-zinc-200 shadow-xs">
            <span className="text-[10px] text-zinc-400 uppercase font-bold">RATIO FORMAT</span>
            <span className="text-lg font-black text-zinc-900">9:16 (REELS / TIKTOK)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
