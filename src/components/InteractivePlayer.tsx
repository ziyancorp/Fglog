import React, { useState, useEffect, useRef } from 'react';
import { StoryboardData, SceneItem } from '../types';
import { Play, Pause, RotateCcw, Volume2, Sparkles, Film, VolumeX } from 'lucide-react';
import { soundSynth } from '../utils/audioSynth';

interface InteractivePlayerProps {
  storyboard: StoryboardData;
}

export const InteractivePlayer: React.FC<InteractivePlayerProps> = ({ storyboard }) => {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const scenes = storyboard.scenes.length > 0 ? storyboard.scenes : (storyboard.parts?.[0]?.scenes || []);
  const currentScene: SceneItem | undefined = scenes[currentSceneIdx];

  const totalDuration = storyboard.durationSeconds || 10;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentSceneIdx((prev) => {
          const next = prev + 1;
          if (next >= scenes.length) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });
      }, 1000); // 1 second per frame in simulation
    }
    return () => clearInterval(timer);
  }, [isPlaying, scenes.length]);

  // Trigger sound when scene changes during playback
  useEffect(() => {
    if (currentScene && soundEnabled) {
      soundSynth.playSoundFromDescription(currentScene.soundDirection || '');
      if (currentScene.dialogSubtitle) {
        soundSynth.speakSubtitle(currentScene.dialogSubtitle);
      }
    }
  }, [currentSceneIdx, soundEnabled]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentSceneIdx(0);
  };

  if (!currentScene) {
    return <div className="p-4 text-center text-zinc-400 font-medium">Pilih storyboard untuk memutar simulasi video.</div>;
  }

  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm my-4 text-zinc-900 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <h2 className="text-base font-bold text-zinc-900 uppercase tracking-tight">
              Simulasi Player Video 10-Detik (ASMR & Voiceover)
            </h2>
          </div>
          <p className="text-xs text-zinc-500 font-medium mt-0.5">
            {storyboard.productName} • {storyboard.title}
          </p>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            soundEnabled
              ? 'bg-zinc-100 text-zinc-900 border-zinc-300 shadow-xs'
              : 'bg-zinc-50 text-zinc-400 border-zinc-200'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-zinc-900" /> : <VolumeX className="w-4 h-4 text-zinc-400" />}
          <span>{soundEnabled ? 'ASMR Sound Active' : 'Muted'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Phone Preview Canvas */}
        <div className="md:col-span-6 flex justify-center">
          <div className="relative w-64 aspect-[9/16] bg-zinc-950 rounded-3xl overflow-hidden border-4 border-zinc-900 shadow-xl flex flex-col justify-between p-3 group">
            {/* Background Frame Image */}
            <img
              src={currentScene.imageUrl}
              alt={currentScene.title}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
              referrerPolicy="no-referrer"
            />

            {/* Dark Overlay gradient for readable text */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>

            {/* Top Bar inside Phone */}
            <div className="relative z-10 flex items-center justify-between text-white text-[10px] font-mono font-bold">
              <span className="bg-black/80 px-2 py-0.5 rounded border border-white/20">
                SCENE {currentScene.sceneNumber} / {scenes.length}
              </span>
              <span className="bg-white text-black px-2 py-0.5 rounded font-mono font-black">
                {currentScene.timestamp}
              </span>
            </div>

            {/* On-Screen Text / Subtitle Overlay */}
            <div className="relative z-10 space-y-2 text-center my-auto">
              {currentScene.textOnScreen && currentScene.textOnScreen !== '-' && (
                <div className="bg-white/90 text-black font-black text-xs px-3 py-1.5 rounded-lg shadow-lg uppercase tracking-wider inline-block border border-white">
                  {currentScene.textOnScreen}
                </div>
              )}

              {currentScene.dialogSubtitle && (
                <div className="bg-black/85 text-amber-300 font-bold text-xs p-2.5 rounded-xl border border-amber-400/30 shadow-xl backdrop-blur-md">
                  "{currentScene.dialogSubtitle}"
                </div>
              )}
            </div>

            {/* Bottom Audio SFX Badge inside Phone */}
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-1.5 bg-black/80 backdrop-blur-md text-zinc-200 px-3 py-1 rounded-full border border-white/20 text-[10px] font-medium">
                <Volume2 className="w-3 h-3 text-white animate-bounce" />
                <span className="truncate max-w-[180px]">{currentScene.soundDirection || 'ASMR Sound'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Info & Timeline Controls */}
        <div className="md:col-span-6 space-y-5 text-xs">
          <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200/80 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
              <span className="text-zinc-900 font-black text-sm uppercase">
                Scene {currentScene.sceneNumber}: {currentScene.title}
              </span>
              <span className="font-mono text-zinc-500 font-semibold">{currentScene.timestamp}</span>
            </div>

            <div>
              <span className="text-[10px] text-zinc-500 font-extrabold uppercase block">Deskripsi Visual:</span>
              <p className="text-zinc-800 text-xs mt-0.5 leading-relaxed font-medium">{currentScene.visualDescription}</p>
            </div>

            <div>
              <span className="text-[10px] text-zinc-500 font-extrabold uppercase block">Arahan Kamera:</span>
              <p className="text-zinc-900 text-xs font-mono font-semibold mt-0.5">{currentScene.cameraDirection || 'Close up macro'}</p>
            </div>

            <div>
              <span className="text-[10px] text-zinc-500 font-extrabold uppercase block">Fokus Suara ASMR:</span>
              <p className="text-zinc-800 text-xs font-medium mt-0.5">{currentScene.soundDirection || 'Suara natural'}</p>
            </div>
          </div>

          {/* Timeline Scrubber Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-[11px] font-mono text-zinc-500 font-semibold">
              <span>Progres Simulasi Scene</span>
              <span>
                {currentSceneIdx + 1} / {scenes.length}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {scenes.map((sc, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSceneIdx(idx)}
                  className={`h-3 flex-1 rounded-full transition-all cursor-pointer ${
                    idx === currentSceneIdx
                      ? 'bg-black ring-2 ring-zinc-400'
                      : idx < currentSceneIdx
                      ? 'bg-zinc-400'
                      : 'bg-zinc-200 hover:bg-zinc-300'
                  }`}
                  title={`Scene ${sc.sceneNumber}: ${sc.title}`}
                />
              ))}
            </div>
          </div>

          {/* Player Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={togglePlay}
              className="flex-1 py-2.5 bg-black hover:bg-zinc-800 text-white font-bold text-xs rounded-full shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isPlaying ? 'Jeda Simulasi' : 'Putar Simulasi Video'}</span>
            </button>

            <button
              onClick={handleReset}
              className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-full border border-zinc-200 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-zinc-700" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
