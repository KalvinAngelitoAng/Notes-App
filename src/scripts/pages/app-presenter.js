import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import CONFIG from "../config";

class AppPresenter {
  #view = null;

  constructor({ view }) {
    this.#view = view;
  }

  initialize() {
    this.#view.initializeShell();
  }

  async handleRouteChange() {
    const userToken = localStorage.getItem(CONFIG.USER_TOKEN_KEY);
    const url = getActiveRoute();

    const protectedRoutes = ["/", "/story/:id"];
    if (!userToken && protectedRoutes.includes(url)) {
      window.location.hash = "#/login";
      return;
    }

    if (url === "/login" && userToken) {
      window.location.hash = "#/";
      return;
    }

    await this.#view.transitionOut();

    const page = routes[url] || routes["/"];
    const html = await page.render();
    await this.#view.renderContent(html);
    await page.afterRender();

    await this.#view.transitionIn();
    this.#view.updateLoginStatus();
    this.#view.announcePageChange(url);
  }
}

export default AppPresenter;
