import { API_URL, LANGUAGE_CODE } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  word: {},
};

export const loadSearchWord = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${LANGUAGE_CODE}${id}`);
    const word = data;
    state.word = {
      word: word.word,
      meanings: word.meanings,
      phonetics: word.phonetics[0].text,
      audio: word.phonetics[0].audio,
    };
    console.log(state.word);
  } catch (err) {
    console.error(`${err}🔥🔥🔥`);
    throw err;
  }
};
