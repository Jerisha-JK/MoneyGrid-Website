const XLSX = require('xlsx');

// module.exports = {
//     excelExport: async (data) => {
//         const worksheet = XLSX.utils.json_to_sheet(data);
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
//         const excelFile = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
//         const base64String = Buffer.from(excelFile).toString('base64');
//         return base64String;
//     }
// }

const ExcelJS = require("exceljs");

module.exports = {
  excelExport: async (data) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Data must be a non-empty array of objects");
    }

    // Add "Serial No" as the first column in the headers
    const headers = ["S. No", ...Object.keys(data[0])];
    const headerRow = worksheet.addRow(headers);

    // Add data rows with Serial No
    data.forEach((row, index) => {
      const rowValues = [
        index + 1,
        ...headers.slice(1).map((header) => row[header] || ""),
      ];
      worksheet.addRow(rowValues);
    });

    // Style the header row
    headerRow.eachCell({ includeEmpty: true }, (cell) => {
      cell.font = {
        bold: true,
        color: { argb: "FFFFFFFF" }, // White color
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "699E96" },
      };
    });

    // Adjust column widths
headers.forEach((header, colIndex) => {
   // if (header === "dropAddress") return; // Skip fixed column
  
    let maxColumnWidth = header.length;
    data.forEach((row, rowIndex) => {
      const cellValue =
        colIndex === 0
          ? (rowIndex + 1).toString()
          : (row[headers[colIndex]] || "").toString();
      if (cellValue.length > maxColumnWidth) {
        maxColumnWidth = cellValue.length;
      }
    });
    worksheet.getColumn(colIndex + 1).width = maxColumnWidth + 2;
  });
  
  // Then set fixed width for dropAddress
//   const dropAddressIndex = headers.indexOf("dropAddress");
//   if (dropAddressIndex !== -1) {
//     const col = worksheet.getColumn(dropAddressIndex + 1);
//     col.width = 40; // Fixed width
  
//     // Apply wrapText to each cell in the column (including header)
//     col.eachCell({ includeEmpty: true }, (cell) => {
//       cell.alignment = { wrapText: true };
//     });
//   }

    const buffer = await workbook.xlsx.writeBuffer();
    const base64String = Buffer.from(buffer).toString("base64");
    return base64String;
  },
};