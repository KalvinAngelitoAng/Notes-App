import api from '../../data/api';
import CONFIG from '../../config';
import L from 'leaflet';

export default class AddStoryPage {
    constructor() {
        this._lat = null;
        this._lon = null;
    }

    async render() {
        return `
      <section class="container">
        <h1>Add New Story</h1>
        <form id="add-story-form">
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" name="description" required></textarea>
          </div>
          <div class="form-group">
            <label for="photo">Photo</label>
            <input type="file" id="photo" name="photo" accept="image/*" required>
            <button type="button" id="camera-button" class="button">Use Camera</button>
            <video id="camera-stream" style="display:none; width: 100%; margin-top: 10px;"></video>
            <canvas id="camera-canvas" style="display:none;"></canvas>
          </div>
          <p>Select location on the map (optional):</p>
          <div id="map-add" style="height: 400px; width: 100%;"></div>
          <button type="submit" class="button" style="margin-top: 15px;">Submit</button>
        </form>
      </section>
    `;
    }

    async afterRender() {
        this._initMap();
        this._initCamera();

        const form = document.getElementById('add-story-form');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData();
            formData.append('description', event.target.description.value);
            formData.append('photo', event.target.photo.files[0]);

            if (this._lat && this._lon) {
                formData.append('lat', this._lat);
                formData.append('lon', this._lon);
            }

            const userToken = localStorage.getItem(CONFIG.USER_TOKEN_KEY);
            const response = userToken ? await api.addNewStory(formData) : await api.addNewStoryGuest(formData);

            if (!response.error) {
                alert('Story added successfully!');
                window.location.hash = userToken ? '#/' : '#/login';
            } else {
                alert(`Error: ${response.message}`);
            }
        });
    }

    _initMap() {
        const map = L.map('map-add').setView([-6.2088, 106.8456], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        let marker;
        map.on('click', (e) => {
            if (marker) {
                map.removeLayer(marker);
            }
            marker = L.marker(e.latlng).addTo(map);
            this._lat = e.latlng.lat;
            this._lon = e.latlng.lng;
        });
    }

    _initCamera() {
        const cameraButton = document.getElementById('camera-button');
        const video = document.getElementById('camera-stream');
        const canvas = document.getElementById('camera-canvas');
        const photoInput = document.getElementById('photo');

        cameraButton.addEventListener('click', async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
                video.style.display = 'block';
                video.play();

                setTimeout(() => {
                    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                    canvas.toBlob(blob => {
                        const file = new File([blob], "camera.jpg", { type: "image/jpeg" });
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(file);
                        photoInput.files = dataTransfer.files;
                    }, 'image/jpeg');
                    stream.getTracks().forEach(track => track.stop());
                    video.style.display = 'none';
                }, 3000);

            } catch (err) {
                console.error("Error accessing camera: ", err);
            }
        });
    }
}