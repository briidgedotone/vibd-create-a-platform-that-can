import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DNAAnalyzer from '@/components/DNAAnalyzer';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <DNAAnalyzer />
      </main>
      <Footer />
    </div>
  );
}