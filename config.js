

const STERIFLOW_CONFIG = {

    githubPagesUrl: 'https://yassine-gharbi86.github.io/SteriFlow-Prototype',

    repoName: 'SteriFlow-Prototype',


    githubUsername: 'Yassine-Gharbi86',


    supabaseUrl:     'https://djrxmohvcloqjjgrzooe.supabase.com',
    supabaseAnonKey: 'sb_publishable_QVK8sq_4dNJ3TkptPUA7ag_jmEhGZsW'
};

// ─── URL helpers ───────────────────────────────────────────────────────────────

/**
 * Returns the viewer URL for a kit, using its short ID.
 * The QR code will only ever encode a tiny URL regardless of how many instruments.
 */
function getViewerUrl(kitId) {
    const isGitHubPages = window.location.hostname.includes('github.io');
    const base = isGitHubPages
        ? STERIFLOW_CONFIG.githubPagesUrl
        : window.location.href.split('?')[0].replace(/[^/]*$/, '').replace(/\/$/, '');
    return `${base}/viewer.html?id=${encodeURIComponent(kitId)}`;
}