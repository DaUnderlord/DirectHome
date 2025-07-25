/**
 * Utility functions for device detection and accessibility
 */

/**
 * Detect if the device supports touch
 * @returns boolean indicating if touch is supported
 */
export function isTouchDevice(): boolean {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore - for older browsers
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Detect if the user prefers reduced motion
 * @returns boolean indicating if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Detect if the user is using a screen reader
 * @returns boolean indicating if screen reader is likely in use
 */
export function isScreenReaderUser(): boolean {
  // Check for common screen reader indicators
  return (
    // Check for NVDA
    window.navigator.userAgent.includes('NVDA') ||
    // Check for JAWS
    window.navigator.userAgent.includes('JAWS') ||
    // Check for VoiceOver (simplified check)
    window.speechSynthesis?.getVoices().some(voice => voice.name.includes('Alex')) ||
    // Check if user has enabled high contrast mode (Windows)
    window.matchMedia('(prefers-contrast: high)').matches ||
    // Check for forced colors (Windows high contrast mode)
    window.matchMedia('(forced-colors: active)').matches
  );
}

/**
 * Get the appropriate focus ring style based on user preferences
 * @returns CSS class string for focus styling
 */
export function getFocusRingStyle(): string {
  const isHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
  const isForcedColors = window.matchMedia('(forced-colors: active)').matches;
  
  if (isHighContrast || isForcedColors) {
    return 'focus:outline-2 focus:outline-offset-2 focus:outline-current';
  }
  
  return 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
}

/**
 * Announce text to screen readers
 * @param message - Text to announce
 * @param priority - Announcement priority ('polite' or 'assertive')
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Create a debounced function for performance optimization
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Get optimal touch target size based on device
 * @returns Minimum touch target size in pixels
 */
export function getOptimalTouchTargetSize(): number {
  const isMobile = window.innerWidth <= 768;
  const isTouch = isTouchDevice();
  
  if (isMobile && isTouch) {
    return 44; // iOS/Android recommended minimum
  } else if (isTouch) {
    return 40; // Tablet size
  } else {
    return 32; // Desktop/mouse
  }
}

/**
 * Check if the user has enabled high contrast mode
 * @returns boolean indicating if high contrast is enabled
 */
export function isHighContrastMode(): boolean {
  return (
    window.matchMedia('(prefers-contrast: high)').matches ||
    window.matchMedia('(forced-colors: active)').matches
  );
}

/**
 * Get appropriate animation duration based on user preferences
 * @param defaultDuration - Default animation duration in milliseconds
 * @returns Adjusted duration based on user preferences
 */
export function getAnimationDuration(defaultDuration: number): number {
  return prefersReducedMotion() ? 0 : defaultDuration;
}