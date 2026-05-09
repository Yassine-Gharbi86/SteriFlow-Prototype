

const SF_API = {

    BASE_URL: 'https://steriflow-backend.onrender.com',


    getAccess()  { return localStorage.getItem('sf_access'); },
    getRefresh() { return localStorage.getItem('sf_refresh'); },
    getUser()    { try { return JSON.parse(localStorage.getItem('sf_user')); } catch { return null; } },

    setTokens(access, refresh, user) {
        localStorage.setItem('sf_access',  access);
        localStorage.setItem('sf_refresh', refresh);
        localStorage.setItem('sf_user',    JSON.stringify(user));
        sessionStorage.setItem('sf_auth', '1'); // keep old guard working
    },

    clearTokens() {
        localStorage.removeItem('sf_access');
        localStorage.removeItem('sf_refresh');
        localStorage.removeItem('sf_user');
        sessionStorage.removeItem('sf_auth');
    },

    isLoggedIn() { return !!this.getAccess(); },


    async request(path, options = {}) {
        const url = this.BASE_URL + path;
        const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
        const token = this.getAccess();
        if (token) headers['Authorization'] = `Bearer ${token}`;

        let res = await fetch(url, { ...options, headers });


        if (res.status === 401) {
            const refreshed = await this.refreshToken();
            if (refreshed) {
                headers['Authorization'] = `Bearer ${this.getAccess()}`;
                res = await fetch(url, { ...options, headers });
            } else {
                this.clearTokens();
                window.location.href = 'login.html';
                return null;
            }
        }
        return res;
    },

    async refreshToken() {
        const refresh = this.getRefresh();
        if (!refresh) return false;
        try {
            const res = await fetch(this.BASE_URL + '/api/auth/token/refresh/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh })
            });
            if (!res.ok) return false;
            const data = await res.json();
            localStorage.setItem('sf_access', data.access);
            if (data.refresh) localStorage.setItem('sf_refresh', data.refresh);
            return true;
        } catch { return false; }
    },


    async login(email, password) {
        const res = await fetch(this.BASE_URL + '/api/auth/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Identifiants incorrects.');
        this.setTokens(data.access, data.refresh, data.user);
        return data.user;
    },

    async logout() {
        try {
            await this.request('/api/auth/logout/', {
                method: 'POST',
                body: JSON.stringify({ refresh: this.getRefresh() })
            });
        } catch {}
        this.clearTokens();
        window.location.href = 'login.html';
    },


    async listKits() {
        const res = await this.request('/api/kits/');
        if (!res || !res.ok) throw new Error('Erreur lors du chargement des boîtes.');
        return res.json();
    },

    async getKit(kitId) {
        const res = await this.request(`/api/kits/${encodeURIComponent(kitId)}/`);
        if (!res || !res.ok) throw new Error(`Boîte "${kitId}" introuvable.`);
        return res.json();
    },

    async saveKit(kitData) {
        const res = await this.request('/api/kits/', {
            method: 'POST',
            body: JSON.stringify(kitData)
        });
        if (!res || !res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || JSON.stringify(err) || 'Erreur de sauvegarde.');
        }
        return res.json();
    },

    async updateKit(kitId, kitData) {
        const res = await this.request(`/api/kits/${encodeURIComponent(kitId)}/`, {
            method: 'PATCH',
            body: JSON.stringify(kitData)
        });
        if (!res || !res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || JSON.stringify(err) || 'Erreur de mise à jour.');
        }
        return res.json();
    },

    async deleteKit(kitId) {
        const res = await this.request(`/api/kits/${encodeURIComponent(kitId)}/`, {
            method: 'DELETE'
        });
        if (!res || !res.ok) throw new Error('Erreur de suppression.');
        return true;
    },


    async getKitPublic(kitId) {
        const res = await fetch(`${this.BASE_URL}/api/kits/view/${encodeURIComponent(kitId)}/`);
        if (!res.ok) throw new Error(`Boîte "${kitId}" introuvable.`);
        return res.json();
    },


    async submitReport(payload) {
        const res = await fetch(`${this.BASE_URL}/api/kits/reports/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || 'Erreur lors de l\'envoi du rapport.');
        }
        return res.json();
    },


    getViewerUrl(kitId) {
        const isGitHubPages = window.location.hostname.includes('github.io');
        const base = isGitHubPages
            ? 'https://yassine-gharbi86.github.io/SteriFlow-Prototype'
            : window.location.href.split('?')[0].replace(/[^/]*$/, '').replace(/\/$/, '');
        return `${base}/viewer.html?id=${encodeURIComponent(kitId)}`;
    },


    async checkHealth() {
        try {
            const res = await fetch(`${this.BASE_URL}/api/auth/login/`, { method: 'OPTIONS' });
            return res.ok || res.status === 405;
        } catch { return false; }
    }
};
