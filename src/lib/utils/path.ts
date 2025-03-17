/**
 * Returns the correct URL with base path for GitHub Pages deployment
 * @param path URL path without the base path
 * @returns URL with the correct base path
 */
export function getPublicPath(path: string): string {
  // Get base path from environment variable
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  
  // Handle paths that already include the repository name to avoid duplication
  const repoName = basePath.split('/').filter(Boolean).pop();
  if (repoName && path.includes(`/${repoName}/`)) {
    return path;
  }
  
  // Simple case: empty base path or root path
  if (!basePath || path === '/') {
    return path;
  }
  
  // Make sure we don't duplicate slashes
  if (path.startsWith('/')) {
    return `${basePath}${path}`;
  }
  
  // Make sure we have a slash between base path and route
  return `${basePath}/${path}`;
} 