import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import api from '../data/api';
import CONFIG from '../config';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
    this._initialAppShell();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    // Close drawer when clicking outside
    document.body.addEventListener('click', (event) => {
      if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove('open');
      }

      // Close drawer when clicking nav link
      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });

    // Close drawer with Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.#navigationDrawer.classList.contains('open')) {
        this.#navigationDrawer.classList.remove('open');
        this.#drawerButton.focus();
      }
    });
  }

  _initialAppShell() {
    const loginLink = document.getElementById('login-link');
    loginLink.addEventListener('click', (event) => {
      event.preventDefault();

      const userToken = localStorage.getItem(CONFIG.USER_TOKEN_KEY);
      if (userToken) {
        api.logout();
        this._updateLoginStatus();
        window.location.hash = '#/login';
      } else {
        window.location.hash = '#/login';
      }
    });

    this._updateLoginStatus();
  }

  _updateLoginStatus() {
    const loginLink = document.getElementById('login-link');
    const userToken = localStorage.getItem(CONFIG.USER_TOKEN_KEY);

    loginLink.textContent = userToken ? 'Logout' : 'Login';
    loginLink.setAttribute('aria-label', userToken ? 'Logout from account' : 'Login to account');
  }

  async renderPage() {
    const userToken = localStorage.getItem(CONFIG.USER_TOKEN_KEY);
    const url = getActiveRoute();

    // Protected routes check
    const protectedRoutes = ['/', '/story/:id'];
    if (!userToken && protectedRoutes.includes(url)) {
      window.location.hash = '#/login';
      return;
    }

    if (url === '/login' && userToken) {
      window.location.hash = '#/';
      return;
    }

    // Custom View Transition
    await this._transitionOut();

    const page = routes[url] || routes['/'];
    this.#content.innerHTML = await page.render();
    await page.afterRender();

    await this._transitionIn();

    this._updateLoginStatus();

    // Announce page change to screen readers
    this._announcePageChange(url);
  }

  async _transitionOut() {
    return new Promise((resolve) => {
      this.#content.style.opacity = '0';
      this.#content.style.transform = 'translateY(20px)';
      setTimeout(resolve, 300);
    });
  }

  async _transitionIn() {
    return new Promise((resolve) => {
      // Force reflow
      this.#content.offsetHeight;

      this.#content.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      this.#content.style.opacity = '1';
      this.#content.style.transform = 'translateY(0)';

      setTimeout(resolve, 500);
    });
  }

  _announcePageChange(url) {
    // Create or get announcement element for screen readers
    let announcer = document.getElementById('page-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'page-announcer';
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.style.position = 'absolute';
      announcer.style.left = '-10000px';
      announcer.style.width = '1px';
      announcer.style.height = '1px';
      announcer.style.overflow = 'hidden';
      document.body.appendChild(announcer);
    }

    const pageNames = {
      '/': 'Home page',
      '/about': 'About page',
      '/add': 'Add new story page',
      '/story/:id': 'Story detail page',
      '/login': 'Login page',
      '/register': 'Register page'
    };

    announcer.textContent = `Navigated to ${pageNames[url] || 'page'}`;
  }
}

export default App;