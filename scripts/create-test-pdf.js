import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Creating PDF...');

// Create a document
const doc = new PDFDocument();

const outputPath = path.join(__dirname, '../test/sample-transcript.pdf');
console.log('Output path:', outputPath);

// Pipe its output somewhere, like to a file
doc.pipe(fs.createWriteStream(outputPath));

// Read the text file
const textPath = path.join(__dirname, '../test/sample-transcript.txt');
console.log('Reading text from:', textPath);

const transcript = fs.readFileSync(textPath, 'utf8');
console.log('Text content length:', transcript.length);

// Add the content to the PDF
doc.fontSize(12)
   .text(transcript, {
     align: 'left',
     lineGap: 5
   });

// Finalize PDF file
doc.end();

console.log('PDF creation completed.');
