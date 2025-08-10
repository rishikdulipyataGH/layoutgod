#!/usr/bin/env python3
"""
Parse keyboard layout data from HTML files and insert into SQLite database.
This script extracts layout information from the cyanophage.github.io HTML files
and imports them into the keyboard layout analyzer database.
"""

import re
import sqlite3
import json
from pathlib import Path
from bs4 import BeautifulSoup

def extract_key_mappings_from_svg(svg_element):
    """Extract key mappings from SVG element containing keyboard layout."""
    key_mappings = {}
    
    # Find all text elements that contain actual keys (not statistics)
    text_elements = svg_element.find_all('text')
    rect_elements = svg_element.find_all('rect')
    
    # Create a mapping of coordinates to keys
    coordinate_keys = []
    
    for text in text_elements:
        # Skip non-key text elements (statistics, labels, etc.)
        if not text.get('x') or not text.get('y'):
            continue
            
        x = float(text.get('x', 0))
        y = float(text.get('y', 0))
        key_text = text.get_text().strip()
        
        # Filter out non-key elements based on position and content
        if (y < 170 and  # Within keyboard area
            len(key_text) <= 8 and  # Reasonable key length
            key_text not in ['', 'tab', 'ctrl', 'shift', 'enter', 'space', 'mod', 'back'] and
            'font-size="16"' in str(text)):  # Main key text size
            
            coordinate_keys.append({
                'x': x,
                'y': y,
                'key': key_text,
                'position': None
            })
    
    # Sort by position (top to bottom, left to right) to determine layout positions
    coordinate_keys.sort(key=lambda k: (k['y'], k['x']))
    
    # Group by rows based on Y coordinate (with some tolerance)
    rows = []
    current_row = []
    last_y = None
    
    for key_info in coordinate_keys:
        if last_y is None or abs(key_info['y'] - last_y) < 20:  # Same row
            current_row.append(key_info)
        else:  # New row
            if current_row:
                rows.append(sorted(current_row, key=lambda k: k['x']))
            current_row = [key_info]
        last_y = key_info['y']
    
    if current_row:
        rows.append(sorted(current_row, key=lambda k: k['x']))
    
    # Create position mapping
    position_mapping = {}
    
    # Standard QWERTY positions for reference
    row_positions = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],      # Row 1
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],      # Row 2  
        ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']       # Row 3
    ]
    
    # Map extracted keys to standard positions
    for row_idx, row_keys in enumerate(rows[:3]):  # Only take first 3 rows
        if row_idx < len(row_positions):
            for col_idx, key_info in enumerate(row_keys):
                if col_idx < len(row_positions[row_idx]):
                    qwerty_key = row_positions[row_idx][col_idx]
                    position_mapping[qwerty_key] = key_info['key']
    
    return position_mapping

def parse_layout_from_html(html_content):
    """Parse a single layout from HTML content."""
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Find the layout div with data attributes
    layout_div = soup.find('div', class_='sortable')
    if not layout_div:
        return None
    
    # Extract statistics from data attributes
    stats = {
        'sfb': float(layout_div.get('data-sfb', 0)),
        'effort': float(layout_div.get('data-effort', 0)),
        'skip': float(layout_div.get('data-skip', 0)),
        'lat': float(layout_div.get('data-lat', 0))
    }
    
    # Extract layout name from h1 tag
    h1_tag = layout_div.find('h1')
    if not h1_tag:
        return None
        
    layout_name = h1_tag.get('id', '').strip()
    if not layout_name:
        layout_name = h1_tag.get_text().strip()
    
    # Extract key mappings from SVG
    svg_element = layout_div.find('svg')
    if not svg_element:
        return None
    
    key_mappings = extract_key_mappings_from_svg(svg_element)
    
    # Create visual data structure
    visual_data = {
        'keys': key_mappings,
        'stats': stats
    }
    
    # Extract source link if available
    source_link = ""
    source_a = h1_tag.find('a', class_='source')
    if source_a:
        source_link = source_a.get('href', '')
    
    return {
        'name': layout_name,
        'slug': layout_name.lower().replace(' ', '-'),
        'visual_data': visual_data,
        'file_formats': {'html': True},
        'stats': stats,
        'source': source_link
    }

def split_html_into_layouts(html_content):
    """Split HTML content into individual layout sections."""
    # Find all layout divs
    pattern = r'<div class="sortable"[^>]*>.*?(?=<div class="sortable"|$)'
    matches = re.findall(pattern, html_content, re.DOTALL)
    return matches

def insert_layout_into_db(conn, layout_data):
    """Insert layout data into SQLite database."""
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT OR REPLACE INTO layouts (name, slug, visual_data, file_formats, created_at)
            VALUES (?, ?, ?, ?, datetime('now'))
        ''', (
            layout_data['name'],
            layout_data['slug'],
            json.dumps(layout_data['visual_data']),
            json.dumps(layout_data['file_formats'])
        ))
        
        layout_id = cursor.lastrowid
        print(f"Inserted layout: {layout_data['name']} (ID: {layout_id})")
        
        return layout_id
    except Exception as e:
        print(f"Error inserting layout {layout_data['name']}: {e}")
        return None

def main():
    """Main function to parse layouts and insert into database."""
    
    # Paths
    html_files = [
        Path('cyanophage.github.io-main/index.html'),
        Path('cyanophage.github.io-main/index2.html')
    ]
    
    db_path = Path('server/data/keyboard-layouts.db')
    
    # Connect to database
    conn = sqlite3.connect(db_path)
    
    # Check table schema
    cursor = conn.cursor()
    cursor.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='layouts';")
    result = cursor.fetchone()
    if result:
        print(f"Found layouts table with schema: {result[0][:200]}...")
    else:
        print("No layouts table found!")
        return
    
    layouts_processed = 0
    layouts_inserted = 0
    
    for html_file in html_files:
        if not html_file.exists():
            print(f"Warning: {html_file} not found")
            continue
            
        print(f"Processing {html_file}...")
        
        with open(html_file, 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        # Split into individual layout sections
        layout_sections = split_html_into_layouts(html_content)
        print(f"Found {len(layout_sections)} layout sections in {html_file}")
        
        for i, section in enumerate(layout_sections):
            layouts_processed += 1
            
            try:
                layout_data = parse_layout_from_html(section)
                if layout_data:
                    layout_id = insert_layout_into_db(conn, layout_data)
                    if layout_id:
                        layouts_inserted += 1
                else:
                    print(f"Warning: Could not parse layout section {i+1} in {html_file}")
                    
            except Exception as e:
                print(f"Error processing layout section {i+1} in {html_file}: {e}")
                continue
    
    conn.commit()
    conn.close()
    
    print(f"\nProcessing complete!")
    print(f"Layouts processed: {layouts_processed}")
    print(f"Layouts inserted: {layouts_inserted}")

if __name__ == '__main__':
    main()
