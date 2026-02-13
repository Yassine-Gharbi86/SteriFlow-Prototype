// SteriFlow Configuration
// Update these values to match your GitHub Pages deployment

const STERIFLOW_CONFIG = {
    // Your GitHub Pages URL (without trailing slash)
    githubPagesUrl: 'https://yassine-gharbi86.github.io/SteriFlow-Prototype',
    
    // Repository name (used for GitHub Pages path)
    repoName: 'SteriFlow-Prototype',
    
    // Your GitHub username
    githubUsername: 'Yassine-Gharbi86'
};

// Auto-detect if running on GitHub Pages or locally
function getViewerUrl(encodedData) {
    const isGitHubPages = window.location.hostname.includes('github.io');
    
    if (isGitHubPages) {
        // Use the configured GitHub Pages URL
        return `${STERIFLOW_CONFIG.githubPagesUrl}/viewer.html?data=${encodedData}`;
    } else {
        // Local development - use relative path
        const baseUrl = window.location.href.split('?')[0].replace('index.html', '');
        return `${baseUrl}viewer.html?data=${encodedData}`;
    }
}