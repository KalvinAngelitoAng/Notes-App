import api from '../../data/api';
import L from 'leaflet';

export default class HomePage {
  constructor() {
    this._map = null;
    this._markers = [];
    this._currentLayer = 'street';
    this._tileLayers = {};
  }

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
    const storiesResponse = await api.getAllStories();
    const storyListElement = document.getElementById('story-list');

    if (storiesResponse.error || !storiesResponse.listStory) {
      storyListElement.innerHTML = `<p>Failed to load stories. Please try again later. Message: ${storiesResponse.message || 'Unknown error'}</p>`;
      console.error('Failed to fetch stories:', storiesResponse);
      const mapElement = document.getElementById('map');
      if (mapElement) {
        mapElement.innerHTML = '<p>Map cannot be displayed because stories could not be loaded.</p>';
      }
      return;
    }

    const stories = storiesResponse.listStory;
    this._initMap(stories);
    this._renderStoryList(stories);
    this._initFilter(stories);
  }

  _renderStoryList(stories) {
    const storyListElement = document.getElementById('story-list');
    storyListElement.innerHTML = '';

    stories.forEach((story, index) => {
      const storyItem = document.createElement('div');
      storyItem.classList.add('story-item');
      storyItem.dataset.storyId = story.id;
      storyItem.dataset.index = index;

      storyItem.innerHTML = `
        <img src="${story.photoUrl}" alt="Photo of ${story.name}'s story: ${story.description.substring(0, 50)}">
        <div class="story-item-content">
          <h3>${story.name}</h3>
          <p>${story.description}</p>
        </div>
      `;

      storyItem.addEventListener('click', () => {
        window.location.hash = `#/story/${story.id}`;
      });

      storyItem.addEventListener('mouseenter', () => {
        this._highlightMarker(index);
      });

      storyItem.addEventListener('mouseleave', () => {
        this._unhighlightMarker(index);
      });

      storyItem.setAttribute('tabindex', '0');
      storyItem.setAttribute('role', 'button');
      storyItem.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          window.location.hash = `#/story/${story.id}`;
        }
      });

      storyListElement.appendChild(storyItem);
    });
  }

  _initMap(stories) {
    this._map = L.map('map').setView([-6.2088, 106.8456], 5);

    this._tileLayers = {
      street: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }),
      satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri'
      }),
      topo: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap'
      })
    };

    this._tileLayers.street.addTo(this._map);

    L.control.layers({
      "Street Map": this._tileLayers.street,
      "Satellite": this._tileLayers.satellite,
      "Topographic": this._tileLayers.topo
    }).addTo(this._map);

    stories.forEach((story, index) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(this._map)
          .bindPopup(`<b>${story.name}</b><br>${story.description}`);

        this._markers[index] = marker;

        marker.on('click', () => {
          const storyItem = document.querySelector(`[data-index="${index}"]`);
          if (storyItem) {
            storyItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            storyItem.classList.add('highlighted');
            setTimeout(() => storyItem.classList.remove('highlighted'), 2000);
          }
        });
      }
    });
  }

  _highlightMarker(index) {
    const marker = this._markers[index];
    if (marker) {
      marker.openPopup();
    }
  }

  _unhighlightMarker(index) {
    const marker = this._markers[index];
    if (marker) {
      marker.closePopup();
    }
  }

  _initFilter(stories) {
    const filterInput = document.getElementById('location-filter');

    filterInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const filteredStories = stories.filter(story =>
        story.name.toLowerCase().includes(searchTerm) ||
        story.description.toLowerCase().includes(searchTerm)
      );

      this._renderStoryList(filteredStories);
      this._updateMapMarkers(filteredStories);
    });

    filterInput.setAttribute('aria-label', 'Filter stories by name or description');
  }

  _updateMapMarkers(filteredStories) {
    this._markers.forEach(marker => {
      if (marker) this._map.removeLayer(marker);
    });
    this._markers = [];

    filteredStories.forEach((story, index) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(this._map)
          .bindPopup(`<b>${story.name}</b><br>${story.description}`);

        this._markers[index] = marker;

        marker.on('click', () => {
          const storyItem = document.querySelector(`[data-story-id="${story.id}"]`);
          if (storyItem) {
            storyItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            storyItem.classList.add('highlighted');
            setTimeout(() => storyItem.classList.remove('highlighted'), 2000);
          }
        });
      }
    });
  }
}