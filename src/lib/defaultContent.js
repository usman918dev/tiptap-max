/**
 * Default content for Tiptap-Max Editor
 * This is the initial content that appears when no saved content exists
 */

export const DEFAULT_CONTENT = `
<h1>Welcome to Tiptap-Max ✨</h1>
<p>This is a <strong>premium rich text editor</strong> built on Tiptap. Start typing to experience the power of modern content editing with advanced features and beautiful UI!</p>

<h2>Text Formatting Features</h2>
<p>Tiptap-Max supports a wide range of text formatting options:</p>
<ul>
  <li>✏️ <strong>Bold text</strong> for emphasis</li>
  <li><em>Italic text</em> for subtle emphasis</li>
  <li><u>Underlined text</u> for highlighting</li>
  <li><s>Strikethrough text</s> for deletions</li>
  <li><code>Inline code</code> for technical terms</li>
  <li><mark>Highlighted text</mark> with custom colors</li>
  <li>H<sub>2</sub>O for subscript and E=mc<sup>2</sup> for superscript</li>
</ul>

<h2>Lists and Organization</h2>
<p>Create structured content with various list types:</p>

<h3>Ordered Lists</h3>
<ol>
  <li>First item in numbered list</li>
  <li>Second item with more details
    <ol>
      <li>Nested ordered list item 1</li>
      <li>Nested ordered list item 2</li>
    </ol>
  </li>
  <li>Third item continuing the sequence</li>
</ol>

<h3>Unordered Lists</h3>
<ul>
  <li>🎨 Design features
    <ul>
      <li>Dark and light themes</li>
      <li>Customizable colors</li>
      <li>Responsive layout</li>
    </ul>
  </li>
  <li>⚡ Performance optimizations
    <ul>
      <li>Fast rendering</li>
      <li>Efficient DOM updates</li>
    </ul>
  </li>
  <li>🔧 Developer tools</li>
</ul>

<h2>Code Blocks with Syntax Highlighting</h2>
<p>Perfect for technical documentation and tutorials:</p>

<pre><code class="language-javascript">// JavaScript example
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(10);
console.log('Fibonacci(10):', result);
</code></pre>

<pre><code class="language-python"># Python example
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

numbers = [3, 6, 8, 10, 1, 2, 1]
print(quicksort(numbers))
</code></pre>

<h2>Tables for Structured Data</h2>
<p>Create beautiful tables with resizable columns and cell formatting:</p>

<table>
  <tbody>
    <tr>
      <th><p><strong>Feature</strong></p></th>
      <th><p><strong>Free Tier</strong></p></th>
      <th><p><strong>Pro Tier</strong></p></th>
      <th><p><strong>Enterprise Tier</strong></p></th>
    </tr>
    <tr>
      <td><p>Basic Formatting</p></td>
      <td><p>✅ Yes</p></td>
      <td><p>✅ Yes</p></td>
      <td><p>✅ Yes</p></td>
    </tr>
    <tr>
      <td><p>Tables</p></td>
      <td><p>❌ No</p></td>
      <td><p>✅ Yes</p></td>
      <td><p>✅ Yes</p></td>
    </tr>
    <tr>
      <td><p>Code Blocks</p></td>
      <td><p>❌ No</p></td>
      <td><p>✅ Yes</p></td>
      <td><p>✅ Yes</p></td>
    </tr>
    <tr>
      <td><p>Custom Styles</p></td>
      <td><p>❌ No</p></td>
      <td><p>❌ No</p></td>
      <td><p>✅ Yes</p></td>
    </tr>
  </tbody>
</table>

<h2>Blockquotes and Callouts</h2>
<p>Highlight important information with styled quotes:</p>

<blockquote>
  <p>💡 <strong>Pro tip:</strong> Your content is automatically saved to local storage! No need to worry about losing your work.</p>
</blockquote>

<blockquote>
  <p>📚 <strong>Did you know?</strong> Tiptap is built on ProseMirror, a powerful toolkit for building rich text editors.</p>
</blockquote>

<blockquote>
  <p>⚠️ <strong>Important:</strong> Make sure to test your content in both dark and light themes for the best user experience.</p>
</blockquote>

<h2>Links and References</h2>
<p>Add links to external resources and internal references:</p>
<ul>
  <li>Visit our website: <a href="https://tiptap.dev">Tiptap Official Documentation</a></li>
  <li>Check out the <a href="https://github.com/ueberdosis/tiptap">GitHub Repository</a></li>
  <li>Learn more about <a href="https://prosemirror.net">ProseMirror</a></li>
  <li>Custom link: <a href="https://techo.com">Techo</a></li>
</ul>

<h2>Text Alignment Options</h2>
<p style="text-align: left">Left-aligned text (default)</p>
<p style="text-align: center">Center-aligned text for titles and emphasis</p>
<p style="text-align: right">Right-aligned text for special layouts</p>
<p style="text-align: justify">Justified text spreads content evenly across the line width, creating clean edges on both sides. This is particularly useful for formal documents and long-form content.</p>

<h2>Horizontal Rules</h2>
<p>Separate sections with visual dividers:</p>
<hr>
<p>Content continues after the horizontal rule...</p>

<h2>Rich Content Examples</h2>
<p>Combine multiple features for powerful content:</p>

<ol>
  <li>
    <strong>Installation Guide</strong>
    <pre><code class="language-bash">npm install @tiptap/react @tiptap/starter-kit
npm install @tiptap/extension-table @tiptap/extension-image</code></pre>
  </li>
  <li>
    <strong>Configuration</strong>
    <p>Set up your editor with custom extensions and styling options.</p>
  </li>
  <li>
    <strong>Deployment</strong>
    <p>Deploy your application with <code>npm run build</code> and <code>npm start</code></p>
  </li>
</ol>

<h2>Mathematical Expressions</h2>
<p>While full LaTeX support requires additional extensions, you can use superscript and subscript for basic math:</p>
<ul>
  <li>Pythagorean theorem: a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup></li>
  <li>Chemical formula: H<sub>2</sub>SO<sub>4</sub> (sulfuric acid)</li>
  <li>Einstein's equation: E = mc<sup>2</sup></li>
</ul>

<h2>Best Practices</h2>
<blockquote>
  <p>💪 <strong>Tip for power users:</strong> Use keyboard shortcuts to work faster! Try <strong>Ctrl+B</strong> for bold, <strong>Ctrl+I</strong> for italic, and <strong>Ctrl+Z</strong> to undo.</p>
</blockquote>

<p>Here are some best practices when using Tiptap-Max:</p>
<ol>
  <li><strong>Save frequently</strong> - Although auto-save is enabled, it's good practice to manually save important work</li>
  <li><strong>Use semantic HTML</strong> - Choose appropriate heading levels (H1, H2, H3) for better document structure</li>
  <li><strong>Optimize images</strong> - Compress images before uploading for better performance</li>
  <li><strong>Test responsiveness</strong> - Ensure your content looks good on different screen sizes</li>
  <li><strong>Accessibility matters</strong> - Use alt text for images and descriptive link text</li>
</ol>

<h2>Advanced Features</h2>
<p>Explore these advanced capabilities:</p>
<ul>
  <li>🎯 <strong>Drag and Drop</strong> - Reorder blocks by dragging them</li>
  <li>🖼️ <strong>Image Management</strong> - Upload, resize, and align images</li>
  <li>📊 <strong>Table Operations</strong> - Add/remove rows and columns dynamically</li>
  <li>🎨 <strong>Custom Styling</strong> - Apply colors and custom classes</li>
  <li>⌨️ <strong>Keyboard Shortcuts</strong> - Master shortcuts for efficient editing</li>
  <li>💾 <strong>Export Options</strong> - Export to HTML, Markdown, or JSON</li>
</ul>

<hr>

<p><em>Start editing this text and refresh the page - your changes will persist thanks to local storage! Try clicking "Reset to default" below to restore this content.</em></p>

<p style="text-align: center"><strong>Happy editing! 🚀</strong></p>
`;
