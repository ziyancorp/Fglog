import React, { useState } from 'react';
import { Header } from './components/Header';
import { StoryboardForm } from './components/StoryboardForm';
import { TomkinsTableView } from './components/TomkinsTableView';
import { TinyWorldGridView } from './components/TinyWorldGridView';
import { ParfumVlogView } from './components/ParfumVlogView';
import { TasSekolahGridView } from './components/TasSekolahGridView';
import { ProductLookbookGrid } from './components/ProductLookbookGrid';
import { InteractivePlayer } from './components/InteractivePlayer';
import { ExportModal } from './components/ExportModal';

import {
  TOMKINS_PRESET,
  TINY_WORLD_PRESET,
  PARFUM_VLOG_PRESET,
  TAS_SEKOLAH_PRESET,
  LOOKBOOK_SAMPLE,
} from './data/presets';
import { StoryboardData, LookbookProject, StoryboardStyle, LookbookItem, ModelOption } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'storyboard' | 'lookbook' | 'simulator'>('storyboard');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('tomkins-sepatu-tk');
  const [currentStoryboard, setCurrentStoryboard] = useState<StoryboardData>(TOMKINS_PRESET);
  const [currentLookbook, setCurrentLookbook] = useState<LookbookProject>(LOOKBOOK_SAMPLE);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [loadingSceneNumber, setLoadingSceneNumber] = useState<number | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Switch presets
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    if (presetId === 'tomkins-sepatu-tk') setCurrentStoryboard(TOMKINS_PRESET);
    if (presetId === 'tiny-world-indomaret') setCurrentStoryboard(TINY_WORLD_PRESET);
    if (presetId === 'parfum-hmns-vlog') setCurrentStoryboard(PARFUM_VLOG_PRESET);
    if (presetId === 'tas-sekolah-unboxing') setCurrentStoryboard(TAS_SEKOLAH_PRESET);
  };

  // Generate Storyboard via backend API
  const handleGenerateStoryboard = async (formData: {
    productName: string;
    productCategory: string;
    targetAudience: string;
    duration: string;
    orientation: string;
    style: StoryboardStyle;
    soundFocus: string;
    customPrompt: string;
  }) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success && data.storyboard) {
        setCurrentStoryboard(data.storyboard);
      } else {
        alert(data.error || 'Gagal membuat storyboard dengan AI.');
      }
    } catch (err) {
      console.error('API Error:', err);
      alert('Terjadi kesalahan koneksi saat memanggil server Gemini AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Regenerate Frame Image via backend Gemini Image Gen
  const handleRegenerateFrameImage = async (sceneNumber: number, prompt: string) => {
    setLoadingSceneNumber(sceneNumber);
    try {
      const response = await fetch('/api/generate-scene-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          aspectRatio: currentStoryboard.aspectRatio || '9:16',
        }),
      });

      const data = await response.json();
      if (data.success && data.imageUrl) {
        setCurrentStoryboard((prev) => ({
          ...prev,
          scenes: prev.scenes.map((s) =>
            s.sceneNumber === sceneNumber ? { ...s, imageUrl: data.imageUrl } : s
          ),
          parts: prev.parts?.map((p) => ({
            ...p,
            scenes: p.scenes.map((s) =>
              s.sceneNumber === sceneNumber ? { ...s, imageUrl: data.imageUrl } : s
            ),
          })),
        }));
      }
    } catch (err) {
      console.error('Image gen error:', err);
    } finally {
      setLoadingSceneNumber(null);
    }
  };

  // Generate Lookbook Showcase via backend API
  const handleGenerateLookbook = async (
    items: LookbookItem[],
    model: ModelOption,
    theme: string,
    cameraAngle: string,
    aspectRatio: string
  ) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-lookbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          model,
          theme,
          cameraAngle,
          aspectRatio,
        }),
      });

      const data = await response.json();
      if (data.success && data.lookbook) {
        setCurrentLookbook((prev) => ({
          ...prev,
          title: data.lookbook.title || prev.title,
          shots: data.lookbook.shots || prev.shots,
        }));
      }
    } catch (err) {
      console.error('Lookbook API Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Render Storyboard View matching style
  const renderStoryboardView = () => {
    const style = currentStoryboard.style || 'tomkins_asmr';

    if (style === 'tomkins_asmr') {
      return (
        <TomkinsTableView
          storyboard={currentStoryboard}
          onRegenerateFrameImage={handleRegenerateFrameImage}
          loadingSceneNumber={loadingSceneNumber}
        />
      );
    }

    if (style === 'tiny_world') {
      return (
        <TinyWorldGridView
          storyboard={currentStoryboard}
          onRegenerateFrameImage={handleRegenerateFrameImage}
          loadingSceneNumber={loadingSceneNumber}
        />
      );
    }

    if (style === 'ugc_vlog') {
      return (
        <ParfumVlogView
          storyboard={currentStoryboard}
          onRegenerateFrameImage={handleRegenerateFrameImage}
          loadingSceneNumber={loadingSceneNumber}
        />
      );
    }

    if (style === 'product_feature') {
      return (
        <TasSekolahGridView
          storyboard={currentStoryboard}
          onRegenerateFrameImage={handleRegenerateFrameImage}
          loadingSceneNumber={loadingSceneNumber}
        />
      );
    }

    // Default fallback to Tomkins Table View
    return (
      <TomkinsTableView
        storyboard={currentStoryboard}
        onRegenerateFrameImage={handleRegenerateFrameImage}
        loadingSceneNumber={loadingSceneNumber}
      />
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-black selection:text-white pb-12">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedPresetId={selectedPresetId}
        onSelectPreset={handleSelectPreset}
        onExport={() => setIsExportModalOpen(true)}
        onCopyPrompts={() => setIsExportModalOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {activeTab === 'storyboard' && (
          <>
            {/* Storyboard AI Form */}
            <StoryboardForm
              onGenerate={handleGenerateStoryboard}
              isGenerating={isGenerating}
              onSelectPreset={handleSelectPreset}
            />

            {/* Render Active Storyboard Layout (Replicating exact reference image styles) */}
            {renderStoryboardView()}
          </>
        )}

        {activeTab === 'lookbook' && (
          <ProductLookbookGrid
            lookbook={currentLookbook}
            onGenerateLookbook={handleGenerateLookbook}
            isGenerating={isGenerating}
          />
        )}

        {activeTab === 'simulator' && (
          <InteractivePlayer storyboard={currentStoryboard} />
        )}
      </main>

      {/* Export & Copy Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        storyboard={currentStoryboard}
      />
    </div>
  );
}
