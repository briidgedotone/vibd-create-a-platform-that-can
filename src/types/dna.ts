export interface DNADefect {
  type: string;
  position: number;
  length: number;
  severity: 'Low' | 'Medium' | 'High';
  description: string;
}

export interface DNAAnalysisResults {
  defects: DNADefect[];
  metrics: {
    gcContent: number;
    atgcRatio: number;
    repeats: number;
  };
}

export interface DNASequence {
  id: string;
  sequence: string;
  analysisType: 'basic' | 'comprehensive';
  timestamp: Date;
  results: DNAAnalysisResults;
}