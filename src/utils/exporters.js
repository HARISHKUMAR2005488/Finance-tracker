function escapeCsvValue(value) {
  const stringValue = String(value ?? '');
  const escaped = stringValue.replaceAll('"', '""');
  return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
}

export function buildCsv(headers, rows, options = {}) {
  const { includeBom = true } = options;
  const safeHeaders = headers.map((header) => escapeCsvValue(header)).join(',');
  const safeRows = rows
    .map((row) => row.map((cell) => escapeCsvValue(cell)).join(','))
    .join('\n');

  const csvBody = `${safeHeaders}\n${safeRows}`;
  return includeBom ? `\uFEFF${csvBody}` : csvBody;
}
