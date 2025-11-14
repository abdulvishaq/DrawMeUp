import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { ImageIcon, DownloadIcon } from './IconComponents';

interface ResultViewerProps {
  title: string;
  media: { src: string; type: 'image' | 'video' } | null;
  generationState: 'idle' | 'drawing' | 'animating';
  videoProgressMessage?: string;
}

const drawingLoadingMessages = [
  'Warming up the digital brushes...',
  'Mixing the AI\'s color palette...',
  'Sketching the initial outlines...',
  'Adding artistic flourishes...',
  'Putting on the finishing touches...',
];

const animatingLoadingMessages = [
  'Warming up the digital projector...',
  'Rendering the first few frames...',
  'This can take a few minutes...',
  'Adding motion and magic...',
  'Almost ready for the premiere!'
];

const ResultViewer: React.FC<ResultViewerProps> = ({ title, media, generationState, videoProgressMessage }) => {
  const [loadingMessage, setLoadingMessage] = useState(drawingLoadingMessages[0]);
  const isLoading = generationState !== 'idle';

  useEffect(() => {
    if (isLoading) {
      const messages = generationState === 'animating' ? animatingLoadingMessages : drawingLoadingMessages;
      let currentIndex = 0;
      setLoadingMessage(messages[currentIndex]);

      const interval = setInterval(() => {
        currentIndex = (currentIndex + 1) % messages.length;
        setLoadingMessage(messages[currentIndex]);
      }, 2500);

      return () => clearInterval(interval);
    }
  }, [generationState]);

  const handleDownload = () => {
    if (!media) return;
    const link = document.createElement('a');
    link.href = media.src;
    
    if (media.type === 'video') {
        link.download = `DrawMeUp-animation.mp4`;
    } else {
        const mimeType = media.src.split(';')[0].split(':')[1];
        const extension = mimeType.split('/')[1] || 'png';
        link.download = `DrawMeUp-creation.${extension}`;
    }

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const effectiveLoadingMessage = generationState === 'animating' && videoProgressMessage ? videoProgressMessage : loadingMessage;

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold text-gray-300 mb-4">{title}</h2>
      <div className="relative w-full aspect-square bg-gray-800 rounded-2xl shadow-lg overflow-hidden border-2 border-dashed border-gray-700 flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center text-gray-400 p-4">
            <LoadingSpinner className="h-16 w-16" />
            <p className="mt-4 text-lg font-medium text-center">{effectiveLoadingMessage}</p>
          </div>
        ) : media ? (
          <>
            {media.type === 'video' ? (
                <video src={media.src} controls autoPlay loop className="w-full h-full object-contain bg-black" />
            ) : (
                <img src={media.src} alt={title} className="w-full h-full object-contain" />
            )}
            <button
              onClick={handleDownload}
              className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-gray-900/70 text-white rounded-lg backdrop-blur-sm hover:bg-gray-900 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
              aria-label="Download generated content"
            >
              <DownloadIcon className="w-5 h-5" />
              <span>Download</span>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center p-8 text-center text-gray-500">
            <ImageIcon />
            <p className="mt-4 font-semibold text-lg">Your creation will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultViewer;
