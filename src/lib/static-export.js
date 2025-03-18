/**
 * Helper utilities for static export support with client components
 */

/**
 * Detects if we are in a static export environment during build time
 * @returns {boolean} true if running in static export build
 */
export const isStaticExport = () => {
  // If there's no window, we're in a server/static build context
  if (typeof window === 'undefined') {
    // Check for static export environment variables or flags
    return process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true' || 
           process.env.NODE_ENV === 'production';
  }
  return false;
};

/**
 * Determines if a client component should be rendered in static or dynamic mode
 * @returns {boolean} true if the component should render in static mode
 */
export const shouldUseStaticRendering = () => {
  // Use static rendering during static export
  // Use dynamic rendering in the browser
  return isStaticExport();
}; 