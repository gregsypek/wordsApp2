import {
  API_URL,
  LANGUAGE_CODE,
  CARDS_RES_PER_PAGE,
  DEFINITIONS_RES_PER_PAGE,
} from './config.js';
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
  },
  group: {
    activeGroup: '',
    newGroup: false,
    groups: [],
  },
  card: {
    activeCard: '',
    cards: [],
    defaultCards: [],
    messageDisplay: false,

    cardResultsPerPage: CARDS_RES_PER_PAGE,
    page: 1,
    mumPages: 1,
  },
  list: {
    results: [],
    listResultsPerPage: DEFINITIONS_RES_PER_PAGE,
    page: 1,
    numPages: 1,
    active: false,
  },
};

// const createWordObject = function (data) {
//   const { newWord } = data;
//   return {
//     word: newWord.definition1,
//     meanings: [
//       {
//         definitions: [newWord.explanation1],
//         partOfSpeech: newWord.partOfSpeech,
//       },
//     ],
//     phonetics: [
//       {
//         text: newWord.phonetic,
//         audio: newWord.audio,
//       },
//     ],
//   };
// };

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

export const resetClickObject = function () {
  state.click = {
    activePart: false,
    clickedPart: 0,
    // activeBtn: false,
    // clickedBtn: 0,
  };
};
export const saveSearchedWord = function (word) {
  state.search.results.push(word);
  state.search.query = word.word;

  // console.error(`${err}🔥🔥🔥`);
  // throw err;
};

export const saveClickedData = function (link) {
  state.click.clickedPart = link;
  state.click.activePart = true;
  // return state.click.clickedPart;
};

export const saveAndGetNewListCards = function (group) {
  let cards = sortCards(loadAllCardsFromGroup(group));
  //8 save cards into state object
  state.list.results = cards;
  console.log('here', cards);
  return cards;
};
export const updateNewListCards = function (group) {
  let cards = sortCards(loadAllCardsFromGroup(group));
  //8 save cards into state object
  state.list.results = cards;
};
export const isCardUnique = function (previousCard, newCard) {
  // old card has different part of speech
  if (
    previousCard.partOfSpeech != newCard.partOfSpeech ||
    // old card has different name, part of speech doesn't matter
    previousCard.name != newCard.name
  )
    return true;
  else return false;
};
export const saveCardIntoCorrectGroup = async function (newCard) {
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

    // const defaultObjectIndex = model.state.group.groups.findIndex(
    //   obj => obj.groupName === 'default'
    // );
    // //add all cards from default group into user group
    // model.state.group.groups[defaultObjectIndex].cards.forEach(card =>
    //   model.addCardIntoGroup(card)
    // );

    //4. add all cards from default group into array 'defaultCards'
    // model.state.group.groups[defaultObjectIndex].cards.forEach(card =>
    //   model.state.card.defaultCards.push(card)
    // );

    // //delete default group
    // model.state.group.groups.splice(defaultObjectIndex, 1);
  } else {
    return;
  }
};
export const isAnyGroupCreated = function () {
  if (state.group.groups.length !== 0) return true;
};
export const isUserGroupCreated = function () {
  if (
    state.group.groups.length !== 0 &&
    state.group.groups.some(group => group.groupName != 'default')
  )
    return true;
};

export const isDefaultGroupCreated = function () {
  const isDefaultGroupCreated = state.group.groups.some(
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
    const groupName = state.group.activeGroup
      ? state.group.activeGroup
      : 'default';

    const cardObj = {
      id: Date.now(),
      groupName,
      name: word.word,
      audio: word.audio,
      phonetics: word.phonetics,
      partOfSpeech: word.meanings[index].partOfSpeech,
      activePartOfSpeech: state.click.clickedPart,
      definitions,
    };
    state.card.cards.push(cardObj);
  } catch (err) {
    console.log(err);
  }
};

export const createObjGroup = async function (name) {
  try {
    // const id = 1;
    const id = state.group.groups.length != 0 ? state.group.groups.length : 0;
    const group = {
      id,
      groupName: name,
      cards: [],
    };
    state.group.groups.push(group);
    saveGroupAsActive(name);
    // console.log('create new objGroup', state.group.groups);
  } catch (err) {
    console.log(err);
  }
};

export const persistGroups = function () {
  // localStorage.setItem('groups', JSON.stringify(state.group.groups));
  localStorage.setItem('group', JSON.stringify(state.group));
};

// export const addCardIntoGroup = async function (card) {
//   try {
//     const nameGroup = state.group.activeGroup;
//     const index = state.group.groups.findIndex(obj => obj.groupName === nameGroup);

//     state.group.groups[index].cards.push(card);
//     console.log('added card into new group', state.group.groups);
//     console.log('all groups', state.group.groups);

//     persistGroups();
//   } catch (err) {
//     console.log(err);
//   }
// };
export const addCardIntoGroup2 = async function (
  card,
  group = state.group.activeGroup
) {
  try {
    // const index = state.group.groups.findIndex(obj => obj.groupName === group);
    const index = findGroupsIndex(group);

    const cards = state.group.groups[index];
    if (!cards) return;
    cards.cards.push(card);

    // console.log('added card into  group', state.group.groups);
    persistGroups();
  } catch (err) {
    console.log(err);
  }
};
export const findGroupsIndex = function (name) {
  return state.group.groups.findIndex(obj => obj.groupName === name);
};

// export const addCardIntoDefaultGroup = async function (card) {
//   try {
//     const index = state.group.groups.findIndex(obj => obj.groupName === 'default');

//     console.log(index);
//     state.group.groups[index].cards.push(card);

//     console.log('added card into default group', state.group.groups);

//     persistGroups();
//   } catch (err) {
//     console.log(err);
//   }
// };

export const saveGroupAsActive = function (name) {
  state.group.activeGroup = name;
};

export const deleteCard = function (id) {
  console.log('I should delete this:', id);

  // 1. find card to delete
  let index;
  if (state.group.activeGroup) {
    index = state.group.groups.findIndex(
      obj => obj.groupName === state.group.activeGroup
    );
  } else {
    index = state.group.groups.findIndex(obj => obj.groupName === 'default');
  }
  const allRenderedCards = state.group.groups[index].cards;
  console.log('allRenderedCards', allRenderedCards);
  const deleteCardIndex = allRenderedCards.findIndex(obj => obj.id === id);

  //2. delete card
  // allRenderedCards.splice(deleteCardIndex, 1);
  state.group.groups[index].cards.splice(deleteCardIndex, 1);

  // updateNewListCards(group);

  persistGroups();
};
export const loadNewCard = function () {
  const newCard = state.card.cards[state.card.cards.length - 1];
  // console.log('I am new card', newCard);
  return newCard;
};
export const loadAllCardsFromGroup = function (group) {
  return state.group.groups
    .filter(obj => obj.groupName === group)
    .map(obj => obj.cards)
    .flat();
};
const clearGroups = function () {
  localStorage.clear('groups');
};

export const getCardResultsPage = function (card, page = state.card.page) {
  state.card.page = page;
  const start = (page - 1) * state.card.cardResultsPerPage; // 0
  const end = page * state.card.cardResultsPerPage; //9
  // console.log(start, end);
  // console.log('card', card.definitions);
  // console.log(state.card.activeCard);
  let renderDefinitions = card.definitions.slice(start, end);
  // console.log('renderDefinitions', renderDefinitions);
  const numPages = Math.ceil(
    card.definitions.length / state.card.cardResultsPerPage
  );
  card.renderDefinitions = renderDefinitions;
  card.numPages = numPages;
  card.page = page;
  // console.log(card);
  state.card.activeCard = card;
  return state.card.activeCard;
  // return card.definitions.slice(start, end);
};
export const getListResultsPage = function (page = state.list.page) {
  state.list.page = page;
  const start = (page - 1) * state.list.listResultsPerPage; // 0
  const end = page * state.list.listResultsPerPage; //9

  const numPages = Math.ceil(
    state.list.results.length / state.list.listResultsPerPage
  );

  state.list.numPages = numPages;
  console.log('I will cut results:', state.list.results.slice(start, end));
  const renderResults = state.list.results.slice(start, end);
  state.list.renderResults = renderResults;
  // return state.list.results.slice(start, end);
  console.log('state.🇱🇮 ', state.list);
  // state.list = data;
  return state.list;
  // return data;
};

export const uploadWord = function (newWord) {
  // console.log(Object.entries(newWord));

  const group = state.group.activeGroup ? state.group.activeGroup : 'default';
  const word = {
    id: Date.now(),
    name: newWord.definition,
    audio: newWord.audio,
    phonetics: newWord.phonetics,
    partOfSpeech: newWord.partOfSpeech,
    activePartOfSpeech: state.click.clickedPart,
    definitions: [newWord.explanation],
    // groupName: newWord.group,
    groupName: group,
  };

  return word;
};
export const sortCards = function (cards) {
  cards.sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
  return cards;
};

// clearGroups();

export const printDiv = function (divName) {
  const printContents = document.getElementById(divName).innerHTML;
  const originalContents = document.body.innerHTML;
  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
};

export const toggleActiveList = function () {
  state.list.active ? (state.list.active = false) : (state.list.active = true);
};
export const calculatePages = function () {
  //reset list page
  state.list.page = 1;
  // 9 calculate number of pages
  const numPages = Math.ceil(
    state.list.results.length / state.list.listResultsPerPage
  );

  state.list.numPages = numPages;
};

const initCookie = function () {
  const storage = localStorage.getItem('group');
  if (storage) {
    state.group = JSON.parse(storage);
  }
};

initCookie();
