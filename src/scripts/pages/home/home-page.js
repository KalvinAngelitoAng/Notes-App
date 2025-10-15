import HomePresenter from './home-presenter';

export default class HomePage {
  async render() {
    return `
      <section class="container">
        <h1>Stories</h1>
        
        <!-- Filter Section -->
        <div class="filter-section" style="margin-bottom: 20px;">
          <label for="location-filter">Filter by name:</label>
          <input type="text" id="location-filter" placeholder="Search stories..." style="padding: 8px; width: 300px;">
        </div>

        <div id="story-list" class="story-list"></div>
        
        <h2>Story Locations</h2>
        <div id="map"></div>
      </section>
    `;
  }

  async afterRender() {
    const presenter = new HomePresenter();
    await presenter.initialize();
  }
}