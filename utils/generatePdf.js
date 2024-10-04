// utils/generatePDF.js
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateLoanPDF = (loan) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const filePath = path.join(__dirname, `../uploads/loan_${loan._id}.pdf`);
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // Add content to PDF
      doc.fontSize(20).text('Loan Details', { align: 'center' });
      doc.moveDown();

      doc.fontSize(12).text(`Loan ID: ${loan._id}`);
      doc.text(`User ID: ${loan.userId}`);
      doc.text(`Capital: ${loan.capital}`);
      doc.text(`Monthly Interest: ${loan.monthlyInterest}`);
      doc.text(`Annual Interest: ${loan.annualInterest}`);
      doc.text(`Timeline: ${loan.timeline} months`);
      doc.text(`Currency: ${loan.currency}`);
      doc.text(`Legal Expenses: ${loan.legalExpenses}`);
      doc.text(`Total Profit: ${loan.totalProfit}`);
      doc.text(`Status: ${loan.status}`);
      doc.moveDown();

      doc.text('Clients:', { underline: true });
      loan.clients.forEach((clientObj, index) => {
        doc.text(`${index + 1}. Client ID: ${clientObj.client}, Status: ${clientObj.status}, Has Paid: ${clientObj.hasPaid}`);
      });

      doc.end();

      writeStream.on('finish', () => {
        resolve(filePath);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export default generateLoanPDF;
