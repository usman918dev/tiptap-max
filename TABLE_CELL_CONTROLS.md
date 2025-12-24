# Table Cell Controls - Implementation Guide

## Overview
Your Tiptap-Max editor now includes Notion-like per-cell table controls! Each table cell displays a floating menu trigger (three dots) that appears on hover or focus.

## Features Implemented

### ✅ Cell Menu Trigger
- **Three-dot icon** appears at the top-right of each cell on hover/focus
- Smooth fade-in animation with scale effect
- Non-intrusive design that doesn't interfere with editing

### ✅ Dropdown Menu Actions
The menu includes the following operations:

#### Row Operations
- **Add Row Before** - Insert a new row above the current cell
- **Add Row After** - Insert a new row below the current cell
- **Delete Row** - Remove the current row

#### Column Operations
- **Add Column Before** - Insert a new column to the left
- **Add Column After** - Insert a new column to the right
- **Delete Column** - Remove the current column

#### Cell Span Controls
- **Increase Rowspan** - Merge with cell below (max 10)
- **Decrease Rowspan** - Split merged row cells
- **Increase Colspan** - Merge with cell to the right (max 10)
- **Decrease Colspan** - Split merged column cells

#### Background Colors
- 9 predefined colors including:
  - Default (transparent)
  - Gray, Red, Orange, Yellow
  - Green, Blue, Purple, Pink
- Color picker with visual preview swatches
- Colors persist when saving content

## File Structure

```
src/components/editor/
├── extensions/
│   ├── CustomTableCell.js       # Tiptap extension with background attribute
│   └── CellMenuView.jsx          # React NodeView with hover detection
└── table/
    ├── CellMenu.jsx              # Radix UI dropdown menu component
    └── TableControls.jsx         # Original table toolbar controls
```

## How It Works

### 1. Custom Extension
`CustomTableCell.js` extends the default Tiptap TableCell:
- Adds `background` attribute for cell colors
- Uses React NodeView for custom rendering
- Maintains compatibility with standard table operations

### 2. React NodeView
`CellMenuView.jsx` wraps each table cell:
- Tracks hover and focus states
- Positions the menu trigger at top-right
- Renders cell content with `NodeViewContent`

### 3. Dropdown Menu
`CellMenu.jsx` provides the UI:
- Radix UI DropdownMenu for accessibility
- Organized sections (Rows, Columns, Span, Colors)
- Smart disable states (can't decrease span below 1)

## Usage

### Creating a Table
1. Click the **Table** icon in the toolbar
2. A 3×3 table with headers is inserted

### Using Cell Controls
1. **Hover over any cell** → Three-dot button appears
2. **Click the three dots** → Menu opens with all options
3. **Select an action** → Changes apply immediately

### Setting Cell Background
1. Open the cell menu
2. Scroll to "Background Color" section
3. Click any color swatch
4. Color applies instantly and persists

### Merging Cells (Rowspan/Colspan)
1. Select a cell
2. Use "Increase Rowspan" to merge downward
3. Use "Increase Colspan" to merge rightward
4. Use "Decrease" to split merged cells

## Styling Customization

All styles follow your existing CSS variable theme system:

```css
/* Cell hover state */
.table-cell-wrapper:hover {
  background-color: var(--bg-surface);
  border-color: var(--color-primary);
}

/* Trigger button colors */
.cell-menu-trigger:hover {
  background: var(--color-primary);
  color: white;
}
```

## Theme Compatibility

The implementation uses your existing color scheme:
- Dark mode: Purple primary (#8b5cf6)
- Light mode: Adapts via CSS variables
- All UI elements follow `data-theme` attribute

## Browser Support

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- Uses standard React + Radix UI (excellent compatibility)

## Accessibility

- Keyboard navigation supported (Tab to focus cells)
- Radix UI DropdownMenu is ARIA-compliant
- Focus states clearly visible
- Screen reader friendly

## Performance Notes

- Hover detection uses local state (no global re-renders)
- Menu only renders when needed
- Smooth animations via CSS transitions
- No performance impact on large tables

## Troubleshooting

### Menu Not Appearing?
- Ensure you're hovering over a `<td>` element
- Check that CustomTableCell is properly imported in Editor.jsx

### Colors Not Persisting?
- Background attribute is saved in the HTML as `data-background`
- Verify localStorage is enabled for content persistence

### Span Controls Disabled?
- Can't decrease below 1 (this is intentional)
- Maximum span is 10 (prevents layout issues)

## Next Steps

Consider adding:
- Custom color picker (beyond predefined colors)
- Cell text alignment options
- Border style controls
- Export table as CSV/Excel

Enjoy your enhanced table editing experience! 🎉
