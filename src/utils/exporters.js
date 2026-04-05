function escapeCsvValue(value) {
  const stringValue = String(value ?? '');
  const escaped = stringValue.replaceAll('"', '""');
  return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
}

export function buildCsv(headers, rows) {
  const safeHeaders = headers.map((header) => escapeCsvValue(header)).join(',');
  const safeRows = rows
    .map((row) => row.map((cell) => escapeCsvValue(cell)).join(','))
    .join('\n');

  return `${safeHeaders}\n${safeRows}`;
}
