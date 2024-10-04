// utils/generateExcel.js
import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generates an organized Excel report for a given loan.
 * @param {Object} loan - The loan object populated with necessary references.
 * @returns {Promise<string>} - The file path of the generated Excel file.
 */
const generateLoanExcel = async (loan) => {
  try {
    const workbook = new ExcelJS.Workbook();

    // Define styles for headers
    const headerStyle = {
      font: { bold: true, size: 14 },
      alignment: { vertical: 'middle', horizontal: 'center' },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } }, // Light gray background
    };

    const subHeaderStyle = {
      font: { bold: true, size: 12 },
      alignment: { vertical: 'middle', horizontal: 'left' },
    };

    // ---------------------------
    // Section 1: Loan Details
    // ---------------------------
    const loanDetailsSheet = workbook.addWorksheet('Loan Details');

    // Set column widths
    loanDetailsSheet.columns = [
      { key: 'field', width: 25 },
      { key: 'value', width: 50 },
    ];

    // Add Loan Details Header
    loanDetailsSheet.mergeCells('A1:B1');
    const loanHeader = loanDetailsSheet.getCell('A1');
    loanHeader.value = 'Loan Information';
    loanHeader.style = headerStyle;

    // Add some spacing
    loanDetailsSheet.addRow([]);
    
    // Add loan details
    const loanDetails = [
      { field: 'Loan ID', value: loan._id.toString() },
      { field: 'Loan Name', value: loan.loanName || 'N/A' }, // Assuming you have a 'name' field
      { field: 'User', value: loan.userId.firstName || 'N/A' }, // Assuming user has a 'name' field
      { field: 'Capital', value: loan.capital },
      { field: 'Monthly Interest (%)', value: loan.monthlyInterest * 100 },
      { field: 'Annual Interest (%)', value: loan.annualInterest * 100 },
      { field: 'Timeline (Months)', value: loan.timeline },
      { field: 'Currency', value: loan.currency },
      { field: 'Legal Expenses', value: loan.legalExpenses },
      { field: 'Total Profit', value: loan.totalProfit },
      { field: 'Status', value: loan.status },
      { field: 'Created At', value: loan.createdAt.toDateString() },
      { field: 'Updated At', value: loan.updatedAt.toDateString() },
    ];

    loanDetails.forEach(detail => {
      loanDetailsSheet.addRow([detail.field, detail.value]);
    });

    // ---------------------------
    // Section 2: Clients Table
    // ---------------------------
    const clientsSheet = workbook.addWorksheet('Clients');

    // Add Clients Header
    clientsSheet.mergeCells('A1:D1');
    const clientsHeader = clientsSheet.getCell('A1');
    clientsHeader.value = 'Clients Information';
    clientsHeader.style = headerStyle;

    // Add Sub-headers for Clients Table
    clientsSheet.columns = [
      // { header: 'Client ID', key: 'clientId', width: 25 },
      { header: 'Client Name', key: 'clientName', width: 25 },
      { header: 'Has Paid', key: 'hasPaid', width: 15 },
    ];

    // Apply sub-header style
    clientsSheet.getRow(2).eachCell(cell => {
      cell.style = subHeaderStyle;
    });

    // Add Clients Data
    loan.clients.forEach(clientObj => {
      clientsSheet.addRow({
        // clientId: clientObj.client._id.toString(),
        clientName: `${clientObj.client.firstName} ${clientObj.client.lastName}` || 'N/A', // Assuming Client model has a 'name' field
        hasPaid: clientObj.hasPaid ? 'Yes' : 'No',
      });
    });

    // Apply borders to the table
    const tableRange = `A2:D${clientsSheet.rowCount}`;
    clientsSheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    });

    // Optionally, you can add filters to the table
    clientsSheet.autoFilter = {
      from: 'A2',
      to: `D2`,
    };

    // ---------------------------
    // Save the Excel File
    // ---------------------------
    const filePath = path.join(__dirname, `../uploads/loan_${loan._id}.xlsx`);
    await workbook.xlsx.writeFile(filePath);

    return filePath;
  } catch (error) {
    throw error;
  }
};

export default generateLoanExcel;
