import React from 'react';
import { StoryboardData } from '../types';
import { Volume2, Sparkles, Camera, Heart, Cloud, Star } from 'lucide-react';
import { soundSynth } from '../utils/audioSynth';

interface TasSekolahGridViewProps {
  storyboard: StoryboardData;
  onRegenerateFrameImage?: (sceneNumber: number, prompt: string) => void;
  loadingSceneNumber?: number | null;
}

export const TasSekolahGridView: React.FC<TasSekolahGridViewProps> = ({
  storyboard,
  onRegenerateFrameImage,
  loadingSceneNumber,
}) => {
  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-sm text-zinc-900 my-4">
      {/* Header Banner */}
      <div className="p-6 bg-zinc-50 border-b border-zinc-200/80 text-center relative">
        <div className="inline-flex items-center gap-2 text-zinc-900 mb-2">
          <Cloud className="w-5 h-5 fill-zinc-900/10 text-zinc-900" />
          <Star className="w-4 h-4 fill-zinc-900/10 text-zinc-900" />
          <Heart className="w-4 h-4 fill-zinc-900/10 text-zinc-900" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight uppercase">
          {storyboard.title || 'STORYBOARD VIDEO - TAS SEKOLAH'}
        </h1>
        <p className="text-xs text-zinc-500 font-medium mt-1">
          {storyboard.productName} • {storyboard.subtitle || '10 Detik Unboxing & Feature Breakdown'}
        </p>

        <div className="mt-4 inline-flex items-center gap-3 bg-white border border-zinc-200 px-4 py-1.5 rounded-full text-xs font-mono font-bold text-zinc-900 shadow-xs">
          <span>DURASI TOTAL: {storyboard.durationTotal || '10 DETIK'}</span>
          <span>|</span>
          <span>RASIO: {storyboard.orientation || '9:16'}</span>
        </div>
      </div>

      {/* 10-Scene Grid */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 bg-zinc-50/50">
        {storyboard.scenes.map((scene, idx) => (
          <div
            key={scene.sceneNumber || idx}
            className="bg-white border border-zinc-200/80 hover:border-zinc-900 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-all flex flex-col group"
          >
            {/* Image Preview with Circle Badge */}
            <div className="relative aspect-[4/3] bg-zinc-100 overflow-hidden border-b border-zinc-200">
              {/* Circle Scene Badge */}
              <div className="absolute top-2 left-2 z-10 w-7 h-7 rounded-full bg-black text-white font-black text-xs flex items-center justify-center border-2 border-white shadow-xs">
                {scene.sceneNumber}
              </div>

              {/* Timestamp Tag */}
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
                  <span>Product Frame</span>
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
            <div className="p-3.5 text-xs space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-zinc-900 uppercase text-xs tracking-tight">
                  {scene.title}
                </h3>
                <p className="text-[11px] text-zinc-600 leading-snug mt-1 font-medium">
                  {scene.visualDescription}
                </p>
              </div>

              {/* Suara SFX tag */}
              <button
                onClick={() => soundSynth.playSoundFromDescription(scene.soundDirection || '')}
                className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[10px] font-semibold text-zinc-700 hover:text-black cursor-pointer w-full text-left"
              >
                <span className="truncate">Suara: {scene.soundDirection || 'suara halus'}</span>
                <Volume2 className="w-3.5 h-3.5 shrink-0 ml-1 text-zinc-800" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
