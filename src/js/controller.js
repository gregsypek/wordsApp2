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

    // groupNavView.addHandlerCreate(controlClickCreateNewGroup);
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
    //0. hide createGroup form
    groupNavView.toggleShowHiddenForm();
    //1. get new created group name
    const group = groupNavView.getNewGroup();
    if (!group) return;

    //2. create obj with future cards inside
    model.createObjGroup(group);

    //3. clear cards by render message
    cardsView.renderMessage();

    model.state.card.messageDisplay = true;

    //4. save group as active
    model.saveGroupAsActive(group);
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
const controlPreviewGroup = function () {
  //1. save the name of the selected group
  const group = window.location.hash.slice(1);

  if (!group) return;
  //2. close modal window
  allGroupsView.addHandlerPreview();
  //3.change activeGroup to be able deleting cards
  model.state.group.activeGroup = group;
  //4. render all cards from selected group
  controlLoadAllCardsFromGroup(group);
  //5. render bar navigation
  groupBarView.render(group);
};

const controlCardPagination = function (cardId, goToPage) {
  //1.find card where user click page btn
  const cardToChange = model.state.card.cards.filter(
    card => card.id === cardId
  );

  //2.update body and footer of selected card
  cardsView.updateMarkup(model.getCardResultsPage(cardToChange[0], goToPage));

  // } else return;ń
};

const welcomeBack = function () {
  // allGroupsView.render(model.state.group.groups);
  const activeGroup = model.state.group.activeGroup;
  if (!activeGroup) {
    //TODO if there is a better way to reset url do it!
    //reset url
    window.history.pushState(null, '', `#${''}`);

    return;
  }

  //load all cards from groups into cards array  to be able change page on each card
  if (!model.state.group.groups) return;
  model.state.card.cards = model.state.group.groups.flatMap(group =>
    model.loadAllCardsFromGroup(group.groupName)
  );

  //render all cards and group name in group bar navigation
  groupBarView.render(activeGroup);
  controlLoadAllCardsFromGroup(activeGroup);
  groupMessageView.renderMessage('Welcome back :)');
  setTimeout(() => groupMessageView.render(''), MODAL_CLOSE_SEC * 1000);
  // allGroupsView.render(model.state.group.groups);
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
    // window.history.pushState(null, '', `#${newName}`);
    return;
  }
  oldGroup.groupName = newName;

  oldGroup.cards.map(card => (card.groupName = newName));
  // model.state.group.groups.splice(index, 0, oldGroup);

  window.history.pushState(null, '', `#${newName}`);
  model.persistGroups();
  // model.initCookie();
  groupBarView.render(newName);
  // allGroupsView.render(model.state.group.groups);
};

const init = function () {
  console.log(model.state.group.groups);
  welcomeBack();
  searchView.addHandlerSearch(controlSearchWords);
  wordView.addHandlerRender();

  groupNavView.addHandlerClick(controlShowCreateGroupForm);

  groupNavView.addHandlerCreateGroup(controlClickCreateNewGroup);
  groupNavView.addHandlerRenameGroup(controlRenameGroup);
  cardsView.addHandlerPlay(controlPlayAudio);
  cardsView.addHandlerClose(controlDeleteCard);
  cardsView.addHandlerPage(controlCardPagination);

  groupBarView.addHandlerShowNewGroupForm(controlShowNewGroupFormFromBar);
  groupBarView.addHandlerShowRenameGroupForm(controlShowRenameGroupFromBar);

  allGroupsView.addHandleClick(controlLoadAllGroups);
  allGroupsView.addHandlerRender(controlPreviewGroup);
  createWordView.addHandlerUpload(controlAddWord);
};
init();
//TODO PREVENT FROM CREATING GROUP WITH THE SAME NAME
