// Single Page Apps for GitHub Pages
// MIT License
// Based on https://github.com/rafgraph/spa-github-pages
// This script checks to see if a redirect is present in the query string,
// converts it back into the correct url and adds it to the
// browser's history using window.history.replaceState(...),
// which won't cause the browser to attempt to load the new url.
// When the page is loaded, the stored url will be
// added to the browser's history using history.replaceState(...)

(function(l) {
  // Debug for path issues
  console.log('Original location:', window.location.href);
  
  if (l.search[1] === '/' ) {
    let decoded = l.search.slice(1).split('&').map(function(s) { 
      return s.replace(/~and~/g, '&')
    }).join('?');
    
    console.log('Decoded path:', decoded);
    
    // Check if we have a duplicate repository name in the path
    const pathSegments = l.pathname.split('/');
    const repoName = pathSegments[1]; // First segment after root
    
    if (repoName && decoded.startsWith('/' + repoName + '/' + repoName)) {
      // Remove the duplicate
      decoded = decoded.replace('/' + repoName + '/' + repoName, '/' + repoName);
      console.log('Fixed duplicated repo name in path:', decoded);
    }
    
    window.history.replaceState(null, null,
      l.pathname.slice(0, -1) + decoded + l.hash
    );
  }
}(window.location)) 