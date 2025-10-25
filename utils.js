//credit: DeepSeek-R1
export function createTable(data) {
  // Calculate column widths (including header)
  const colWidths = data[0].map((_, colIndex) => {
    return Math.max(...data.map(row => String(row[colIndex]).length));
  });
  let table = '```\n';
  // Top border ┌─────┬─────┐
  table += '┌' + colWidths.map(width => '─'.repeat(width + 2)).join('┬') + '┐\n';
  // Header row │ Name     │ Age │
  table += '│ ' + 
    data[0].map((cell, colIndex) => String(cell).padEnd(colWidths[colIndex])).join(' │ ') + 
    ' │\n';
  // Header separator ├─────┼─────┤
  table += '├' + colWidths.map(width => '─'.repeat(width + 2)).join('┼') + '┤\n';
  // Data rows │ Alice    │ 25  │
  for (let i = 1; i < data.length; i++) {
    table += '│ ' + 
      data[i].map((cell, colIndex) => String(cell).padEnd(colWidths[colIndex])).join(' │ ') + 
      ' │\n';
  }
  // Bottom border └─────┴─────┘
  table += '└' + colWidths.map(width => '─'.repeat(width + 2)).join('┴') + '┘\n';
  return table + '```';
}

export function delay (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}