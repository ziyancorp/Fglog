import React, { useState } from 'react';
import { StoryboardData } from '../types';
import { X, Copy, Check, Printer, FileText, Sparkles, Download } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyboard: StoryboardData;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, storyboard }) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'json' | 'print'>('prompt');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const scenes = storyboard.scenes.length > 0 ? storyboard.scenes : (storyboard.parts?.[0]?.scenes || []);

  const formattedPrompts = scenes
    .map(
      (s) =>
        `Scene ${s.sceneNumber} (${s.timestamp}): [Camera: ${s.cameraDirection || 'Close up'}] - ${
          s.visualPrompt || s.visualDescription
        } --ar 9:16`
    )
    .join('\n\n');

  const jsonString = JSON.stringify(storyboard, null, 2);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-zinc-200/80 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl text-zinc-900 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-zinc-900" />
            <h2 className="text-base font-bold text-zinc-900">Export & Salin Storyboard</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Subtabs */}
        <div className="flex items-center gap-2 bg-zinc-50 px-4 py-2 border-b border-zinc-200 text-xs">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
              activeTab === 'prompt' ? 'bg-black text-white shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Salin Prompt Video AI (Veo / Sora / Kling)
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
              activeTab === 'json' ? 'bg-black text-white shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Format JSON
          </button>

          <button
            onClick={() => setActiveTab('print')}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
              activeTab === 'print' ? 'bg-black text-white shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Cetak PDF / Printable
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto flex-1 text-xs">
          {activeTab === 'prompt' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-zinc-600 font-medium">
                <span>Prompt video generasi AI siap pakai per scene:</span>
                <button
                  onClick={() => handleCopy(formattedPrompts)}
                  className="flex items-center gap-1.5 bg-black text-white px-3 py-1.5 rounded-lg hover:bg-zinc-800 font-bold cursor-pointer transition-colors shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin Semua Prompt'}</span>
                </button>
              </div>

              <textarea
                value={formattedPrompts}
                readOnly
                rows={12}
                className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl p-3 text-zinc-900 font-mono text-xs focus:outline-none"
              />
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-zinc-600 font-medium">
                <span>Data mentah storyboard JSON:</span>
                <button
                  onClick={() => handleCopy(jsonString)}
                  className="flex items-center gap-1.5 bg-black text-white px-3 py-1.5 rounded-lg hover:bg-zinc-800 font-bold cursor-pointer transition-colors shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin JSON'}</span>
                </button>
              </div>

              <pre className="bg-zinc-50 border border-zinc-200/80 rounded-xl p-3 text-zinc-800 font-mono text-[11px] overflow-x-auto max-h-[350px]">
                {jsonString}
              </pre>
            </div>
          )}

          {activeTab === 'print' && (
            <div className="space-y-4 text-center py-6">
              <Printer className="w-12 h-12 text-zinc-900 mx-auto" />
              <div>
                <h3 className="font-bold text-zinc-900 text-sm">Siap Cetak atau Simpan sebagai PDF</h3>
                <p className="text-zinc-500 text-xs mt-1 font-medium">
                  Format storyboard yang sedang Anda lihat sudah dioptimalkan untuk dicetak dalam ukuran A4 / Letter.
                </p>
              </div>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 bg-black hover:bg-zinc-800 text-white font-bold px-6 py-2.5 rounded-full shadow-sm cursor-pointer transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Buka Dialog Cetak / Simpan PDF</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
