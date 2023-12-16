import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import picRequest from './api-service';

const searchForm = document.querySelector('form.search-form');
const gallery = document.querySelector('div.gallery');
const loadMoreBtn = document.querySelector('button.load-more');

loadMoreBtn.setAttribute('hidden', true);

let query = '';
let page = 1;

async function createMarkup() {
  const data = await picRequest(query, page);

  if (data) {
    const markup = data.hits
      .map(
        hit => `
        <div class="photo-card">
          <a class="image-link" href=${hit.largeImageURL}>
            <img class="image-preview" src=${hit.webformatURL} alt=${hit.tags} loading="lazy"/>
          </a>
          <div class="info">
            <p class="info-item">
              <b>Likes </b>${hit.likes}
            </p>
            <p class="info-item">
              <b>Views </b>${hit.views}
            </p>
            <p class="info-item">
              <b>Comments </b>${hit.comments}
            </p>
            <p class="info-item">
              <b>Downloads </b>${hit.downloads}
            </p>
          </div>
        </div>`
      )
      .join('');

    loadMoreBtn.removeAttribute('hidden', true);

    const totalHits = data.totalHits;
    if (totalHits === 0) {
      loadMoreBtn.setAttribute('hidden', true);
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    if (totalHits !== 0 && page * 40 > totalHits) {
      loadMoreBtn.setAttribute('hidden', true);
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }

    gallery.insertAdjacentHTML('beforeend', markup);

    const lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: '250',
    });

    lightbox.refresh();

    if (page > 1) {
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 1,
        behavior: 'smooth',
      });
    }
  }
}

searchForm.addEventListener('submit', event => {
  gallery.innerHTML = '';
  event.preventDefault();
  page = 1;
  query = searchForm.elements.searchQuery.value;
  createMarkup();
});

loadMoreBtn.addEventListener('click', event => {
  event.preventDefault();
  page += 1;
  createMarkup();
});
