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
  activeGroup: '',
  newGroup: false,
  cards: [],
  groups: [],
  defaultCards: [],
  messageDisplay: false,
};

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

export const saveClickedData = function (link) {
  state.click.clickedPart = link;
  state.click.activePart = true;
  // return state.click.clickedPart;
};
export const isAnyGroupCreated = function () {
  if (state.groups.length !== 0) return true;
};
export const isUserGroupCreated = function () {
  if (
    state.groups.length !== 0 &&
    state.groups.some(group => group.groupName != 'default')
  )
    return true;
};
export const isActiveGroupChanged = function () {
  let oldActiveGroup = state.activeGroup;

  if (oldActiveGroup != state.activeGroup) return true;
};
export const isDefaultGroupCreated = function () {
  const isDefaultGroupCreated = state.groups.some(
    group => group.groupName === 'default'
  );
  return isDefaultGroupCreated;
};
export const createObjCard = async function () {
  try {
    const { word } = state;
    const index = state.click.clickedPart - 1;
    const definitions = word.meanings[index].definitions.map(
      def => def.definition
    );

    const cardObj = {
      id: Date.now(),
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

export const addCardIntoGroup = async function (card) {
  try {
    const nameGroup = state.activeGroup;
    const index = state.groups.findIndex(obj => obj.groupName === nameGroup);

    state.groups[index].cards.push(card);
    console.log('added card into new group', state.groups);
    console.log('all groups', state.groups);
  } catch (err) {
    console.log(err);
  }
};
export const deleteCard = function (id) {
  console.log('I should delete this:', id);
  console.log(state.groups);

  // if (!state.activeGroup) {
  //   // const index = state.groups[0].cards.findIndex(index => index.id === id);
  const cards = state.groups.map(obj => Object.values(obj));
  const cardsId = cards.map(data => data[2]).flat();
  const cardsId2 = cardsId.map(data => Object.values(data));
  const cardsId3 = cardsId2.findIndex(arr => arr.includes(id));

  console.log('cards', cards);
  console.log('cardsId', cardsId);
  console.log('cardsId2', cardsId2);
  console.log('cardsId3', cardsId3);
};

export const addCardIntoDefaultGroup = async function (card) {
  try {
    const index = state.groups.findIndex(obj => obj.groupName === 'default');
    // const defaultGroup = state.groups.filter(
    //   group => group.groupName === 'default'
    // );
    state.groups[index].cards.push(card);
    console.log('added card into default group', state.groups);
  } catch (err) {
    console.log(err);
  }
};
export const createObjGroup = async function (name) {
  try {
    // const id = 1;
    const id = state.groups.length != 0 ? state.groups.length : 0;
    const group = {
      id,
      groupName: name,
      cards: [],
    };
    state.groups.push(group);
    console.log('create new objGroup', state.groups);
  } catch (err) {
    console.log(err);
  }
};
export const saveGroupAsActive = async function (name) {
  try {
    state.activeGroup = name;
  } catch (err) {
    console.log(err);
  }
};

export const getAllCardsFromGroup = function (group = state.activeGroup) {
  const activeGroupIndex = state.groups.findIndex(
    obj => obj.groupName === group
  );
  const cards = state.groups[activeGroupIndex].cards;

  // cardsView.renderCard(newCard);
  return cards.length;
  // model.state.groups[group].cards.forEach(card => model.addCardIntoGroup(card));
};
