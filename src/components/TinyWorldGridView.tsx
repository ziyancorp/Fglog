import React from 'react';
import { StoryboardData } from '../types';
import { Star, Camera, Volume2, Sparkles, Lightbulb, CheckCircle2 } from 'lucide-react';
import { soundSynth } from '../utils/audioSynth';

interface TinyWorldGridViewProps {
  storyboard: StoryboardData;
  onRegenerateFrameImage?: (sceneNumber: number, prompt: string) => void;
  loadingSceneNumber?: number | null;
}

export const TinyWorldGridView: React.FC<TinyWorldGridViewProps> = ({
  storyboard,
  onRegenerateFrameImage,
  loadingSceneNumber,
}) => {
  const sceneCount = storyboard.scenes.length || 8;
  const ratingStars = storyboard.difficultyRating || 3;

  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-sm text-zinc-900 my-4">
      {/* Top Header Banner */}
      <div className="bg-zinc-50 p-6 border-b border-zinc-200/80 relative">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider mb-2">
              STORYBOARD TINY WORLD
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight uppercase leading-tight">
              {storyboard.productName || 'PEKERJA KONSTRUKSI MINI MEMBANGUN INDOMARET'}
            </h1>
            <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mt-1.5">
              DIBANTU TANGAN MANUSIA • REAL ASMR
            </p>
          </div>

          {/* Right Meta Badges Grid */}
          <div className="bg-white border border-zinc-200 rounded-xl p-4 text-xs space-y-2 w-full lg:w-72 shadow-xs">
            <div className="flex items-center justify-between text-zinc-700">
              <span className="text-[11px] text-zinc-400 uppercase font-bold">DURASI TOTAL:</span>
              <span className="font-mono font-bold text-zinc-900">{storyboard.durationTotal || '10 DETIK'}</span>
            </div>
            <div className="flex items-center justify-between text-zinc-700">
              <span className="text-[11px] text-zinc-400 uppercase font-bold">JUMLAH SCENE:</span>
              <span className="font-bold text-zinc-900">{sceneCount} SCENE</span>
            </div>
            <div className="flex items-center justify-between text-zinc-700">
              <span className="text-[11px] text-zinc-400 uppercase font-bold">PLATFORM:</span>
              <span className="font-bold text-zinc-900">SHORTS / TIKTOK / REELS</span>
            </div>
            <div className="flex items-center justify-between text-zinc-700">
              <span className="text-[11px] text-zinc-400 uppercase font-bold">GENRE:</span>
              <span className="font-bold text-zinc-900">MINIATUR, KONSTRUKSI</span>
            </div>
            <div className="flex items-center justify-between text-zinc-700">
              <span className="text-[11px] text-zinc-400 uppercase font-bold">GAYA VISUAL:</span>
              <span className="font-bold text-zinc-900">REAL ASMR</span>
            </div>
            <div className="flex items-center justify-between text-zinc-700">
              <span className="text-[11px] text-zinc-400 uppercase font-bold">TINGKAT KESULITAN:</span>
              <div className="flex items-center text-black gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${star <= ratingStars ? 'fill-black text-black' : 'text-zinc-300'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Storyboard Scenes */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-zinc-50/50">
        {storyboard.scenes.map((scene, idx) => (
          <div
            key={scene.sceneNumber || idx}
            className="bg-white border border-zinc-200/80 hover:border-zinc-900 rounded-xl overflow-hidden shadow-xs hover:shadow-sm transition-all flex flex-col group"
          >
            {/* Image Preview Container */}
            <div className="relative aspect-[4/3] bg-zinc-100 overflow-hidden border-b border-zinc-200">
              {/* Scene Number Badge */}
              <div className="absolute top-2 left-2 z-10 bg-black text-white font-black text-xs w-7 h-7 rounded-lg flex items-center justify-center shadow-xs">
                {scene.sceneNumber}
              </div>

              {/* Timestamp Badge */}
              <div className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-md text-zinc-900 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-200 shadow-xs">
                {scene.timestamp}
              </div>

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
                  <span>Diorama Frame</span>
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

            {/* Content Details */}
            <div className="p-3.5 text-xs space-y-2 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <h3 className="font-extrabold text-zinc-900 uppercase text-xs tracking-tight line-clamp-1">
                  {scene.title}
                </h3>

                {/* VISUAL */}
                <div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase block">VISUAL:</span>
                  <p className="text-[11px] text-zinc-700 leading-snug line-clamp-2 font-medium">
                    {scene.visualDescription}
                  </p>
                </div>

                {/* CAMERA */}
                <div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase block">CAMERA:</span>
                  <p className="text-[11px] text-zinc-700 leading-snug truncate font-medium">
                    {scene.cameraDirection || 'Close up macro, low angle.'}
                  </p>
                </div>

                {/* SFX */}
                <div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase block">SFX:</span>
                  <button
                    onClick={() => soundSynth.playSoundFromDescription(scene.soundDirection || '')}
                    className="flex items-center gap-1 text-[11px] font-semibold text-zinc-900 hover:text-black transition-colors cursor-pointer text-left w-full truncate"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
                    <span className="truncate">{scene.soundDirection || 'Ketukan kecil'}</span>
                  </button>
                </div>

                {/* MICRO ACTION */}
                {scene.microAction && (
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase block">MICRO ACTION:</span>
                    <p className="text-[11px] text-zinc-700 leading-snug line-clamp-2 font-medium">
                      {scene.microAction}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Creator Tips Banner */}
      <div className="p-6 bg-zinc-50 border-t border-zinc-200">
        <div className="flex items-center gap-2 text-zinc-900 font-extrabold uppercase text-xs mb-3">
          <Lightbulb className="w-4 h-4 text-zinc-900" />
          TIPS CREATOR (UNTUK HASIL MAKSIMAL)
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          {(storyboard.creatorTips || [
            'Gunakan cahaya terang alami untuk hasil maksimal',
            'Perbanyak detail miniatur agar terlihat realistis',
            'Rekam dengan stabilizer / tripod untuk hasil halus',
            'Perbanyak SFX kecil untuk efek ASMR memuaskan',
            'Jaga konsistensi mainan & warna dari awal sampai akhir',
          ]).map((tip, idx) => (
            <div key={idx} className="bg-white p-2.5 rounded-xl border border-zinc-200 text-[11px] text-zinc-800 font-medium flex items-start gap-2 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900 shrink-0 mt-0.5" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
