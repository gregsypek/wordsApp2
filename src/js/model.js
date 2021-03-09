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
  cards: [],
};

// meanings: Array(2)
// 0: {partOfSpeech: "noun", definitions: Array(2)}
// 1: {partOfSpeech: "transitive verb", definitions: Array(1)}

export const loadSearchWord = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${LANGUAGE_CODE}${id}`);

    const word = data;
    state.word = {
      id: Date.now(),
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

export const saveSearchedWord = function (word) {
  state.search.results.push(word);
  state.search.query = word.word;

  // console.error(`${err}🔥🔥🔥`);
  // throw err;
};
export const resetClickObject = function () {
  state.click = {
    activePart: false,
    clickedPart: 0,
    activeBtn: false,
    clickedBtn: 0,
  };
};

export const getClickedPartOfSpeech = function (link) {
  state.click.clickedPart = link;
  state.click.activePart = true;
  // return state.click.clickedPart;
};
export const createObjCard = async function () {
  try {
    const { word } = state;
    const index = state.click.clickedPart - 1;
    const definitions = word.meanings[index].definitions.map(
      def => def.definition
    );

    const cardObj = {
      id: word.id,
      name: word.word,
      audio: word.audio,
      phonetics: word.phonetics,
      partOfSpeech: word.meanings[index].partOfSpeech,
      definitions,
    };
    state.cards.push(cardObj);
  } catch (err) {
    console.log(err);
  }
};
