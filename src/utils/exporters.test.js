import { buildCsv } from './exporters';

describe('buildCsv', () => {
  it('escapes quotes and commas and includes UTF-8 BOM by default', () => {
    const csv = buildCsv(
      ['Description', 'Amount'],
      [['Coffee, "Large"', 12.5]],
    );

    expect(csv.startsWith('\uFEFF')).toBe(true);
    expect(csv).toContain('"Coffee, ""Large""",12.5');
  });

  it('can generate CSV without BOM when requested', () => {
    const csv = buildCsv(['A'], [['B']], { includeBom: false });
    expect(csv.startsWith('\uFEFF')).toBe(false);
    expect(csv).toBe('A\nB');
  });
});
