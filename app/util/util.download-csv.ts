import { json2csv } from "json-2-csv";

export const utilDownloadCsv = (items: any[], fileName: string) => {
    const data = json2csv(items);
    // Create a Blob containing the CSV data
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);

    // Set the download filename
    link.download = fileName;

    // Append link to body, trigger download, and cleanup
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}
