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

    document.body.addEventListener('click', (event) => {
      if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
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
  }

  async renderPage() {
    const userToken = localStorage.getItem(CONFIG.USER_TOKEN_KEY);
    const url = getActiveRoute();

    const protectedRoutes = ['/', '/story/:id'];
    if (!userToken && protectedRoutes.includes(url)) {
      window.location.hash = '#/login';
      return;
    }

    if (url === '/login' && userToken) {
      window.location.hash = '#/';
      return;
    }

    this.#content.style.opacity = 0;
    const page = routes[url] || routes['/'];
    this.#content.innerHTML = await page.render();
    await page.afterRender();
    this.#content.style.opacity = 1;

    this._updateLoginStatus();
  }
}

export default App;