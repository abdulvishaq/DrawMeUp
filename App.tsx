import React, { useState, useCallback, useRef } from 'react';
import Header from './components/Header';
import ImageViewer from './components/ImageViewer';
import StyleSelector from './components/StyleSelector';
import { generateDrawing, DrawingStyle } from './services/geminiService';
import { fileToBase64, Base64File } from './utils/fileUtils';
import { UploadIcon } from './components/IconComponents';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<Base64File | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationState, setGenerationState] = useState<'idle' | 'drawing'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<DrawingStyle>('Doodle');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLoading = generationState !== 'idle';

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setError(null);
      setGeneratedImage(null);
      try {
        const imageFile = await fileToBase64(file);
        setOriginalImage(imageFile);
      } catch (err) {
        setError('Could not read the selected file. Please try another image.');
        setOriginalImage(null);
      }
    }
  };

  const handleGenerateDrawing = useCallback(async () => {
    if (!originalImage) {
      setError('Please upload an image first.');
      return;
    }

    setGenerationState('drawing');
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateDrawing(originalImage.base64, originalImage.mimeType, selectedStyle);
      setGeneratedImage(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setGenerationState('idle');
    }
  }, [originalImage, selectedStyle]);


  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-6xl mx-auto">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative mb-6 text-center" role="alert">
              <strong className="font-bold">Oops! </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ImageViewer title="Original Photo" imageSrc={originalImage?.dataUrl} onUploadClick={triggerFileUpload} />
            <ImageViewer 
              title="AI Drawing"
              imageSrc={generatedImage}
              isLoading={generationState === 'drawing'}
            />
          </div>
          
          <StyleSelector selectedStyle={selectedStyle} onStyleChange={setSelectedStyle} />

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={triggerFileUpload}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
            >
              <UploadIcon />
              {originalImage ? 'Change Photo' : 'Upload Photo'}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
            />

            <button
              onClick={handleGenerateDrawing}
              disabled={!originalImage || isLoading}
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-indigo-700 disabled:bg-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 disabled:scale-100 flex items-center justify-center gap-3"
            >
              {isLoading && <LoadingSpinner className="w-6 h-6" />}
              {generationState === 'drawing' ? 'Drawing...' : 'DrawMeUp!'}
            </button>
          </div>
        </div>
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>Powered by Gemini API</p>
      </footer>
    </div>
  );
};

export default App;