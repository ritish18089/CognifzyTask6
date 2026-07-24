/**
 * Export Excel (XLSX)
 */
const exportToExcel = (data) => {
    if (!data.length || typeof XLSX === 'undefined') {
        alert('SheetJS not loaded or data is empty');
        return;
    }
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Scraped Data");
    XLSX.writeFile(wb, "scraped_data.xlsx");
};

/**
 * Export CSV
 */
const exportToCsv = (data) => {
    if (!data.length) return;
    const keys = Object.keys(data[0]).filter(k => k !== 'id' && k !== 'type');
    
    const csvContent = [
        keys.join(','),
        ...data.map(item => keys.map(k => `"${String(item[k]).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    downloadFile(csvContent, 'scraped_data.csv', 'text/csv');
};

/**
 * Export JSON
 */
const exportToJson = (data) => {
    if (!data.length) return;
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, 'scraped_data.json', 'application/json');
};

/**
 * File Downloader Utility
 */
const downloadFile = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export { exportToCsv, exportToJson, exportToExcel };
