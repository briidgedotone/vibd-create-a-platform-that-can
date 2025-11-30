import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PlayCircle as PlayCircleIcon, AlertTriangle as AlertTriangleIcon } from 'lucide-react';
import DNAVisualization from './DNAVisualization';
import DefectTable from './DefectTable';
import { analyzeDNA } from '@/lib/dnaAnalysis';
import { useDNAStore } from '@/store/dnaStore';
import { DNASequence } from '@/types/dna';
import SequenceHistory from './SequenceHistory';

interface FormData {
  sequence: string;
  analysisType: 'basic' | 'comprehensive';
}

export default function DNAAnalyzer() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [loading, setLoading] = useState(false);

  const { 
    addSequence, 
    currentSequence, 
    setCurrentSequence,
    analysisResults 
  } = useDNAStore();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // Simulate API call
      const results = analyzeDNA(data.sequence, data.analysisType);
      
      // Add to store
      const newSequence: DNASequence = {
        id: Date.now().toString(),
        sequence: data.sequence,
        analysisType: data.analysisType,
        timestamp: new Date(),
        results
      };
      
      addSequence(newSequence);
      setCurrentSequence(newSequence);
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">DNA Sequence Analysis</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="sequence" className="block text-sm font-medium text-gray-700 mb-1">
              DNA Sequence
            </label>
            <textarea
              id="sequence"
              rows={5}
              placeholder="Enter DNA sequence (A, T, G, C)..."
              className={`w-full px-3 py-2 border rounded-md ${errors.sequence ? 'border-red-500' : 'border-gray-300'}`}
              {...register('sequence', { 
                required: "DNA sequence is required",
                pattern: {
                  value: /^[ATGC]+$/i,
                  message: "Only A, T, G, C characters are allowed"
                },
                minLength: {
                  value: 10,
                  message: "Sequence must be at least 10 characters"
                }
              })}
            ></textarea>
            {errors.sequence && (
              <p className="mt-1 text-sm text-red-500">{errors.sequence.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Enter a DNA sequence using only A, T, G, C nucleotides (min. 10 characters).
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Analysis Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input 
                  type="radio" 
                  value="basic" 
                  className="mr-2"
                  {...register('analysisType', { required: true })}
                  defaultChecked
                />
                Basic Analysis
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  value="comprehensive" 
                  className="mr-2"
                  {...register('analysisType', { required: true })}
                />
                Comprehensive Analysis
              </label>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            {loading ? (
              <>Analyzing...</>
            ) : (
              <>
                <PlayCircleIcon className="mr-2 h-5 w-5" />
                Analyze Sequence
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results Section */}
      {currentSequence && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">DNA Visualization</h3>
              <DNAVisualization sequence={currentSequence.sequence} defects={currentSequence.results.defects} />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Defect Analysis</h3>
              {currentSequence.results.defects.length > 0 ? (
                <DefectTable defects={currentSequence.results.defects} />
              ) : (
                <div className="text-center py-8 text-green-600">
                  No defects detected in this DNA sequence.
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Analysis Summary</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Sequence Length</p>
                  <p className="font-medium">{currentSequence.sequence.length} nucleotides</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Analysis Type</p>
                  <p className="font-medium capitalize">{currentSequence.analysisType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Analyzed At</p>
                  <p className="font-medium">{currentSequence.timestamp.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Defects</p>
                  <p className="font-bold text-lg">
                    <span className={currentSequence.results.defects.length > 0 ? "text-red-600" : "text-green-600"}>
                      {currentSequence.results.defects.length}
                    </span>
                  </p>
                </div>
                
                {currentSequence.results.defects.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded p-3 mt-4">
                    <div className="flex items-start">
                      <AlertTriangleIcon className="h-5 w-5 text-amber-600 mt-0.5 mr-2" />
                      <div>
                        <p className="text-amber-800 text-sm font-medium">
                          Defects Detected
                        </p>
                        <p className="text-amber-700 text-xs mt-1">
                          {currentSequence.results.defects.length} potential issues found in this sequence.
                          Review the defect table for details.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <SequenceHistory />
          </div>
        </div>
      )}
    </div>
  );
}