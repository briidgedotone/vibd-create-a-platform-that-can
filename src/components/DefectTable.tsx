import React from 'react';
import { DNADefect } from '@/types/dna';

interface DefectTableProps {
  defects: DNADefect[];
}

export default function DefectTable({ defects }: DefectTableProps) {
  // Sort defects by position
  const sortedDefects = [...defects].sort((a, b) => a.position - b.position);
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Position
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Length
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Severity
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedDefects.map((defect, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${getSeverityColor(defect.severity)}`}>
                  {defect.type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {defect.position + 1} {/* +1 for 1-based indexing in display */}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {defect.length}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${getSeverityColor(defect.severity)}`}>
                  {defect.severity}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {defect.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getSeverityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}