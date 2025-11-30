import { DNAAnalysisResults, DNADefect } from '@/types/dna';

// Function to analyze DNA sequence
export function analyzeDNA(sequence: string, analysisType: 'basic' | 'comprehensive'): DNAAnalysisResults {
  const defects: DNADefect[] = [];
  const metrics = calculateMetrics(sequence);
  
  // Convert to uppercase for consistent analysis
  const dnaSequence = sequence.toUpperCase();
  
  // Basic analysis checks for all types of analysis
  findFrameshiftMutations(dnaSequence, defects);
  findRepeats(dnaSequence, defects);
  findNonStandardBases(dnaSequence, defects);
  
  // Additional checks for comprehensive analysis
  if (analysisType === 'comprehensive') {
    findGCContentImbalance(dnaSequence, metrics.gcContent, defects);
    findLongHomopolymers(dnaSequence, defects);
    findATGCRatioImbalance(dnaSequence, metrics.atgcRatio, defects);
    findPotentialPalindromes(dnaSequence, defects);
  }
  
  return {
    defects,
    metrics
  };
}

// Calculate basic metrics about the DNA sequence
export function calculateMetrics(sequence: string): { gcContent: number; atgcRatio: number; repeats: number } {
  const dna = sequence.toUpperCase();
  const gcCount = (dna.match(/[GC]/g) || []).length;
  const gcContent = dna.length > 0 ? gcCount / dna.length : 0;
  
  const aCount = (dna.match(/A/g) || []).length;
  const tCount = (dna.match(/T/g) || []).length;
  const gCount = (dna.match(/G/g) || []).length;
  const cCount = (dna.match(/C/g) || []).length;
  
  const atgcRatio = (aCount + tCount) > 0 ? (gCount + cCount) / (aCount + tCount) : 0;
  
  // Count repeats (simple implementation)
  const repeatRegex = /([ATGC]{3,})\1+/g;
  const repeats = (dna.match(repeatRegex) || []).length;
  
  return {
    gcContent,
    atgcRatio,
    repeats
  };
}

// Find frameshift mutations (insertions/deletions that cause a shift in reading frame)
function findFrameshiftMutations(dna: string, defects: DNADefect[]): void {
  // Simple example: detect missing nucleotides using pattern disruption
  // In a real application, this would be much more sophisticated
  const codonLength = 3;
  
  // Check if sequence length is not divisible by 3 (basic check)
  if (dna.length % codonLength !== 0) {
    defects.push({
      type: 'Frameshift',
      position: dna.length - (dna.length % codonLength),
      length: dna.length % codonLength,
      severity: 'High',
      description: `Potential frameshift mutation detected. Sequence length (${dna.length}) is not divisible by 3.`
    });
  }
  
  // Check for unusual patterns that might indicate insertions/deletions
  // This is a simplified example - real frameshift detection would be more complex
  for (let i = 0; i < dna.length - 6; i++) {
    const codon1 = dna.substring(i, i + 3);
    const codon2 = dna.substring(i + 3, i + 6);
    
    // Example pattern: same nucleotide repeated abnormally
    if (codon1 === codon2 && codon1.split('').every(n => n === codon1[0])) {
      defects.push({
        type: 'Repeat',
        position: i,
        length: 6,
        severity: 'Medium',
        description: `Unusual repeat of ${codon1} detected, possible sequencing error or mutation.`
      });
      // Skip ahead to avoid overlapping defects
      i += 5;
    }
  }
}

// Find repeated sequences
function findRepeats(dna: string, defects: DNADefect[]): void {
  // Look for direct repeats (4+ nucleotides repeated)
  for (let length = 4; length <= 8; length++) {
    for (let i = 0; i <= dna.length - length * 2; i++) {
      const segment = dna.substring(i, i + length);
      const nextSegment = dna.substring(i + length, i + length * 2);
      
      if (segment === nextSegment) {
        defects.push({
          type: 'DirectRepeat',
          position: i,
          length: length * 2,
          severity: 'Low',
          description: `Direct repeat of ${segment} detected.`
        });
        // Skip ahead to avoid overlapping defects
        i += length * 2 - 1;
      }
    }
  }
  
  // Look for triplet repeats (associated with some genetic disorders)
  const tripletRegex = /([ATGC]{3})\1{3,}/g;
  let match;
  while ((match = tripletRegex.exec(dna)) !== null) {
    defects.push({
      type: 'TripletRepeat',
      position: match.index,
      length: match[0].length,
      severity: match[0].length >= 15 ? 'Medium' : 'Low',
      description: `Triplet repeat of ${match[1]} detected (${match[0].length / 3} repeats).`
    });
  }
}

// Find non-standard bases (anything other than A, T, G, C)
function findNonStandardBases(dna: string, defects: DNADefect[]): void {
  const nonStandardRegex = /[^ATGC]/g;
  let match;
  while ((match = nonStandardRegex.exec(dna)) !== null) {
    defects.push({
      type: 'NonStandardBase',
      position: match.index,
      length: 1,
      severity: 'High',
      description: `Non-standard nucleotide "${match[0]}" detected.`
    });
  }
}

// Find GC content imbalance (regions with unusually high or low GC content)
function findGCContentImbalance(dna: string, averageGCContent: number, defects: DNADefect[]): void {
  const windowSize = 20;
  for (let i = 0; i <= dna.length - windowSize; i++) {
    const window = dna.substring(i, i + windowSize);
    const gcCount = (window.match(/[GC]/g) || []).length;
    const windowGCContent = gcCount / windowSize;
    
    // Flag regions with extreme GC content
    if (windowGCContent > 0.8) {
      defects.push({
        type: 'HighGCContent',
        position: i,
        length: windowSize,
        severity: 'Medium',
        description: `Region with unusually high GC content (${(windowGCContent * 100).toFixed(1)}%).`
      });
      i += windowSize - 1; // Skip ahead
    } else if (windowGCContent < 0.2) {
      defects.push({
        type: 'LowGCContent',
        position: i,
        length: windowSize,
        severity: 'Low',
        description: `Region with unusually low GC content (${(windowGCContent * 100).toFixed(1)}%).`
      });
      i += windowSize - 1; // Skip ahead
    }
  }
}

// Find homopolymers (long stretches of the same nucleotide)
function findLongHomopolymers(dna: string, defects: DNADefect[]): void {
  const homopolymerRegex = /([ATGC])\1{5,}/g;
  let match;
  while ((match = homopolymerRegex.exec(dna)) !== null) {
    const severity = match[0].length >= 10 ? 'High' : match[0].length >= 8 ? 'Medium' : 'Low';
    defects.push({
      type: 'Homopolymer',
      position: match.index,
      length: match[0].length,
      severity,
      description: `Long stretch of ${match[1]} nucleotides (length: ${match[0].length}).`
    });
  }
}

// Find AT/GC ratio imbalance
function findATGCRatioImbalance(dna: string, overallRatio: number, defects: DNADefect[]): void {
  const windowSize = 30;
  for (let i = 0; i <= dna.length - windowSize; i++) {
    const window = dna.substring(i, i + windowSize);
    const gcCount = (window.match(/[GC]/g) || []).length;
    const atCount = windowSize - gcCount;
    
    // Avoid division by zero
    if (atCount === 0) continue;
    
    const windowRatio = gcCount / atCount;
    // Flag significant deviation from overall ratio
    if (windowRatio > overallRatio * 3 || windowRatio < overallRatio / 3) {
      defects.push({
        type: 'RatioImbalance',
        position: i,
        length: windowSize,
        severity: 'Low',
        description: `Region with unusual AT/GC ratio (${windowRatio.toFixed(2)}).`
      });
      i += windowSize - 1; // Skip ahead
    }
  }
}

// Find potential palindromic sequences (might form secondary structures)
function findPotentialPalindromes(dna: string, defects: DNADefect[]): void {
  for (let i = 0; i <= dna.length - 6; i++) {
    for (let length = 6; length <= 12 && i + length <= dna.length; length += 2) {
      const segment = dna.substring(i, i + length);
      if (isPalindromic(segment)) {
        defects.push({
          type: 'Palindrome',
          position: i,
          length: length,
          severity: length >= 10 ? 'Medium' : 'Low',
          description: `Palindromic sequence detected (can form hairpin structures).`
        });
        break;
      }
    }
  }
}

// Helper function to check if a sequence is palindromic (can form hairpin)
function isPalindromic(sequence: string): boolean {
  const complement: Record<string, string> = { 'A': 'T', 'T': 'A', 'G': 'C', 'C': 'G' };
  const half = Math.floor(sequence.length / 2);
  
  for (let i = 0; i < half; i++) {
    const complementBase = complement[sequence[i]];
    if (complementBase !== sequence[sequence.length - 1 - i]) {
      return false;
    }
  }
  
  return true;
}

// Function to generate synthetic DNA with defects (for demo purposes)
export function generateSyntheticDNA(length: number = 200, defectCount: number = 5): string {
  const bases = ['A', 'T', 'G', 'C'];
  let dna = '';
  
  // Generate random DNA
  for (let i = 0; i < length; i++) {
    dna += bases[Math.floor(Math.random() * 4)];
  }
  
  // Add some homopolymers
  if (defectCount > 0) {
    const pos = Math.floor(Math.random() * (length - 10));
    const base = bases[Math.floor(Math.random() * 4)];
    dna = dna.substring(0, pos) + base.repeat(8) + dna.substring(pos + 8);
  }
  
  // Add some repeats
  if (defectCount > 1) {
    const pos = Math.floor(Math.random() * (length - 20));
    const repeatLength = 4;
    const repeat = dna.substring(pos, pos + repeatLength);
    dna = dna.substring(0, pos + repeatLength) + repeat + dna.substring(pos + repeatLength);
  }
  
  // Add non-standard base
  if (defectCount > 2) {
    const pos = Math.floor(Math.random() * length);
    dna = dna.substring(0, pos) + 'N' + dna.substring(pos + 1);
  }
  
  // Add a GC-rich region
  if (defectCount > 3) {
    const pos = Math.floor(Math.random() * (length - 15));
    const gcRich = 'GCGCGCGCGCGCGCGC'.substring(0, 15);
    dna = dna.substring(0, pos) + gcRich + dna.substring(pos + 15);
  }
  
  // Add a palindromic sequence
  if (defectCount > 4) {
    const pos = Math.floor(Math.random() * (length - 10));
    const palindrome = 'ATGCGCAT';
    dna = dna.substring(0, pos) + palindrome + dna.substring(pos + 8);
  }
  
  return dna;
}