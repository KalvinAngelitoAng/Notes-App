import api from '../../data/api';
import CONFIG from '../../config';
import L from 'leaflet';

export default class AddStoryPage {
    constructor() {
        this._lat = null;
        this._lon = null;
        this._marker = null;
    }

    async render() {
        return `
      <section class="container">
        <h1>Add New Story</h1>
        <form id="add-story-form">
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" name="description" required aria-required="true"></textarea>
          </div>
          <div class="form-group">
            <label for="photo">Photo</label>
            <input type="file" id="photo" name="photo" accept="image/*" required aria-required="true">
            <button type="button" id="camera-button" class="button" aria-label="Open camera to take photo">Use Camera</button>
            <video id="camera-stream" style="display:none; width: 100%; margin-top: 10px;" aria-hidden="true"></video>
            <canvas id="camera-canvas" style="display:none;" aria-hidden="true"></canvas>
          </div>
          <p id="location-instruction">Select location on the map (optional). Click on the map or press Enter when focused on the map.</p>
          <div id="map-add" style="height: 400px; width: 100%;" tabindex="0" role="application" aria-label="Interactive map for selecting story location" aria-describedby="location-instruction"></div>
          <p id="location-status" class="sr-only" role="status" aria-live="polite"></p>
          <button type="submit" class="button" style="margin-top: 15px;">Submit Story</button>
        </form>
      </section>
    `;
    }

    async afterRender() {
        this._initMap();
        this._initCamera();
        this._initKeyboardMapNavigation();

        const form = document.getElementById('add-story-form');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';

            const formData = new FormData();
            formData.append('description', event.target.description.value);
            formData.append('photo', event.target.photo.files[0]);

            if (this._lat && this._lon) {
                formData.append('lat', this._lat);
                formData.append('lon', this._lon);
            }

            try {
                const userToken = localStorage.getItem(CONFIG.USER_TOKEN_KEY);
                const response = userToken ? await api.addNewStory(formData) : await api.addNewStoryGuest(formData);

                if (!response.error) {
                    alert('Story added successfully!');
                    window.location.hash = userToken ? '#/' : '#/login';
                } else {
                    alert(`Error: ${response.message}`);
                    submitButton.disabled = false;
                    submitButton.textContent = 'Submit Story';
                }
            } catch (error) {
                alert(`Error: ${error.message}`);
                submitButton.disabled = false;
                submitButton.textContent = 'Submit Story';
            }
        });
    }

    _initMap() {
        const map = L.map('map-add').setView([-6.2088, 106.8456], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        map.on('click', (e) => {
            this._addMarker(e.latlng, map);
        });

        this._map = map;
    }

    _addMarker(latlng, map) {
        if (this._marker) {
            map.removeLayer(this._marker);
        }
        this._marker = L.marker(latlng).addTo(map);
        this._lat = latlng.lat;
        this._lon = latlng.lng;

        // Announce to screen readers
        const status = document.getElementById('location-status');
        if (status) {
            status.textContent = `Location selected: Latitude ${this._lat.toFixed(4)}, Longitude ${this._lon.toFixed(4)}`;
        }
    }

    _initKeyboardMapNavigation() {
        const mapElement = document.getElementById('map-add');

        mapElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const center = this._map.getCenter();
                this._addMarker(center, this._map);
            }
        });
    }

    _initCamera() {
        const cameraButton = document.getElementById('camera-button');
        const video = document.getElementById('camera-stream');
        const canvas = document.getElementById('camera-canvas');
        const photoInput = document.getElementById('photo');

        cameraButton.addEventListener('click', async () => {
            await this._handleCameraCapture(video, canvas, photoInput, cameraButton);
        });

        // Keyboard support
        cameraButton.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                await this._handleCameraCapture(video, canvas, photoInput, cameraButton);
            }
        });
    }

    async _handleCameraCapture(video, canvas, photoInput, cameraButton) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            video.style.display = 'block';
            video.setAttribute('aria-hidden', 'false');
            video.play();

            cameraButton.textContent = 'Capturing...';
            cameraButton.disabled = true;

            setTimeout(() => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                canvas.toBlob(blob => {
                    const file = new File([blob], "camera.jpg", { type: "image/jpeg" });
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    photoInput.files = dataTransfer.files;

                    alert('Photo captured successfully!');
                }, 'image/jpeg');

                stream.getTracks().forEach(track => track.stop());
                video.style.display = 'none';
                video.setAttribute('aria-hidden', 'true');
                cameraButton.textContent = 'Use Camera';
                cameraButton.disabled = false;
                cameraButton.focus();
            }, 3000);

        } catch (err) {
            console.error("Error accessing camera: ", err);
            alert("Unable to access camera. Please check permissions or use file upload instead.");
            cameraButton.textContent = 'Use Camera';
            cameraButton.disabled = false;
        }
    }
}