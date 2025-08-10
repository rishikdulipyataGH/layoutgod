const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

class LayoutExtractor {
  constructor() {
    this.baseLayouts = [];
    this.alternativeLayouts = [];
    this.extractedLayouts = new Map();
  }

  // Extract layouts from HTML files similar to cyanophage's structure
  extractLayoutsFromHTML(htmlFilePath) {
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
    const $ = cheerio.load(htmlContent);
    const layouts = [];

    // Find layout divs with sortable class (like in the original)
    $('.sortable').each((index, element) => {
      const $element = $(element);
      const layoutId = $element.find('h1').attr('id');
      const layoutName = $element.find('h1').text();
      
      if (!layoutId || !layoutName) return;

      // Extract layout string from edit link
      const editLink = $element.find('a[href^="playground.html"]').attr('href');
      let layoutString = '';
      
      if (editLink) {
        const urlParams = new URLSearchParams(editLink.split('?')[1]);
        layoutString = urlParams.get('layout') || '';
      }

      // Extract statistics from data attributes
      const sfb = parseFloat($element.attr('data-sfb')) || 0;
      const effort = parseFloat($element.attr('data-effort')) || 0;
      const skip = parseFloat($element.attr('data-skip')) || 0;
      const lat = parseFloat($element.attr('data-lat')) || 0;

      layouts.push({
        name: layoutName,
        slug: layoutId,
        layoutString,
        type: 'keyboard_layout',
        description: `Keyboard layout: ${layoutName}`,
        stats: {
          sfb_data: sfb,
          effort_data: effort,
          skip_data: skip,
          lateral_stretch_data: lat
        }
      });
    });

    return layouts;
  }

  // Extract layouts from table HTML files  
  extractLayoutsFromTable(tableFilePath) {
    const htmlContent = fs.readFileSync(tableFilePath, 'utf8');
    const $ = cheerio.load(htmlContent);
    const layouts = [];

    // Parse table rows
    $('tbody tr').each((index, row) => {
      const $row = $(row);
      const cells = $row.find('td');
      
      if (cells.length < 17) return; // Need all stat columns

      const nameLink = $(cells[0]).find('a');
      const name = nameLink.text().trim();
      const href = nameLink.attr('href');
      
      if (!name || !href) return;

      // Extract layout ID from href (e.g., index.html#qwerty -> qwerty)
      const layoutId = href.split('#')[1];
      
      const thumb = $(cells[1]).text().trim();
      const effort = parseFloat($(cells[2]).text()) || 0;
      const distance = parseFloat($(cells[3]).text()) || 0;
      const pinkyDistance = parseFloat($(cells[4]).text()) || 0;
      const pinkyOffHome = parseFloat($(cells[5]).text().replace('%', '')) || 0;
      const sfb = parseFloat($(cells[6]).text().replace('%', '')) || 0;
      const skipBigrams = parseFloat($(cells[7]).text().replace('%', '')) || 0;
      const skipBigrams2 = parseFloat($(cells[8]).text().replace('%', '')) || 0;
      const lateralStretch = parseFloat($(cells[9]).text().replace('%', '')) || 0;
      const pinkyScissors = parseFloat($(cells[10]).text().replace('%', '')) || 0;
      const twoRowSfb = parseFloat($(cells[11]).text().replace('%', '')) || 0;
      const twoRowJumps = parseFloat($(cells[12]).text().replace('%', '')) || 0;
      const trigramAlt = parseFloat($(cells[13]).text().replace('%', '')) || 0;
      const triRedirect = parseFloat($(cells[14]).text().replace('%', '')) || 0;
      const rollIn = parseFloat($(cells[15]).text().replace('%', '')) || 0;
      const rollOut = parseFloat($(cells[16]).text().replace('%', '')) || 0;
      const col56 = parseFloat($(cells[17]).text().replace('%', '')) || 0;

      layouts.push({
        name,
        slug: layoutId,
        layoutString: '', // Will need to extract from index files
        type: 'keyboard_layout',
        thumb,
        description: `${name} keyboard layout`,
        stats: {
          effort,
          distance,
          pinky_distance: pinkyDistance,
          pinky_off_home_pct: pinkyOffHome,
          same_finger_bigrams_pct: sfb,
          skip_bigrams_pct: skipBigrams,
          skip_bigrams2_pct: skipBigrams2,
          lateral_stretch_pct: lateralStretch,
          pinky_scissors_pct: pinkyScissors,
          two_row_sfb_pct: twoRowSfb,
          two_row_jumps_pct: twoRowJumps,
          trigram_alt_pct: trigramAlt,
          tri_redirect_pct: triRedirect,
          roll_in_pct: rollIn,
          roll_out_pct: rollOut,
          col5_6_pct: col56
        }
      });
    });

    return layouts;
  }

  // Extract layout strings from index HTML files
  extractLayoutStringsFromIndex(indexFilePath) {
    const htmlContent = fs.readFileSync(indexFilePath, 'utf8');
    const layoutStrings = new Map();

    // Use regex to find layout definitions in the HTML/JavaScript
    // Look for playground.html links with layout parameters
    const playgroundRegex = /playground\.html\?layout=([^"']+)/g;
    let match;
    
    while ((match = playgroundRegex.exec(htmlContent)) !== null) {
      const layoutString = decodeURIComponent(match[1]);
      
      // Find the corresponding layout name (look backwards for h1 id)
      const beforeMatch = htmlContent.substring(0, match.index);
      const h1Match = beforeMatch.match(/id="([^"]+)"/g);
      
      if (h1Match && h1Match.length > 0) {
        const lastH1 = h1Match[h1Match.length - 1];
        const layoutId = lastH1.match(/id="([^"]+)"/)[1];
        layoutStrings.set(layoutId, layoutString);
      }
    }

    return layoutStrings;
  }

  // Convert layout string to visual data structure
  layoutStringToVisualData(layoutString, layoutName = '') {
    // Standard QWERTY positions for reference
    const standardPositions = [
      // Row 0 (top row)
      { row: 0, col: 1, key: 'q' }, { row: 0, col: 2, key: 'w' }, { row: 0, col: 3, key: 'e' },
      { row: 0, col: 4, key: 'r' }, { row: 0, col: 5, key: 't' }, { row: 0, col: 6, key: 'y' },
      { row: 0, col: 7, key: 'u' }, { row: 0, col: 8, key: 'i' }, { row: 0, col: 9, key: 'o' },
      { row: 0, col: 10, key: 'p' }, { row: 0, col: 11, key: '-' },
      // Row 1 (home row)
      { row: 1, col: 1, key: 'a' }, { row: 1, col: 2, key: 's' }, { row: 1, col: 3, key: 'd' },
      { row: 1, col: 4, key: 'f' }, { row: 1, col: 5, key: 'g' }, { row: 1, col: 6, key: 'h' },
      { row: 1, col: 7, key: 'j' }, { row: 1, col: 8, key: 'k' }, { row: 1, col: 9, key: 'l' },
      { row: 1, col: 10, key: ';' }, { row: 1, col: 11, key: '\'' },
      // Row 2 (bottom row)  
      { row: 2, col: 1, key: 'z' }, { row: 2, col: 2, key: 'x' }, { row: 2, col: 3, key: 'c' },
      { row: 2, col: 4, key: 'v' }, { row: 2, col: 5, key: 'b' }, { row: 2, col: 6, key: 'n' },
      { row: 2, col: 7, key: 'm' }, { row: 2, col: 8, key: ',' }, { row: 2, col: 9, key: '.' },
      { row: 2, col: 10, key: '/' }, { row: 2, col: 11, key: '\\' },
      // Extra key
      { row: 3, col: 4, key: '^' }
    ];

    const visualData = {
      name: layoutName,
      keys: [],
      finger_assignment: [
        [1, 1, 2, 3, 4, 4, 7, 7, 8, 9, 10, 10, 10],
        [1, 1, 2, 3, 4, 4, 7, 7, 8, 9, 10, 10, 10],
        [1, 1, 2, 3, 4, 4, 7, 7, 8, 9, 10, 10, 10]
      ]
    };

    // Map each character in layout string to its position
    for (let i = 0; i < Math.min(layoutString.length, standardPositions.length); i++) {
      const char = layoutString[i];
      const pos = standardPositions[i];
      
      visualData.keys.push({
        char: char,
        row: pos.row,
        col: pos.col,
        finger: this.getFinger(pos.row, pos.col),
        hand: pos.col <= 5 ? 'L' : 'R'
      });
    }

    return visualData;
  }

  getFinger(row, col) {
    const fingerAssignment = [
      [1, 1, 2, 3, 4, 4, 7, 7, 8, 9, 10, 10, 10],
      [1, 1, 2, 3, 4, 4, 7, 7, 8, 9, 10, 10, 10],
      [1, 1, 2, 3, 4, 4, 7, 7, 8, 9, 10, 10, 10]
    ];
    
    if (row > 2) {
      return col <= 4 ? 5 : 6; // Thumbs
    }
    
    return fingerAssignment[row][col] || 1;
  }

  // Process all layout files
  async extractAllLayouts(cyanophageDir) {
    const layouts = [];
    
    try {
      // Extract from table.html
      const tableFile = path.join(cyanophageDir, 'table.html');
      if (fs.existsSync(tableFile)) {
        const tableLayouts = this.extractLayoutsFromTable(tableFile);
        layouts.push(...tableLayouts);
        console.log(`Extracted ${tableLayouts.length} layouts from table.html`);
      }

      // Extract from table2.html
      const table2File = path.join(cyanophageDir, 'table2.html');
      if (fs.existsSync(table2File)) {
        const table2Layouts = this.extractLayoutsFromTable(table2File);
        layouts.push(...table2Layouts);
        console.log(`Extracted ${table2Layouts.length} layouts from table2.html`);
      }

      // Extract layout strings from index files
      const indexFile = path.join(cyanophageDir, 'index.html');
      const index2File = path.join(cyanophageDir, 'index2.html');
      
      let layoutStrings = new Map();
      if (fs.existsSync(indexFile)) {
        const indexStrings = this.extractLayoutStringsFromIndex(indexFile);
        layoutStrings = new Map([...layoutStrings, ...indexStrings]);
        console.log(`Extracted ${indexStrings.size} layout strings from index.html`);
      }
      
      if (fs.existsSync(index2File)) {
        const index2Strings = this.extractLayoutStringsFromIndex(index2File);
        layoutStrings = new Map([...layoutStrings, ...index2Strings]);
        console.log(`Extracted ${index2Strings.size} layout strings from index2.html`);
      }

      // Merge layout strings into layouts
      for (const layout of layouts) {
        if (layoutStrings.has(layout.slug)) {
          layout.layoutString = layoutStrings.get(layout.slug);
          layout.visual_data = this.layoutStringToVisualData(layout.layoutString, layout.name);
        }
      }

      // Remove duplicates based on name
      const uniqueLayouts = layouts.filter((layout, index, self) => 
        index === self.findIndex(l => l.name === layout.name)
      );

      console.log(`Total unique layouts extracted: ${uniqueLayouts.length}`);
      return uniqueLayouts;

    } catch (error) {
      console.error('Error extracting layouts:', error);
      return [];
    }
  }
}

module.exports = LayoutExtractor;
