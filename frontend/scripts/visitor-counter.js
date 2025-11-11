// Visitor Counter functionality
class VisitorCounter {
    constructor() {
        this.apiUrl = this.getApiUrl();
        this.counterElement = document.getElementById('visitor-count');
        this.init();
    }

    getApiUrl() {
        // Try to get API URL from environment variables or use default
        const apiUrl = import.meta?.env?.VITE_API_URL || 
                     window.ENV?.VITE_API_URL || 
                     'https://your-api-gateway-url/stage/visit'; // Replace with your actual API URL
        return apiUrl;
    }

    async init() {
        try {
            await this.incrementAndDisplay();
        } catch (error) {
            console.error('Failed to initialize visitor counter:', error);
            this.displayError();
        }
    }

    async incrementAndDisplay() {
        try {
            this.displayLoading();
            
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    page: window.location.pathname,
                    userAgent: navigator.userAgent,
                    timestamp: new Date().toISOString()
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.displayCount(data.count);
        } catch (error) {
            console.error('Failed to fetch visitor count:', error);
            this.displayError();
        }
    }

    displayLoading() {
        if (this.counterElement) {
            this.counterElement.textContent = 'Loading...';
        }
    }

    displayCount(count) {
        if (this.counterElement) {
            this.counterElement.textContent = `👥 Visitor #${count.toLocaleString()}`;
        }
    }

    displayError() {
        if (this.counterElement) {
            this.counterElement.textContent = '👥 Visitors';
        }
    }
}

// Initialize visitor counter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VisitorCounter();
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VisitorCounter;
}