import api from '../../data/api';
import { getActivePathname } from '../../routes/url-parser';
import { showFormattedDate } from '../../utils';

export default class DetailPage {
  async render() {
    return `
      <section class="container" id="detail-content">
        <p class="loading">Loading...</p>
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
      <p class="story-date"><small>Created at: ${showFormattedDate(story.createdAt)}</small></p>
      <img src="${story.photoUrl}" alt="${story.description}" style="width:100%; border-radius: 8px; margin: 20px 0;">
      <p>${story.description}</p>
    `;
  }
}