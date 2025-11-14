import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { ImageIcon, UploadIcon, DownloadIcon } from './IconComponents';

interface ImageViewerProps {
  title: string;
  imageSrc: string | null;
  isLoading?: boolean;
  onUploadClick?: () => void;
}

const loadingMessages = [
  'Warming up the digital brushes...',
  'Mixing the AI\'s color palette...',
  'Sketching the initial outlines...',
  'Adding artistic flourishes...',
  'Putting on the finishing touches...',
];

const ImageViewer: React.FC<ImageViewerProps> = ({ title, imageSrc, isLoading = false, onUploadClick }) => {
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingMessage(prev => {
          const currentIndex = loadingMessages.indexOf(prev);
          const nextIndex = (currentIndex + 1) % loadingMessages.length;
          return loadingMessages[nextIndex];
        });
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleDownload = () => {
    if (!imageSrc) return;
    const link = document.createElement('a');
    link.href = imageSrc;
    const mimeType = imageSrc.split(';')[0].split(':')[1];
    const extension = mimeType.split('/')[1] || 'png';
    link.download = `DrawMeUp-creation.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold text-gray-300 mb-4">{title}</h2>
      <div className="relative w-full aspect-square bg-gray-800 rounded-2xl shadow-lg overflow-hidden border-2 border-dashed border-gray-700 flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center text-gray-400 p-4 text-center">
            <LoadingSpinner className="h-24 w-24" />
            <p className="mt-6 text-xl font-semibold">{loadingMessage}</p>
          </div>
        ) : imageSrc ? (
          <>
            <img src={imageSrc} alt={title} className="w-full h-full object-contain" />
            <button
              onClick={handleDownload}
              className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-gray-900/70 text-white rounded-lg backdrop-blur-sm hover:bg-gray-900 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
              aria-label="Download generated image"
            >
              <DownloadIcon className="w-5 h-5" />
              <span>Download</span>
            </button>
          </>
        ) : (
          <div className="text-center text-gray-500">
            {onUploadClick ? (
               <button onClick={onUploadClick} className="flex flex-col items-center p-8 rounded-lg hover:bg-gray-700/50 transition-colors duration-300">
                <UploadIcon className="w-16 h-16 mb-4" />
                <span className="font-semibold text-lg">Click to Upload Photo</span>
                <span className="text-sm mt-1">PNG, JPG, or WEBP</span>
              </button>
            ) : (
              <div className="flex flex-col items-center p-8">
                <ImageIcon />
                <p className="mt-4 font-semibold text-lg">Your drawing will appear here</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageViewer;