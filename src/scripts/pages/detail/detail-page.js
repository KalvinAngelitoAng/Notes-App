import api from '../../data/api';
import { getActivePathname } from '../../routes/url-parser';

export default class DetailPage {
    async render() {
        return `
      <section class="container" id="detail-content">
        Loading...
      </section>
    `;
    }

    async afterRender() {
        const url = getActivePathname();
        const id = url.split('/').pop();
        const storyResponse = await api.getStoryDetail(id);
        const story = storyResponse.story;

        const detailContent = document.getElementById('detail-content');
        detailContent.innerHTML = `
      <h1>${story.name}</h1>
      <img src="${story.photoUrl}" alt="${story.description}" style="width:100%;">
      <p>${story.description}</p>
    `;
    }
}