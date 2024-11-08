import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiDownload } from 'react-icons/fi';
import jsPDF from 'jspdf';

const Summary = () => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedSummary = localStorage.getItem('summary');
    if (!savedSummary) {
      setError('No summary found');
      setLoading(false);
      return;
    }

    try {
      setSummary(savedSummary);
      setLoading(false);
    } catch (err) {
      console.error('Error loading summary:', err);
      setError('Failed to load summary');
      setLoading(false);
    }
  }, [navigate]);

  const formatSummary = (text) => {
    if (!text) return null;

    // Split into sections
    const sections = text.split(/(?=\d+\.\s+[A-Z\s]+\n)/);
    
    return sections.map((section, index) => {
      if (!section.trim()) return null;

      // Extract section title
      const titleMatch = section.match(/\d+\.\s+[A-Z\s]+\n/);
      if (!titleMatch) return null;

      const title = titleMatch[0].trim();
      const content = section.replace(titleMatch[0], '').trim();

      // Process subsections
      const subsections = content.split(/(?=[A-Z]\.\s+[A-Z][a-z])/);

      return (
        <div key={index} className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
          {subsections.map((subsection, subIndex) => {
            if (!subsection.trim()) return null;

            // Extract subsection title
            const subTitleMatch = subsection.match(/[A-Z]\.\s+[^\n]+/);
            if (!subTitleMatch) return null;

            const subTitle = subTitleMatch[0];
            const subContent = subsection.replace(subTitleMatch[0], '').trim();

            // Convert bullet points to list items
            const bulletPoints = subContent.split('\n').map((line, lineIndex) => {
              const trimmedLine = line.trim();
              if (!trimmedLine) return null;

              // Check if it's a bullet point
              if (trimmedLine.startsWith('•')) {
                return (
                  <li key={lineIndex} className="ml-4 mb-2">
                    {trimmedLine.substring(1).trim()}
                  </li>
                );
              }

              // Check if it's a quote
              if (trimmedLine.includes('" - ')) {
                return (
                  <blockquote key={lineIndex} className="border-l-4 border-sarangsh-orange pl-4 my-2 italic">
                    {trimmedLine}
                  </blockquote>
                );
              }

              // Check if it contains numbers
              if (/\d+/.test(trimmedLine)) {
                return (
                  <p key={lineIndex} className="mb-2 font-medium">
                    {trimmedLine}
                  </p>
                );
              }

              return (
                <p key={lineIndex} className="mb-2">
                  {trimmedLine}
                </p>
              );
            });

            return (
              <div key={subIndex} className="mb-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-3">{subTitle}</h3>
                <div className="pl-4">{bulletPoints}</div>
              </div>
            );
          })}
        </div>
      );
    });
  };

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(24);
      doc.setTextColor(255, 97, 56); // sarangsh-orange
      doc.text('Summary Report', 20, 20);

      // Add content
      doc.setFontSize(12);
      doc.setTextColor(0);
      
      const lines = summary.split('\n');
      let y = 40;
      
      lines.forEach(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return;

        // Check if we need a new page
        if (y > 270) {
          doc.addPage();
          y = 20;
        }

        if (line.match(/^\d+\.\s+[A-Z\s]+$/)) {
          // Section title
          y += 10;
          doc.setFontSize(16);
          doc.setFont(undefined, 'bold');
          doc.text(line, 20, y);
          doc.setFontSize(12);
          doc.setFont(undefined, 'normal');
          y += 10;
        } else if (line.match(/^[A-Z]\.\s+/)) {
          // Subsection title
          y += 5;
          doc.setFont(undefined, 'bold');
          doc.text(line, 25, y);
          doc.setFont(undefined, 'normal');
          y += 7;
        } else if (trimmedLine.startsWith('•')) {
          // Bullet point
          doc.text(line, 30, y);
          y += 7;
        } else if (line.includes('" - ')) {
          // Quote
          doc.setFont(undefined, 'italic');
          const splitQuote = doc.splitTextToSize(line, 150);
          splitQuote.forEach(quoteLine => {
            doc.text(quoteLine, 30, y);
            y += 7;
          });
          doc.setFont(undefined, 'normal');
        } else if (/\d+/.test(trimmedLine)) {
          // Numbers/metrics
          doc.setFont(undefined, 'bold');
          doc.text(line, 20, y);
          doc.setFont(undefined, 'normal');
          y += 7;
        } else {
          // Regular text
          const splitText = doc.splitTextToSize(line, 170);
          splitText.forEach(textLine => {
            doc.text(textLine, 20, y);
            y += 7;
          });
        }
      });

      doc.save('summary.pdf');
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sarangsh-orange"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-600 mb-4">{error}</div>
        <Link
          to="/"
          className="flex items-center text-sarangsh-orange hover:opacity-80 transition-opacity"
        >
          <FiArrowLeft className="mr-2" />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <Link
          to="/"
          className="flex items-center text-gray-600 hover:text-sarangsh-orange transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </Link>
        <button
          onClick={downloadPDF}
          className="flex items-center px-4 py-2 bg-gradient-orange text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <FiDownload className="mr-2" />
          Download PDF
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold bg-gradient-orange text-transparent bg-clip-text mb-8">
          Summary Report
        </h1>
        
        <div className="prose max-w-none">
          {formatSummary(summary)}
        </div>
      </div>
    </motion.div>
  );
};

export default Summary;
