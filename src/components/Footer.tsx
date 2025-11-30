import React from 'react';
import { Github as GithubIcon, Twitter as TwitterIcon } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">DNA Defect Analyzer</h2>
            <p className="text-gray-300">
              A platform for identifying defects in DNA sequences using advanced analysis techniques.
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Resources</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Documentation</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">API Reference</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Scientific Papers</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Knowledge Base</a></li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Connect</h2>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <GithubIcon />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <TwitterIcon />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} DNA Defect Analyzer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}