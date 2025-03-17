/**
 * Returns the correct URL with base path for GitHub Pages deployment
 * @param path URL path without the base path
 * @returns URL with the correct base path
 */
export function getPublicPath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  
  // If path already starts with the base path, return it as is
  if (path.startsWith(basePath)) {
    return path;
  }

  // Make sure we don't duplicate slashes
  if (path.startsWith('/') && basePath.endsWith('/')) {
    return `${basePath}${path.slice(1)}`;
  }
  
  // Make sure we have a slash between base path and route
  if (!path.startsWith('/') && !basePath.endsWith('/')) {
    return `${basePath}/${path}`;
  }
  
  return `${basePath}${path}`;
} 