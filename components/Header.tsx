import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 md:px-8 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center gap-3">
        <h1 className="text-4xl md:text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600 select-none">
          DRAWMEUP
        </h1>
        <p className="text-center text-gray-400">Turn your photos into AI-powered drawings instantly.</p>
      </div>
    </header>
  );
};

export default Header;