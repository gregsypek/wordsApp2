import { API_URL, LANGUAGE_CODE } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  word: {},
  search: {
    query: '',
    results: [],
  },
  click: {
    activePart: false,
    clickedPart: 10,
    activeBtn: false,
    clickedBtn: 1,
  },
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

export const saveSearchedWord = async function (word) {
  try {
    state.search.results.push(word);
    state.search.query = word.word;
    console.log(state);
  } catch (err) {
    console.error(`${err}🔥🔥🔥`);
    throw err;
  }
};

export const getClickedPartOfSpeech = function (link) {
  state.click.clickedPart = link;
  state.click.activePart = true;
  console.log(state);
  return state.click.clickedPart;
};
