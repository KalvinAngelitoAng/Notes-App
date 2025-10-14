import api from '../../data/api';
import L from 'leaflet';

export default class HomePage {
  async render() {
    return `
      <section class="container">
        <h1>Stories</h1>
        <div id="story-list" class="story-list"></div>
        <h2>Story Locations</h2>
        <div id="map"></div>
      </section>
    `;
  }

  async afterRender() {
    const storiesResponse = await api.getAllStories();
    const storyListElement = document.getElementById('story-list');

    // Tambahkan blok if ini untuk memeriksa error
    if (storiesResponse.error || !storiesResponse.listStory) {
      storyListElement.innerHTML = `<p>Failed to load stories. Please try again later. Message: ${storiesResponse.message || 'Unknown error'}</p>`;
      console.error('Failed to fetch stories:', storiesResponse);
      // Hentikan eksekusi jika tidak ada data
      const mapElement = document.getElementById('map');
      if (mapElement) {
        mapElement.innerHTML = '<p>Map cannot be displayed because stories could not be loaded.</p>';
      }
      return;
    }

    const stories = storiesResponse.listStory;

    stories.forEach(story => {
      const storyItem = document.createElement('div');
      storyItem.classList.add('story-item');
      storyItem.innerHTML = `
        <img src="${story.photoUrl}" alt="${story.description}">
        <div class="story-item-content">
          <h3>${story.name}</h3>
          <p>${story.description}</p>
        </div>
      `;
      storyItem.addEventListener('click', () => {
        window.location.hash = `#/story/${story.id}`;
      });
      storyListElement.appendChild(storyItem);
    });

    this._initMap(stories);
  }

  _initMap(stories) {
    const map = L.map('map').setView([-6.2088, 106.8456], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    stories.forEach(story => {
      if (story.lat && story.lon) {
        L.marker([story.lat, story.lon]).addTo(map)
          .bindPopup(`<b>${story.name}</b><br>${story.description}`)
          .openPopup();
      }
    });
  }
}