import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import wordView from './views/wordView.js';
import searchView from './views/searchView.js';
import cardsView from './views/cardsView.js';
// import welcomeView from './views/welcomeView.js';
import wordClickView from './views/wordClickView.js';
import createWordView from './views/createWordView';

import groupMessageView from './views/groupMessageView.js';
import groupNavView from './views/groupNavView.js';
import groupBarView from './views/groupBarView.js';
import allGroupsView from './views/allGroupsView.js';
import initialCreateNewGroupView from './views/initialCreateNewGroupView.js';
import listView from './views/listView.js';

import 'regenerator-runtime/runtime'; //polyfiling async await functions
import 'core-js/stable'; // allows old browser display our code
import { Object } from 'core-js';

const controlSearchWords = async function () {
  try {
    //1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // const id = window.location.hash.slice(1);
    // console.log(id);
    // if (!id) return;

    wordView.renderSpinner();

    //2. Load search result
    // await model.loadSearchWord(id);
    await model.loadSearchWord(query);

    //3. Render result
    wordView.render(model.state);

    //4. Add word and query into search object
    model.saveSearchedWord(model.state.word);

    wordView.addHandlerClick(controlClickPartOfSpeech);
  } catch (err) {
    wordView.renderMessageError();
  }
};

const controlClickPartOfSpeech = function (markPartClicked) {
  //reset data
  // console.log(model.state.click);
  model.resetClickObject();

  // console.log(model.state.click);

  model.saveClickedData(markPartClicked);

  wordClickView.render(model.state);

  wordView.addHandlerClick(controlClickPartOfSpeech);

  wordClickView.handleClickPlusBtn(controlAddNewCard);

  // model.isGroupCreated();

  if (!model.isAnyGroupCreated()) groupMessageView.renderMessageError();
};

const controlClickCreateNewGroup = async function () {
  try {
    //0. hide createGroup form and initial create new Group
    groupNavView.toggleShowHiddenForm();
    initialCreateNewGroupView.clear();
    //1. get new created group name
    const group = groupNavView.getNewGroup();
    if (!group) return;

    //2. create obj with future cards inside
    model.createObjGroup(group);

    //3. clear cards by render message
    cardsView.renderMessage();

    model.state.card.messageDisplay = true;

    //4. save group as active
    // model.saveGroupAsActive(group);
    // console.log(group);
    // // 5 change flag newGroup
    // model.state.newGroup = true;
    //6. render spinner load
    groupBarView.renderSpinner();

    //7. render group-bar navigation
    groupBarView.render(model.state.group.activeGroup);

    //8. delete warning message nogroup (trick render empty string and clean parent element before)
    if (model.state.group.activeGroup) {
      groupMessageView.render('');
    }

    //9. change Id in URL
    window.history.pushState(null, '', `#${group}`);
    model.persistGroups();
    console.log(model.state.group.activeGroup);
  } catch (err) {
    console.log(err);
  }
};
const controlShowRenameGroupFromBar = function () {
  //hide other form
  groupNavView.hideCreateForm();
  //show rename form
  groupNavView.toggleShowHiddenRenameForm();
};
////////////////////////////////
const controlAddNewCard = async function () {
  //1.create card object
  model.createObjCard();
  //1. reset footer page start
  model.state.card.page = 1;
  //2. load new card
  const newCard = model.loadNewCard();

  //3. load all previous cards if exists
  const activeGroup = newCard.groupName;

  const allPreviousCards = [...model.loadAllCardsFromGroup(activeGroup)];

  //4 check if new card is unique
  if (allPreviousCards.length > 0) {
    if (allPreviousCards.some(card => !model.isCardUnique(card, newCard))) {
      groupMessageView.renderMessage(
        "You can't add the same card into this group. Try another one"
      );
      setTimeout(() => groupMessageView.render(''), MODAL_CLOSE_SEC * 1000);
      return;
    }
    groupMessageView.render();
  }

  // cardsView.addHandlerNewFooter();
  //5.render new card
  model.state.card.activeCard = newCard;
  //a. check if there is a message
  if (model.state.card.messageDisplay) {
    //a. clear message
    // cardsView.render(newCard);
    cardsView.render(model.getCardResultsPage(newCard));
    model.state.card.messageDisplay = false;

    // cardsView.addHandlerNewFooter();
  } else {
    //b. add card next to previous one
    cardsView.renderCard(model.getCardResultsPage(newCard));
    // cardsView.addHandlerNewFooter();
  }

  //6 render initial pagination buttons

  // controlLoadFooterCard(newCard);
  //7. save card into state object
  model.saveCardIntoCorrectGroup(newCard);
};

const controlLoadAllCardsFromGroup = function (group) {
  //1.get all cards
  const cards = model.loadAllCardsFromGroup(group);

  // console.log('cards to load', cards);
  //2.clear cards container
  cardsView.clear();
  //3.render cards
  // console.log('cards to load', cards);
  //HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  cards.map(card => cardsView.renderCard(card));
};

const controlPlayAudio = function (url) {
  // if (!url) return;
  const audio = new Audio(url);
  audio.play();
};
const controlDeleteCard = function (cardId) {
  //1. delete card from state object
  model.deleteCard(+cardId);

  //2. check which group render again default or active
  if (model.state.group.activeGroup) {
    controlLoadAllCardsFromGroup(model.state.group.activeGroup);
    console.log(model.state.group.activeGroup);
  } else {
    controlLoadAllCardsFromGroup('default');
  }
};

const controlShowCreateGroupForm = function () {
  //show create form
  groupNavView.toggleShowHiddenForm();
};

//THIS IS A PLUS BTN
const controlShowNewGroupFormFromBar = function () {
  //   //hide other form
  groupNavView.hideRenameForm();
  // console.log(model.state);
  groupNavView.toggleShowHiddenForm();
};

const controlLoadAllGroups = function () {
  allGroupsView.render(model.state.group.groups);
};
const controlLoadBar = function (group) {
  //check if there is any group created
  if (model.state.group.groups.length > 0) groupBarView.render(group);
};

// const controlPreviewGroup = async function () {
//   try {
//     //1. save the name of the selected group
//     const group = window.location.hash.slice(1);

//     if (!group) return;
//     //2. close modal window
//     allGroupsView.addHandlerPreview();
//     //3.change activeGroup to be able deleting cards
//     model.state.group.activeGroup = group;
//     //4. render all cards from selected group
//     controlLoadAllCardsFromGroup(group);
//     //5. render bar navigation
//     groupBarView.render(group);
//   } catch (err) {
//     console.log(err);
//   }
// };

const controlCardPagination = function (cardId, goToPage) {
  //1.find card where user click page btn
  const cardToChange = model.state.card.cards.filter(
    card => card.id === cardId
  );

  //2.update body and footer of selected card
  cardsView.updateMarkup(model.getCardResultsPage(cardToChange[0], goToPage));

  // } else return
};
const controlListPagination = function (goToPage) {
  listView.render(model.getListResultsPage(goToPage));
  listView.updateFooter(model.getListResultsPage(goToPage));
};

const welcomeBack = function () {
  console.log(model.state.group.activeGroup);
  console.log(model.state.group.groups);
  initialCreateNewGroupView.clear();
  // groupBarView.addHandlerRender(controlLoadBar(model.state.group.activeGroup));
  // allGroupsView.render(model.state.group.groups);
  // const lastGroup =
  //   model.state.group.groups[model.state.group.groups.length - 1].groupName;
  const activeGroup = model.state.group.activeGroup
    ? model.state.group.activeGroup
    : '';
  // model.state.group.groups[model.state.group.groups.length - 1].groupName;

  // if (!lastGroup) {
  if (!activeGroup) {
    //TODO if there is a better way to reset url do it!
    initialCreateNewGroupView.render();
    window.history.pushState(null, '', `#${''}`);
    return;
  }

  //load all cards from groups into cards array  to be able change page on each card

  model.state.card.cards = model.state.group.groups.flatMap(group =>
    model.loadAllCardsFromGroup(group.groupName)
  );

  //render all cards and group name in group bar navigation
  //OLD VERSION
  groupBarView.render(activeGroup);
  controlLoadAllCardsFromGroup(activeGroup);
  // groupBarView.render(window.location.hash.slice(1));
  // controlLoadAllCardsFromGroup(window.location.hash.slice(1));
  // allGroupsView.render(model.state.group.groups);
  groupMessageView.renderMessage('Welcome back :)');
  // allGroupsView.render(model.state.group.groups);
  setTimeout(() => groupMessageView.render(''), MODAL_CLOSE_SEC * 1000);
};
const welcome = function () {
  initialCreateNewGroupView.render();
};

const controlAddWord = function (newWord) {
  //1. Upload the new word data
  const newCard = model.uploadWord(newWord);

  //2. check if new card is unique
  const activeGroup = newCard.groupName;
  const allPreviousCards = [...model.loadAllCardsFromGroup(activeGroup)];

  //3.prevent to add the same card
  if (allPreviousCards.length > 0) {
    if (allPreviousCards.some(card => !model.isCardUnique(card, newCard))) {
      groupMessageView.renderMessage(
        `There is already  "${newCard.name.toUpperCase()}" word in "${activeGroup.toUpperCase()}" group! Try another one`
      );
      setTimeout(() => groupMessageView.render(''), MODAL_CLOSE_SEC * 1000);
      createWordView.toggleWindow();
      return;
    }
    groupMessageView.render();
  }

  //4. Render new created word
  model.state.card.cards.push(newCard);

  if (model.state.card.messageDisplay) {
    //a. clear message
    cardsView.render(model.getCardResultsPage(newCard));
    model.state.card.messageDisplay = false;
  } else {
    //b. add card next to previous one
    cardsView.renderCard(model.getCardResultsPage(newCard));
  }

  //5.change ID in URL
  window.history.pushState(null, '', `#${activeGroup}`);

  //6. save card into group
  model.saveCardIntoCorrectGroup(newCard);

  //7. Display success message
  groupMessageView.renderMessage('New word was successfully created :)');

  //8. hide success message
  setTimeout(() => groupMessageView.render(''), MODAL_CLOSE_SEC * 1000);

  //9. Close form window
  createWordView.toggleWindow();
};

const controlRenameGroup = function () {
  //get old name of the group
  const oldName = window.location.hash.slice(1);

  //get new name from the rename form
  const newName = groupNavView.getNewName();

  //replace old name with new name
  model.saveGroupAsActive(newName);

  // const index = model.state.group.groups.findIndex(
  //   obj => obj.groupName === oldName
  // );

  const index = model.findGroupsIndex(oldName);
  const groups = model.state.group.groups;
  const oldGroup = groups[index];
  if (!oldGroup) {
    groupBarView.render(newName);
    window.history.pushState(null, '', `#${newName}`);
    return;
  }
  oldGroup.groupName = newName;

  oldGroup.cards.map(card => (card.groupName = newName));
  // model.state.group.groups.splice(index, 0, oldGroup);

  window.history.pushState(null, '', `#${newName}`);

  groupBarView.render(newName);

  model.persistGroups();
  // model.initCookie();
  // allGroupsView.render(model.state.group.groups);
};
const controlDeleteGroup = function () {
  //find active group
  console.log(model.state.group.activeGroup);
  const index = model.findGroupsIndex(model.state.group.activeGroup);

  // delete it
  model.state.group.groups.splice(index, 1);
  console.log('1', model.state.group.activeGroup);

  //change active group
  if (model.state.group.groups.length > 0) {
    model.state.group.activeGroup =
      model.state.group.groups[model.state.group.groups.length - 1].groupName;
  } else {
    model.state.group.activeGroup = '';
    groupBarView.clear();
    initialCreateNewGroupView.render();
    window.history.pushState(null, '', `#${''}`);
    cardsView.clear();
  }
  //load all groups in modal view
  controlLoadAllGroups();

  //load all cards from last group
  controlLoadAllCardsFromGroup(model.state.group.activeGroup);

  //change navigation with proper name group
  groupBarView.addHandlerRender(controlLoadBar(model.state.group.activeGroup));

  //reset url
  window.history.pushState(null, '', `#${model.state.group.activeGroup}`);
  console.log('2', model.state.group.activeGroup);

  model.persistGroups();
};
const controlLoadSelectedGroup = function (goToGroup) {
  //1. save the name of the selected group
  const group = goToGroup;

  if (!group) return;
  //2. close modal window
  allGroupsView.addHandlerPreview();
  //3.change activeGroup to be able deleting cards
  // model.state.group.activeGroup = group;
  model.saveGroupAsActive(group);
  console.log('i changed active group to: ', group);
  //4. render all cards from selected group
  controlLoadAllCardsFromGroup(group);
  //5. render bar navigation
  groupBarView.render(group);
  model.persistGroups();
  //6 render  sorted alphabetically print list

  let cards = model.sortCards(model.loadAllCardsFromGroup(goToGroup));

  //7 save cards into state object
  model.state.list.results = cards;
  console.log('here', cards);
  ``;

  //8 reset list page to 1
  model.state.list.page = 1;

  // 9 calculate number of pages
  const numPages = Math.ceil(
    model.state.list.results.length / model.state.list.listResultsPerPage
  );

  model.state.list.numPages = numPages;
  console.log(model.state.list);
  console.log(model.getListResultsPage());

  // 10 render list with new data
  listView.render(model.state.list);
  // listView.render(model.getListResultsPage());
};

const controlSortCards = function () {
  // get all cards from active group
  const activeGroup = model.state.group.activeGroup;
  const cards = model.loadAllCardsFromGroup(model.state.group.activeGroup);
  console.log('i will sort this:', cards);
  model.sortCards(cards);

  //display spinner
  cardsView.renderSpinner();

  //replace cards in state object
  const index = model.findGroupsIndex(activeGroup);
  model.state.group.groups[index].cards = cards;

  //clear spinner
  cardsView.clear();

  //render sorted cards
  cards.map(card => cardsView.renderCard(card));
};

const controlPrintCards = function (printDiv) {
  // window.location = 'printCards.html';
  model.printDiv(printDiv);
  // window.print();
  location.reload();

  //
};
const controlPrintList = function (printDiv) {
  // let cards = model.sortCards(
  //   model.loadAllCardsFromGroup(model.state.group.activeGroup)
  // );

  model.state.list.page = 1;

  model.state.list.listResultsPerPage = model.state.list.results.length;

  // 9 calculate number of pages
  const numPages = Math.ceil(
    model.state.list.results.length / model.state.list.listResultsPerPage
  );

  model.state.list.numPages = numPages;

  //render list with new data
  listView.render(model.state.list);
  model.printDiv(printDiv);
  location.reload();
};

const init = function () {
  welcome();
  welcomeBack();
  searchView.addHandlerSearch(controlSearchWords);
  // wordView.addHandlerRender();
  initialCreateNewGroupView.addHandlerClick(controlShowCreateGroupForm);
  groupNavView.addHandlerCreateGroup(controlClickCreateNewGroup);
  groupNavView.addHandlerRenameGroup(controlRenameGroup);
  cardsView.addHandlerPlay(controlPlayAudio);
  cardsView.addHandlerClose(controlDeleteCard);
  cardsView.addHandlerPage(controlCardPagination);
  groupBarView.addHandlerShowNewGroupForm(controlShowNewGroupFormFromBar);
  groupBarView.addHandlerShowRenameGroupForm(controlShowRenameGroupFromBar);
  allGroupsView.addHandleClick(controlLoadAllGroups);
  // allGroupsView.addHandlerRender(controlPreviewGroup);
  allGroupsView.addHandlerLoadSelectedGroup(controlLoadSelectedGroup);
  createWordView.addHandlerUpload(controlAddWord);
  groupBarView.addHandlerDeleteGroup(controlDeleteGroup);
  groupBarView.addHandlerSortCards(controlSortCards);
  groupBarView.addHandlerPrintCards(controlPrintCards);
  listView.addHandlerPage(controlListPagination);
  listView.addHandlerPrintList(controlPrintList);
};
init();
//TODO PREVENT FROM CREATING GROUP WITH THE SAME NAME
