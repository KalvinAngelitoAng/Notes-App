import "../styles/styles.css";

import RootView from "./pages/root-view";
import AppPresenter from "./pages/app-presenter";

document.addEventListener("DOMContentLoaded", async () => {
  const view = new RootView({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });

  const presenter = new AppPresenter({ view });
  presenter.initialize();
  await presenter.handleRouteChange();

  window.addEventListener("hashchange", async () => {
    await presenter.handleRouteChange();
  });

  // Handle skip to content
  const skipLink = document.querySelector('.skip-to-content');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const mainContent = document.querySelector('#main-content');
      if (mainContent) {
        mainContent.setAttribute('tabindex', '-1');
        mainContent.focus();
        mainContent.removeAttribute('tabindex');
      }
    });
  }
});