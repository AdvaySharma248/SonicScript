// ===========================================
// Transcript Download & Copy Utilities
// ===========================================
//
// These functions handle exporting transcriptions out of the app.
// Users can either copy text to their clipboard or download a .txt file.
//
// WHY SEPARATE UTILITIES?
// -----------------------
// By keeping these functions outside components, they:
//   1. Can be used by any component (recording page, history page, etc.)
//   2. Are easy to test independently
//   3. Don't clutter component code with browser API logic
// ===========================================

/**
 * Download text content as a .txt file.
 *
 * HOW IT WORKS:
 * 1. Create a Blob (Binary Large Object) from the text
 * 2. Create a temporary URL pointing to that blob
 * 3. Create an invisible <a> link and simulate a click
 * 4. Clean up the temporary URL
 *
 * @param {string} text - The transcript text to download
 * @param {string} filename - Name for the downloaded file
 */
export const downloadAsText = (text, filename = 'transcript.txt') => {
  // A Blob is a raw data container. We wrap our text in one
  // so the browser can treat it as a downloadable file.
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });

  // URL.createObjectURL creates a temporary browser URL
  // that points to our blob data (e.g., blob:http://localhost/abc-123)
  const url = URL.createObjectURL(blob);

  // Create an invisible anchor (<a>) element
  const link = document.createElement('a');
  link.href = url;
  link.download = filename; // This tells the browser to download, not navigate

  // Add to page, click it, then remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the temporary URL to free memory
  URL.revokeObjectURL(url);
};

/**
 * Copy text to the user's clipboard.
 *
 * Uses the modern Clipboard API with a fallback for older browsers.
 *
 * @param {string} text - The text to copy
 * @returns {Promise<boolean>} True if copy succeeded, false otherwise
 */
export const copyToClipboard = async (text) => {
  try {
    // Modern approach: navigator.clipboard.writeText()
    // This is the recommended way in modern browsers.
    // It requires HTTPS or localhost to work.
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers: create a hidden textarea,
    // put the text in it, select it, and use document.execCommand('copy')
    const textarea = document.createElement('textarea');
    textarea.value = text;

    // Make the textarea invisible (but still in the DOM so we can select it)
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    textarea.style.opacity = '0';

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    // execCommand('copy') is the old way to copy to clipboard
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);

    return success;
  } catch (err) {
    console.error('Failed to copy text:', err);
    return false;
  }
};
