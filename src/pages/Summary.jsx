import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiLoader, FiArrowLeft } from 'react-icons/fi';
import { PDFDownloadLink, Document, Page, Text, StyleSheet, View } from '@react-pdf/renderer';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica' },
  title: { fontSize: 24, marginBottom: 20 },
  section: { marginBottom: 15 },
  heading: { fontSize: 18, marginBottom: 10 },
  text: { fontSize: 12, lineHeight: 1.5 },
});

const SummaryPDF = ({ summary }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Summary Report</Text>
      <View style={styles.section}>
        <Text style={styles.text}>{summary}</Text>
      </View>
    </Page>
  </Document>
);

SummaryPDF.propTypes = {
  summary: PropTypes.string.isRequired,
};

const parseSummarySection = (text, sectionTitle) => {
  const sectionRegex = new RegExp(`${sectionTitle}:([\\s\\S]*?)(?=\\d\\.\\s|$)`);
  const match = text.match(sectionRegex);
  if (!match) return { overview: '', points: [] };
  
  const lines = match[1].split('\n').map(line => line.trim()).filter(Boolean);
  const overview = lines.find(line => !line.startsWith('-')) || '';
  const points = lines.filter(line => line.startsWith('-')).map(line => line.substring(1).trim());
  
  return { overview, points };
};

const SummarySection = ({ title, content }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
    {content.overview && (
      <p className="text-gray-600 leading-relaxed mb-6">
        {content.overview}
      </p>
    )}
    {content.points.length > 0 && (
      <div className="space-y-3">
        {content.points.map((point, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-2 h-2 rounded-full bg-gradient-orange mt-2 flex-shrink-0" />
            <p className="text-gray-600 leading-relaxed">{point}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

SummarySection.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.shape({
    overview: PropTypes.string,
    points: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
};

const Summary = () => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSummary = () => {
      const savedSummary = localStorage.getItem('summary');
      if (!savedSummary) {
        navigate('/');
        return;
      }
      setSummary(savedSummary);
      setLoading(false);
    };

    loadSummary();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FiLoader className="w-12 h-12 text-sarangsh-orange" />
        </motion.div>
      </div>
    );
  }

  const executiveOverview = parseSummarySection(summary, '1\\. Executive Overview');
  const keyHighlights = parseSummarySection(summary, '2\\. Key Highlights');
  const criticalAnalysis = parseSummarySection(summary, '3\\. Critical Analysis');
  const forwardLooking = parseSummarySection(summary, '4\\. Forward-Looking Insights');
  const actionItems = parseSummarySection(summary, '5\\. Action Items');

  return (
    <AnimatePresence>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-10 bg-white border-b border-gray-100"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/')}
                  className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                >
                  <FiArrowLeft className="w-6 h-6 text-sarangsh-orange" />
                </motion.button>
                <h1 className="text-3xl font-bold bg-gradient-orange text-transparent bg-clip-text">
                  Summary Report
                </h1>
              </div>
              
              <PDFDownloadLink
                document={<SummaryPDF summary={summary} />}
                fileName="summary-report.pdf"
                className="inline-flex items-center px-6 py-3 bg-gradient-orange text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                {({ loading: pdfLoading }) => (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-2"
                  >
                    <FiDownload className="w-5 h-5" />
                    <span className="font-medium">{pdfLoading ? 'Loading...' : 'Download PDF'}</span>
                  </motion.div>
                )}
              </PDFDownloadLink>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Executive Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Executive Overview</h2>
            <SummarySection 
              title="Overview"
              content={executiveOverview}
            />
          </motion.div>

          {/* Key Insights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <SummarySection 
              title="Key Highlights"
              content={keyHighlights}
            />
            <SummarySection 
              title="Critical Analysis"
              content={criticalAnalysis}
            />
          </div>

          {/* Forward Looking & Action Items */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SummarySection 
              title="Forward-Looking Insights"
              content={forwardLooking}
            />
            <SummarySection 
              title="Action Items"
              content={actionItems}
            />
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default Summary;
