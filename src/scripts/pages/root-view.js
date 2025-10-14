import api from "../data/api";
import CONFIG from "../config";

class RootView {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ content, drawerButton, navigationDrawer }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
  }

  initializeShell() {
    this.#setupDrawer();
    this.#setupLoginLink();
    this.updateLoginStatus();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        this.#navigationDrawer.classList.contains("open")
      ) {
        this.#navigationDrawer.classList.remove("open");
        this.#drawerButton.focus();
      }
    });
  }

  #setupLoginLink() {
    const loginLink = document.getElementById("login-link");
    if (!loginLink) return;

    loginLink.addEventListener("click", (event) => {
      event.preventDefault();

      const userToken = localStorage.getItem(CONFIG.USER_TOKEN_KEY);
      if (userToken) {
        api.logout();
        this.updateLoginStatus();
        window.location.hash = "#/login";
      } else {
        window.location.hash = "#/login";
      }
    });
  }

  updateLoginStatus() {
    const loginLink = document.getElementById("login-link");
    if (!loginLink) return;
    const userToken = localStorage.getItem(CONFIG.USER_TOKEN_KEY);
    loginLink.textContent = userToken ? "Logout" : "Login";
    loginLink.setAttribute(
      "aria-label",
      userToken ? "Logout from account" : "Login to account"
    );
  }

  async transitionOut() {
    return new Promise((resolve) => {
      this.#content.style.opacity = "0";
      this.#content.style.transform = "translateY(20px)";
      setTimeout(resolve, 300);
    });
  }

  async transitionIn() {
    return new Promise((resolve) => {
      // Force reflow
      this.#content.offsetHeight;

      this.#content.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      this.#content.style.opacity = "1";
      this.#content.style.transform = "translateY(0)";
      setTimeout(resolve, 500);
    });
  }

  async renderContent(htmlString) {
    this.#content.innerHTML = htmlString;
  }

  announcePageChange(url) {
    let announcer = document.getElementById("page-announcer");
    if (!announcer) {
      announcer = document.createElement("div");
      announcer.id = "page-announcer";
      announcer.setAttribute("role", "status");
      announcer.setAttribute("aria-live", "polite");
      announcer.setAttribute("aria-atomic", "true");
      announcer.style.position = "absolute";
      announcer.style.left = "-10000px";
      announcer.style.width = "1px";
      announcer.style.height = "1px";
      announcer.style.overflow = "hidden";
      document.body.appendChild(announcer);
    }

    const pageNames = {
      "/": "Home page",
      "/about": "About page",
      "/add": "Add new story page",
      "/story/:id": "Story detail page",
      "/login": "Login page",
      "/register": "Register page",
    };

    announcer.textContent = `Navigated to ${pageNames[url] || "page"}`;
  }
}

export default RootView;
