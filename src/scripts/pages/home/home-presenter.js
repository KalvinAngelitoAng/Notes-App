import HomeView from './home-view';
import api from '../../data/api';

class HomePresenter {
    #view = null;

    constructor() {
        this.#view = new HomeView();
    }

    async initialize() {
        try {
            const storiesResponse = await api.getAllStories();

            if (storiesResponse.error || !storiesResponse.listStory) {
                this.#view.showError(storiesResponse.message || 'Unknown error');
                return;
            }

            const stories = storiesResponse.listStory;
            this.#view.displayStories(stories);
            this.#view.initializeMap(stories);
            this.#view.initializeFilter(stories);
        } catch (error) {
            this.#view.showError(error.message);
        }
    }
}

export default HomePresenter;