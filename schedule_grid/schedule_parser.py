"""
Schedule Grid Parser
Converts AI-extracted text output into structured JSON format.
"""

import re
import json
from datetime import datetime
from typing import Optional

COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']

TIME_SLOTS = {
    'B': ('08:00 AM', '08:50 AM'),
    'C': ('08:50 AM', '09:40 AM'),
    'D': ('09:40 AM', '10:30 AM'),
    'E': ('10:30 AM', '11:20 AM'),
    'F': ('11:20 AM', '12:10 PM'),
    'G': ('12:10 PM', '01:00 PM'),
    'H': ('01:00 PM', '01:50 PM'),
    'I': ('01:50 PM', '02:40 PM'),
    'J': ('02:40 PM', '03:30 PM'),
    'K': ('03:30 PM', '04:20 PM'),
    'L': ('04:20 PM', '05:10 PM'),
    'M': ('05:10 PM', '06:00 PM'),
}

LINE_KEYS = ['BC', 'CD', 'DE', 'EF', 'FG', 'GH', 'HI', 'IJ', 'JK', 'KL', 'LM']


def parse_span(coordinate: str) -> list[str]:
    """Parse a coordinate like 'E2:G2' or 'B2' into column list."""
    coord = re.sub(r'\d+', '', coordinate)
    parts = coord.split(':')
    if len(parts) == 1:
        return [parts[0]]
    start_idx = COLUMNS.index(parts[0])
    end_idx = COLUMNS.index(parts[1])
    return COLUMNS[start_idx:end_idx + 1]


def parse_line_audit(audit_text: str) -> dict:
    """Parse line audit text into structured dict."""
    result = {}
    pairs = re.findall(r'(\w+)\|\w+:\s*(PRESENT|MISSING)', audit_text)
    for pair_key, status in pairs:
        key = pair_key.upper()
        if key in LINE_KEYS:
            result[key] = status
    return result


def parse_cell(cell_text: str) -> dict:
    """Parse a cell extraction line into structured dict."""
    pattern = r'\*\*(.+?)\*\*:\s*(Standard|Merged|Sub-divided)\s*\|\s*`(.+?)`'
    match = re.match(pattern, cell_text.strip())
    if not match:
        return None

    coordinate = match.group(1).strip()
    status = match.group(2).strip()
    content = match.group(3).strip()

    cell = {
        'coordinate': coordinate,
        'status': status,
        'content': content.replace('\\n', '\n'),
    }

    if status == 'Merged':
        cols = parse_span(coordinate)
        cell['mergeColumns'] = len(cols)

    return cell


def parse_row(row_text: str) -> Optional[dict]:
    """Parse a complete row extraction text."""
    row_match = re.search(r'Row\s+(\d+)\s*\((\w+)\)', row_text)
    if not row_match:
        return None

    row_index = int(row_match.group(1))
    day_label = row_match.group(2)

    audit_match = re.search(r'Line Audit:(.+?)(?=Extraction:|$)', row_text, re.DOTALL)
    line_audit = {}
    if audit_match:
        line_audit = parse_line_audit(audit_match.group(1))

    cells = []
    cell_pattern = r'\*\*(.+?)\*\*:\s*(Standard|Merged|Sub-divided)\s*\|\s*`(.+?)`'
    for match in re.finditer(cell_pattern, row_text):
        coordinate = match.group(1).strip()
        status = match.group(2).strip()
        content = match.group(3).strip().replace('\\n', '\n')

        cell = {
            'coordinate': coordinate,
            'status': status,
            'content': content,
        }

        if status == 'Merged':
            cols = parse_span(coordinate)
            cell['mergeColumns'] = len(cols)

        cells.append(cell)

    return {
        'rowIndex': row_index,
        'dayLabel': day_label,
        'lineAudit': line_audit,
        'cells': cells,
    }


def parse_ai_output(ai_text: str) -> dict:
    """Parse complete AI output into structured JSON."""
    rows = []
    row_pattern = r'Row\s+(\d+)\s*\((\w+)\)(.*?)(?=Row\s+\d+|$)'
    for match in re.finditer(row_pattern, ai_text, re.DOTALL):
        row_text = match.group(0)
        parsed = parse_row(row_text)
        if parsed:
            rows.append(parsed)

    time_slots = [
        {'column': col, 'start': start, 'end': end}
        for col, (start, end) in TIME_SLOTS.items()
    ]

    return {
        'metadata': {
            'extractedAt': datetime.now().isoformat(),
            'sourceImage': 'ai_extracted',
            'totalRows': len(rows),
            'totalColumns': len(COLUMNS),
        },
        'timeSlots': time_slots,
        'rows': rows,
    }


def parse_from_json(ai_json: dict) -> dict:
    """Parse AI output already in JSON format (from structured prompt)."""
    if 'rows' in ai_json and 'metadata' in ai_json:
        return ai_json

    rows = []
    for idx, row_data in enumerate(ai_json.get('schedule', []), start=1):
        day = row_data.get('day', f'DAY{idx}')
        cells = []
        line_audit = {}

        for col in COLUMNS[1:]:
            cell_data = row_data.get(col, {})
            content = cell_data.get('content', '[Empty]')
            status = cell_data.get('status', 'Standard')
            merged = cell_data.get('merged', [])

            if merged:
                end_col = COLUMNS[min(COLUMNS.index(col) + len(merged) - 1, len(COLUMNS) - 1)]
                coordinate = f'{col}{idx}:{end_col}{idx}'
                status = 'Merged'
            else:
                coordinate = f'{col}{idx}'

            cells.append({
                'coordinate': coordinate,
                'status': status,
                'content': content,
                'mergeColumns': len(merged) if merged else None,
            })

        rows.append({
            'rowIndex': idx,
            'dayLabel': day,
            'lineAudit': line_audit,
            'cells': cells,
        })

    return {
        'metadata': {
            'extractedAt': datetime.now().isoformat(),
            'sourceImage': 'json_input',
            'totalRows': len(rows),
            'totalColumns': len(COLUMNS),
        },
        'timeSlots': [
            {'column': col, 'start': start, 'end': end}
            for col, (start, end) in TIME_SLOTS.items()
        ],
        'rows': rows,
    }


def to_json(schedule_data: dict, indent: int = 2) -> str:
    """Convert schedule data to formatted JSON string."""
    return json.dumps(schedule_data, indent=indent, ensure_ascii=False)


def save_json(schedule_data: dict, filepath: str) -> None:
    """Save schedule data to JSON file."""
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(schedule_data, f, indent=2, ensure_ascii=False)


def load_json(filepath: str) -> dict:
    """Load schedule data from JSON file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)


SAMPLE_AI_OUTPUT = """
Row 1 (SAT)
Line Audit:
B|C: PRESENT | C|D: PRESENT | D|E: PRESENT | E|F: MISSING | F|G: MISSING | G|H: PRESENT | H|I: PRESENT | I|J: PRESENT | J|K: PRESENT | K|L: PRESENT | L|M: PRESENT

Extraction:
* **A1:** Standard | `SAT`
* **B1:** Standard | `[Empty]`
* **C1:** Standard | `[Empty]`
* **D1:** Standard | `[Empty]`
* **E1:G1:** Merged (3-column span) | `CE 400\\nRESERVED\\n(TBA)`
* **H1:** Standard | `CE 431\\n3A05\\n(MR. ASIF)`
* **I1:** Standard | `CE 411\\n3A05\\n(DR. MAHMUD)`
* **J1:** Standard | `CE 415\\n3A05\\n(DR. GALIB)`
* **K1:** Standard | `[Empty]`
* **L1:** Standard | `[Empty]`
* **M1:** Standard | `[Empty]`

Row 2 (SUN)
Line Audit:
B|C: PRESENT | C|D: PRESENT | D|E: PRESENT | E|F: PRESENT | F|G: PRESENT | G|H: MISSING | H|I: MISSING | I|J: MISSING | J|K: PRESENT | K|L: PRESENT | L|M: PRESENT

Extraction:
* **A2:** Standard | `SUN`
* **B2:** Standard | `CE 401\\n3A05\\n(DR. NASIM)`
* **C2:** Standard | `CE 401\\n3A05\\n(DR. NASIM)`
* **D2:** Standard | `[Empty]`
* **E2:** Standard | `CE 432\\n3A05\\n(MR. HASSAN)`
* **F2:** Standard | `[Empty]`
* **G2:I2:** Merged (3-column span) | `CE 499\\nLAB\\n(DR. ALI)`
* **J2:** Standard | `[Empty]`
* **K2:** Standard | `[Empty]`
* **L2:** Standard | `[Empty]`
* **M2:** Standard | `[Empty]`
"""


if __name__ == '__main__':
    print("=== Schedule Grid Parser ===\n")

    data = parse_ai_output(SAMPLE_AI_OUTPUT)
    print(f"Parsed {len(data['rows'])} rows")
    print(f"Columns: {len(COLUMNS)}")
    print("\nJSON Output:")
    print(to_json(data))

    save_json(data, 'parsed_schedule.json')
    print("\nSaved to parsed_schedule.json")
