import axios from 'axios';
import Notiflix from 'notiflix';

async function picRequest(query, page) {
  const API_KEY = '41222680-00250a1b413cf077b48553539';
  const BASE_URL = 'https://pixabay.com/api/?';

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: page,
        per_page: 40,
      },
    });

    return response.data;
  } catch (error) {
    Notiflix.Notify.failure(`Error ${error}`);
  }
}

export default picRequest;
