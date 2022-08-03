import * as fs from 'fs';

export class CsvDataService {
  static objToCsvFormat = (rows: object[]): string => {
    if (!rows || !rows.length) {
      return '';
    }
    const separator = ',';
    const keys = Object.keys(rows[0]);
    const csvContent =
      keys.join(separator) +
      '\n' +
      rows.map(row => {
        return keys.map((k: any) => {
          // @ts-ignore
          let cell = row[k] === null || row[k] === undefined ? '' : row[k];
          cell = cell instanceof Date
            ? cell.toLocaleString()
            : cell.toString().replace(/"/g, '""');
          if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell}"`;
          }
          return cell;
        }).join(separator);
      }).join('\n') || ''
    return csvContent
  }
  static saveCsvFile = (filename: string, data: string): void => {
    fs.writeFileSync(filename, data)
  }
}
