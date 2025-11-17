import React, { useState } from 'react';
import { utils, writeFile } from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

function ExportButton({ data, filename }) {
  const [showMenu, setShowMenu] = useState(false);

  const exportToCSV = () => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
    setShowMenu(false);
  };

  const exportToExcel = () => {
    if (data.length === 0) return;
    
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Sheet1');
    writeFile(wb, `${filename}.xlsx`);
    setShowMenu(false);
  };

  const exportToPDF = () => {
    if (data.length === 0) return;
    
    const doc = new jsPDF();
    const headers = [Object.keys(data[0])];
    const rows = data.map(row => Object.values(row));
    
    doc.text(`${filename.replace('-', ' ').toUpperCase()}`, 14, 15);
    doc.autoTable({
      head: headers,
      body: rows,
      startY: 20,
    });
    
    doc.save(`${filename}.pdf`);
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
      >
        <span>📥 Export</span>
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <button
            onClick={exportToCSV}
            className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
          >
            📊 Download CSV
          </button>
          <button
            onClick={exportToExcel}
            className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
          >
            📈 Download Excel
          </button>
          <button
            onClick={exportToPDF}
            className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
          >
            📄 Download PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default ExportButton;