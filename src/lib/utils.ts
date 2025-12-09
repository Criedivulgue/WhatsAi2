import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Copies a string to the clipboard.
 * Uses the modern Clipboard API with a fallback to the legacy execCommand.
 * @param text The string to copy to the clipboard.
 * @returns A promise that resolves when the text has been copied.
 */
export async function copyToClipboard(text: string): Promise<void> {
  // Try to use the modern Clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return; // Success
    } catch (err) {
      console.warn("Clipboard API failed, falling back.", err);
    }
  }

  // Fallback for older browsers or insecure contexts
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // Make the textarea invisible
  textArea.style.position = "fixed";
  textArea.style.top = "-9999px";
  textArea.style.left = "-9999px";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    // execCommand is deprecated but necessary for the fallback
    document.execCommand("copy");
  } catch (err) {
    console.error("Fallback copy to clipboard failed.", err);
    // Optionally, re-throw or handle the error in the UI
    throw new Error("Failed to copy to clipboard");
  } finally {
    document.body.removeChild(textArea);
  }
}
