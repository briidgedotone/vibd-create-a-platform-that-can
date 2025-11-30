import React from 'react';
import { Dna as DnaIcon, Menu as MenuIcon, X as XIcon } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-primary-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <DnaIcon className="h-6 w-6" />
            <h1 className="text-xl font-bold">DNA Defect Analyzer</h1>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <XIcon /> : <MenuIcon />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="hover:text-primary-100 font-medium">Home</a>
            <a href="#" className="hover:text-primary-100 font-medium">About</a>
            <a href="#" className="hover:text-primary-100 font-medium">Documentation</a>
            <a href="#" className="hover:text-primary-100 font-medium">Contact</a>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="mt-4 flex flex-col space-y-3 md:hidden">
            <a href="#" className="hover:text-primary-100 font-medium">Home</a>
            <a href="#" className="hover:text-primary-100 font-medium">About</a>
            <a href="#" className="hover:text-primary-100 font-medium">Documentation</a>
            <a href="#" className="hover:text-primary-100 font-medium">Contact</a>
          </nav>
        )}
      </div>
    </header>
  );
}