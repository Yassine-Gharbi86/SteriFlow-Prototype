

const STERIFLOW_CONFIG = {

    githubPagesUrl: 'https://yassine-gharbi86.github.io/SteriFlow-Prototype',

    repoName: 'SteriFlow-Prototype',


    githubUsername: 'Yassine-Gharbi86',


    supabaseUrl:     'https://djrxmohvcloqjjgrzooe.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqcnhtb2h2Y2xvcWpqZ3J6b29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMDgwNDQsImV4cCI6MjA5MDg4NDA0NH0.eSjzVeO_q_q-KkbBVB3Sz7zDaXgKnahNP0jByAgJEQY'
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