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
    clickedPart: 1,
    // activeBtn: false,
    // clickedBtn: 1,
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
    // activeBtn: false,
    // clickedBtn: 0,
  };
};

export const saveClickedData = function (link) {
  state.click.clickedPart = link;
  state.click.activePart = true;
  // return state.click.clickedPart;
};
export const isCardUnique = function (card, groupName) {
  groupName.some(cardItem => cardItem.partOfSpeech != card.partOfSpeech);
};
export const saveCardIntoCorrectGroup = function (newCard) {
  //a. there is no group yet
  if (!isAnyGroupCreated()) {
    createObjGroup('default');
    addCardIntoGroup2(newCard, 'default');
    //b. there is default group only
  } else if (isDefaultGroupCreated() && !isUserGroupCreated()) {
    addCardIntoGroup2(newCard, 'default');
    //c. there is user group only
  } else if (!isDefaultGroupCreated() && isUserGroupCreated()) {
    addCardIntoGroup2(newCard);
    //d.there is default group and user group
  } else if (isDefaultGroupCreated() && isUserGroupCreated()) {
    addCardIntoGroup2(newCard);
    // const defaultObjectIndex = model.state.groups.findIndex(
    //   obj => obj.groupName === 'default'
    // );
    // //add all cards from default group into user group
    // model.state.groups[defaultObjectIndex].cards.forEach(card =>
    //   model.addCardIntoGroup(card)
    // );

    //4. add all cards from default group into array 'defaultCards'
    // model.state.groups[defaultObjectIndex].cards.forEach(card =>
    //   model.state.defaultCards.push(card)
    // );

    // //delete default group
    // model.state.groups.splice(defaultObjectIndex, 1);
  } else {
    return;
  }
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
      activePartOfSpeech: state.click.clickedPart,
      definitions,
    };
    state.cards.push(cardObj);
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

const persistGroups = function () {
  localStorage.setItem('groups', JSON.stringify(state.groups));
};

// export const addCardIntoGroup = async function (card) {
//   try {
//     const nameGroup = state.activeGroup;
//     const index = state.groups.findIndex(obj => obj.groupName === nameGroup);

//     state.groups[index].cards.push(card);
//     console.log('added card into new group', state.groups);
//     console.log('all groups', state.groups);

//     persistGroups();
//   } catch (err) {
//     console.log(err);
//   }
// };
export const addCardIntoGroup2 = async function (
  card,
  group = state.activeGroup
) {
  try {
    const index = state.groups.findIndex(obj => obj.groupName === group);
    console.log('grouop', state.activeGroup);
    console.log('index', index);
    console.log('here', state.groups);
    //
    if (state.groups[index].cards) state.groups[index].cards.push(card);
    else return;

    console.log('added card into default group', state.groups);
    persistGroups();
  } catch (err) {
    console.log(err);
  }
};

// export const addCardIntoDefaultGroup = async function (card) {
//   try {
//     const index = state.groups.findIndex(obj => obj.groupName === 'default');

//     console.log(index);
//     state.groups[index].cards.push(card);

//     console.log('added card into default group', state.groups);

//     persistGroups();
//   } catch (err) {
//     console.log(err);
//   }
// };

export const saveGroupAsActive = async function (name) {
  try {
    state.activeGroup = name;
  } catch (err) {
    console.log(err);
  }
};

export const deleteCard = function (id) {
  console.log('I should delete this:', id);

  // 1. find card to delete
  let index;
  if (state.activeGroup) {
    index = state.groups.findIndex(obj => obj.groupName === state.activeGroup);
  } else {
    index = state.groups.findIndex(obj => obj.groupName === 'default');
  }
  const allRenderedCards = state.groups[index].cards;

  const deleteCardIndex = allRenderedCards.findIndex(obj => obj.id === id);

  //2. delete card
  allRenderedCards.splice(deleteCardIndex, 1);

  persistGroups();
};
export const loadNewCard = function () {
  const newCard = state.cards[state.cards.length - 1];

  console.log('I am new card', newCard);
  return newCard;
};
export const loadAllCardsFromGroup = function (group) {
  return state.groups
    .filter(obj => obj.groupName === group)
    .map(obj => obj.cards)
    .flat();
};
const clearGroups = function () {
  localStorage.clear('groups');
};

const initCookie = function () {
  const storage = localStorage.getItem('groups');
  console.log('storage', storage);
  if (storage) {
    state.groups = JSON.parse(storage);

    //save last created group as activeGroup
    state.activeGroup = state.groups.slice(-1)[0].groupName;
    // console.log(state.activeGroup);
  }
};

initCookie();

// clearGroups();
