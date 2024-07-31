import { FileSystemRouter } from 'bun';

class ClientSideFileSystemRouter {
  constructor() {
    this.router = new FileSystemRouter({
      style: 'nextjs',
      dir: './src/routes',
      origin: window.location.origin,
      assetPrefix: ''
    });

    this.init();
  }

  init() {
    window.addEventListener('popstate', (event) => {
      this.handleRouteChange(window.location.pathname + window.location.search);
    });

    document.addEventListener('click', (event) => {
      if (event.target.tagName === 'A' && event.target.href.startsWith(window.location.origin)) {
        event.preventDefault();
        const url = new URL(event.target.href);
        history.pushState({}, '', url.pathname + url.search);
        this.handleRouteChange(url.pathname + url.search);
      }
    });

    this.handleRouteChange(window.location.pathname + window.location.search);
  }

  handleRouteChange(path) {
    const match = this.router.match(path);
    if (match) {
      this.renderPage(match.src);
    } else {
      console.error('No match found for path:', path);
    }
  }

  async renderPage(src) {
    try {
      const response = await fetch(src);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const html = await response.text();
      document.getElementById('app').innerHTML = html;
    } catch (error) {
      console.error('Failed to load page:', error);
    }
  }
}

// Automatically instantiate the router
new ClientSideFileSystemRouter();
