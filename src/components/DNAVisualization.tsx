import React from 'react';
import { DNADefect } from '@/types/dna';

interface DNAVisualizationProps {
  sequence: string;
  defects: DNADefect[];
}

export default function DNAVisualization({ sequence, defects }: DNAVisualizationProps) {
  // Map of defect positions for quick lookup
  const defectMap = new Map<number, DNADefect>();
  defects.forEach(defect => {
    for (let i = defect.position; i < defect.position + defect.length; i++) {
      defectMap.set(i, defect);
    }
  });

  // Split sequence into chunks for visualization
  const chunkSize = 30;
  const chunks = [];
  for (let i = 0; i < sequence.length; i += chunkSize) {
    chunks.push(sequence.slice(i, i + chunkSize));
  }

  // Nucleotide color mapping
  const nucleotideColors = {
    'A': 'text-green-600',
    'T': 'text-red-600',
    'G': 'text-blue-600',
    'C': 'text-yellow-600'
  };
  
  return (
    <div className="overflow-auto">
      <div className="space-y-1 font-mono text-sm">
        {chunks.map((chunk, chunkIndex) => (
          <div key={chunkIndex} className="flex">
            <div className="w-14 text-right pr-2 text-gray-500">
              {chunkIndex * chunkSize + 1}
            </div>
            <div className="flex">
              {Array.from(chunk).map((nucleotide, index) => {
                const position = chunkIndex * chunkSize + index;
                const defect = defectMap.get(position);
                
                return (
                  <span 
                    key={position} 
                    className={`w-7 inline-flex justify-center py-1 font-semibold
                      ${nucleotideColors[nucleotide as keyof typeof nucleotideColors] || 'text-gray-800'}
                      ${defect ? 'bg-red-100 border border-red-200 rounded' : ''}
                    `}
                    title={defect ? `Defect: ${defect.type} (${defect.description})` : ''}
                  >
                    {nucleotide}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex flex-wrap gap-4">
        <div className="flex items-center">
          <span className="w-4 h-4 bg-green-600 rounded mr-2"></span>
          <span>Adenine (A)</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 bg-red-600 rounded mr-2"></span>
          <span>Thymine (T)</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 bg-blue-600 rounded mr-2"></span>
          <span>Guanine (G)</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 bg-yellow-600 rounded mr-2"></span>
          <span>Cytosine (C)</span>
        </div>
        {defects.length > 0 && (
          <div className="flex items-center">
            <span className="w-4 h-4 border border-red-200 bg-red-100 rounded mr-2"></span>
            <span>Defect</span>
          </div>
        )}
      </div>
    </div>
  );
}