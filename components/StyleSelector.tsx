import React from 'react';
import { DrawingStyle } from '../services/geminiService';
import { DoodleIcon, PencilIcon, TvIcon, ChibiIcon, PaletteIcon, BrushIcon, ComicIcon, StarIcon } from './IconComponents';

interface StyleSelectorProps {
  selectedStyle: DrawingStyle;
  onStyleChange: (style: DrawingStyle) => void;
}

const styles: { name: DrawingStyle; icon: React.FC<{className?: string}> }[] = [
    { name: 'Doodle', icon: DoodleIcon },
    { name: 'Pencil', icon: PencilIcon },
    { name: 'Cartoon', icon: TvIcon },
    { name: 'Chibi', icon: ChibiIcon },
    { name: 'Watercolor', icon: PaletteIcon },
    { name: 'Oil Painting', icon: BrushIcon },
    { name: 'Comic', icon: ComicIcon },
    { name: 'Anime', icon: StarIcon },
];

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onStyleChange }) => {
  return (
    <div className="my-8">
      <h3 className="text-lg font-semibold text-center text-gray-300 mb-4">Choose a Style</h3>
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {styles.map(({ name, icon: Icon }) => (
          <button
            key={name}
            onClick={() => onStyleChange(name)}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg font-semibold border-2 transition-all duration-200 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 w-28 sm:w-auto
              ${
                selectedStyle === name
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                  : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
              }`}
            aria-pressed={selectedStyle === name}
          >
            <Icon className="w-5 h-5" />
            <span>{name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;
