import React from 'react';
import { StoryboardData } from '../types';
import { Volume2, Play, Camera, Film, Sparkles, AlertCircle } from 'lucide-react';
import { soundSynth } from '../utils/audioSynth';

interface TomkinsTableViewProps {
  storyboard: StoryboardData;
  onRegenerateFrameImage?: (sceneNumber: number, prompt: string) => void;
  loadingSceneNumber?: number | null;
}

export const TomkinsTableView: React.FC<TomkinsTableViewProps> = ({
  storyboard,
  onRegenerateFrameImage,
  loadingSceneNumber,
}) => {
  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-sm text-zinc-900 my-4">
      {/* Top Header Banner matching Sleek Interface Theme */}
      <div className="bg-zinc-50 p-6 border-b border-zinc-200/80">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider mb-2">
              <Film className="w-3.5 h-3.5 text-white" />
              {storyboard.title || 'STORYBOARD VIDEO 10 DETIK'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight uppercase">
              {storyboard.productName || 'TOMKINS SEPATU ANAK TK'}
            </h1>
            <p className="text-sm text-zinc-500 font-medium mt-1">
              {storyboard.subtitle || 'Ringan, Nyaman, Stylish - Siap Setiap Langkah'}
            </p>
          </div>

          {/* Top Meta Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto text-xs">
            <div className="bg-white border border-zinc-200 rounded-xl p-3 flex items-center gap-2.5 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-800 flex items-center justify-center font-bold">
                ⏱️
              </div>
              <div>
                <div className="text-[10px] text-zinc-400 uppercase font-bold">DURASI TOTAL</div>
                <div className="font-bold text-zinc-900">{storyboard.durationTotal || '10 DETIK'}</div>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-3 flex items-center gap-2.5 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-800 flex items-center justify-center font-bold">
                📱
              </div>
              <div>
                <div className="text-[10px] text-zinc-400 uppercase font-bold">ORIENTASI</div>
                <div className="font-bold text-zinc-900">{storyboard.orientation || '9:16 (VERTICAL)'}</div>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-3 flex items-center gap-2.5 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-800 flex items-center justify-center font-bold">
                👥
              </div>
              <div>
                <div className="text-[10px] text-zinc-400 uppercase font-bold">TARGET AUDIENCE</div>
                <div className="font-bold text-zinc-900 truncate max-w-[150px]" title={storyboard.targetAudience}>
                  {storyboard.targetAudience || 'Orang tua dengan anak usia 3-6 tahun'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Structure */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-100/80 border-b border-zinc-200 text-zinc-700 uppercase font-bold text-[11px] tracking-wider">
              <th className="py-3 px-4 w-28 text-center">SCENE</th>
              <th className="py-3 px-4 w-28 text-center">DURASI</th>
              <th className="py-3 px-4 w-48 text-center">VISUAL PREVIEW</th>
              <th className="py-3 px-4 w-36">TEKS ON-SCREEN</th>
              <th className="py-3 px-4">CATATAN / ARAHAN</th>
              <th className="py-3 px-4 w-44">ASMR FOCUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/80">
            {storyboard.scenes.map((scene, idx) => (
              <tr
                key={scene.sceneNumber || idx}
                className="hover:bg-zinc-50/80 transition-colors group"
              >
                {/* 1. SCENE */}
                <td className="py-3 px-4 text-center font-bold">
                  <div className="text-xl font-black text-zinc-900">{scene.sceneNumber}</div>
                  <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mt-0.5">
                    {scene.title}
                  </div>
                </td>

                {/* 2. DURASI */}
                <td className="py-3 px-4 text-center">
                  <div className="font-mono text-xs text-zinc-900 font-bold bg-zinc-100 px-2 py-1 rounded border border-zinc-200 inline-block">
                    {scene.timestamp}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-medium mt-1">({scene.durationSeconds || 1} DETIK)</div>
                </td>

                {/* 3. VISUAL PREVIEW */}
                <td className="py-3 px-4 text-center">
                  <div className="relative group/img aspect-[4/3] rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm max-w-[180px] mx-auto">
                    {scene.imageUrl ? (
                      <img
                        src={scene.imageUrl}
                        alt={scene.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-2 text-zinc-400 text-[10px]">
                        <Camera className="w-5 h-5 mb-1 text-zinc-400" />
                        <span>Visual Frame</span>
                      </div>
                    )}

                    {onRegenerateFrameImage && (
                      <button
                        onClick={() => onRegenerateFrameImage(scene.sceneNumber, scene.visualPrompt || scene.visualDescription)}
                        disabled={loadingSceneNumber === scene.sceneNumber}
                        className="absolute inset-0 bg-black/80 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-xs font-semibold text-white p-2 cursor-pointer"
                        title="Regenerate image frame with AI"
                      >
                        <Sparkles className={`w-4 h-4 ${loadingSceneNumber === scene.sceneNumber ? 'animate-spin' : ''}`} />
                        <span>{loadingSceneNumber === scene.sceneNumber ? 'Generating...' : 'AI Frame'}</span>
                      </button>
                    )}
                  </div>
                </td>

                {/* 4. TEKS ON-SCREEN */}
                <td className="py-3 px-4 font-mono text-zinc-800">
                  {scene.textOnScreen && scene.textOnScreen !== '-' ? (
                    <span className="bg-black text-white border border-black px-2 py-1 rounded-md text-[11px] font-bold block shadow-xs">
                      "{scene.textOnScreen}"
                    </span>
                  ) : (
                    <span className="text-zinc-400 text-[11px]">-</span>
                  )}
                </td>

                {/* 5. CATATAN / ARAHAN */}
                <td className="py-3 px-4 text-zinc-800">
                  <div className="font-semibold text-xs text-zinc-900">{scene.cameraDirection || scene.visualDescription}</div>
                  {scene.microAction && (
                    <div className="text-[11px] text-zinc-500 mt-1 italic font-medium">
                      🎯 Micro-action: {scene.microAction}
                    </div>
                  )}
                </td>

                {/* 6. ASMR FOCUS */}
                <td className="py-3 px-4">
                  <button
                    onClick={() => soundSynth.playSoundFromDescription(scene.soundDirection || '')}
                    className="w-full flex items-center justify-between gap-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200 rounded-xl px-3 py-1.5 transition-all cursor-pointer group/sound font-medium"
                    title="Klik untuk mendengarkan simulasi audio ASMR"
                  >
                    <span className="text-[11px] font-semibold truncate text-left">
                      {scene.soundDirection || 'Suara natural'}
                    </span>
                    <Volume2 className="w-3.5 h-3.5 text-zinc-700 shrink-0 group-hover/sound:scale-110 transition-transform" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Summary Cards Section */}
      <div className="p-6 bg-zinc-50 border-t border-zinc-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* KONTINUITAS VISUAL */}
          <div className="bg-white border border-zinc-200 rounded-xl p-4 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-zinc-900 font-extrabold uppercase text-[11px] tracking-wider border-b border-zinc-100 pb-2">
              <AlertCircle className="w-4 h-4 text-zinc-900" />
              Kontinuitas Visual (Wajib Diikuti)
            </div>
            <ul className="space-y-1.5 text-zinc-700 text-[11px] font-medium">
              {(storyboard.continuityRules || [
                'Sepatu selalu sama (model, warna, detail).',
                'Latar belakang bersih & tone natural hangat.',
                'Pencahayaan konsisten (natural daylight).',
                'Gaya kamera: cinematic, close-up & macro.',
              ]).map((rule, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-zinc-900 font-bold">✓</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* TRANSISI ANTAR SCENE */}
          <div className="bg-white border border-zinc-200 rounded-xl p-4 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-zinc-900 font-extrabold uppercase text-[11px] tracking-wider border-b border-zinc-100 pb-2">
              <Film className="w-4 h-4 text-zinc-900" />
              Transisi Antar Scene
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] text-zinc-700">
              {(storyboard.transitions || [
                '1 → 2 : Cut',
                '2 → 3 : Cut',
                '3 → 4 : Cut',
                '4 → 5 : Cut',
                '5 → 6 : Quick Orbit',
                '6 → 7 : Cut',
                '7 → 8 : Cut',
                '8 → 9 : Match Cut',
                '9 → 10 : Cut + Slight Push',
              ]).map((trans, idx) => (
                <div key={idx} className="bg-zinc-50 px-2 py-1 rounded-md border border-zinc-200 font-mono text-[10px] font-semibold text-zinc-800">
                  {trans}
                </div>
              ))}
            </div>
          </div>

          {/* ASMR DETAIL & CATATAN PRODUKSI */}
          <div className="bg-white border border-zinc-200 rounded-xl p-4 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-zinc-900 font-extrabold uppercase text-[11px] tracking-wider border-b border-zinc-100 pb-2">
              <Volume2 className="w-4 h-4 text-zinc-900" />
              ASMR Detail & Specs
            </div>
            <ul className="space-y-1 text-zinc-700 text-[11px] font-medium">
              {(storyboard.asmrDetails || [
                'Box disentuh & dibuka',
                'Kertas pembungkus kresek',
                'Velcro dibuka & direkatkan',
                'Langkah kaki di lantai kayu',
              ]).map((asmr, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                  <span>{asmr}</span>
                </li>
              ))}
            </ul>
            {storyboard.finalVisual && (
              <div className="mt-3 pt-2 border-t border-zinc-100 text-[11px] text-zinc-500 italic">
                🎬 {storyboard.finalVisual}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
