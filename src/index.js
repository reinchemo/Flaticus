// // 1. See all characters names in a `div` with the id of `"character-bar"`. Create
// // a `span` tag with the character's name and add it the `div#character-bar`
// // once you have retrieved the character data from the server. You will need to
// // make a GET request to the following endpoint to retrieve the character data:
// //const BASE_URL = "http://localhost:3000/characters"

//////////////////////////////////////////////////////////////////////
//                  HAVE JSON SERVER RUNNING FIRST!                 //
/////////////////                                    /////////////////
//  https://codesandbox.io/s/flatacuties-code-challenge-json-zpdu6  //
//    BACKUP: https://codesandbox.io/s/1pxhw?file=/src/api.json     //
//             Change BASE_URL if you use the backup                //
//////////////////////////////////////////////////////////////////////

//LAST UPDATE 8/23/2021 in README
const BASE_URL = "https://zpdu6.sse.codesandbox.io/characters";

const characterBar = document.getElementById("character-bar");
const voteForm = document.getElementById("votes-form");
const addCharacterForm = document.getElementById("character-form");
const addCharacterFormH4 = document.querySelector("#character-form h4");
const detailInfoName = document.querySelector("#detailed-info #name");
const detailBoxName = document.getElementById("name");
const detailBoxImage = document.getElementById("image");
const detailBoxVotes = document.getElementById("vote-count");
const detailedInfoDiv = document.getElementById("image-container");
const filterBtnContainer = document.getElementById("filterBtnContainer");
let featuredCharacter;
let clientSideRealtimeData;
//I try using a foreach loop to create listBtns and make them variables pushed into toggleBtnsArray. Which are accessible by the global scope
const toggleBtnsToCreate = [
  "votesFeaturedToggleBtn",
  "addFeaturedToggleBtn",
  "releaseFeaturedToggleBtn",
  "editFeaturedToggleBtn"
];
let toggleBtnsArray = [];
const toggleBtnContainer = document.createElement("DIV");
toggleBtnContainer.id = "toggleBtnContainer";
toggleBtnContainer.style = "position: fixed; top: 30%; left: 75vw; width: 0vw;";
const oLToggleBtns = document.createElement("OL");
document.body.append(toggleBtnContainer);
toggleBtnContainer.append(oLToggleBtns);
addCharacterForm.style = "margin-top: 100px;";
addCharacterFormH4.style = "margin-bottom: 20px;";
init();

function init() {
  getData(BASE_URL);
  voteForm.addEventListener("submit", addVotes);
  toggleBtnsToCreate.forEach(createToggleBtns);
  addCharacterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    refreshDataBeforeEdit(BASE_URL);
  });
  //add clickevent to filter buttons
}

function getData(BASE_URL) {
  fetch(BASE_URL)
    .then((resp) => resp.json())
    .then((data) => {
      loadFirstChild(data);
      data.forEach(appendDisplayNames);
      clientSideRealtimeData = data;
      createFirstLetterArray(clientSideRealtimeData);
      return clientSideRealtimeData;
    });
}

function refreshDataBeforeEdit(BASE_URL) {
  fetch(BASE_URL)
    .then((resp) => resp.json())
    .then((data) => {
      addNewCharacter(data);
    });
}

function appendDisplayNames(data) {
  characterBar.className = "scrolling-wrapper";
  const cBDiv = document.createElement("DIV");
  cBDiv.className = "card";
  cBDiv.id = `cBD${data.id}`;
  const cBBreak = document.createElement("BR");
  const cBImage = document.createElement("IMG");
  cBImage.src = data.image;
  cBImage.style = "height: 100px; width: 100px;";
  const cBAnchor = document.createElement("A");
  cBAnchor.href = "#";
  cBAnchor.id = `cBA${data.id}`;
  cBAnchor.style = `text-decoration:none; text-align: center;`;
  const cBSpan = document.createElement("SPAN");
  cBSpan.style = "color: white;";
  cBSpan.textContent = data.name;
  characterBar.append(cBDiv);
  cBDiv.append(cBAnchor);
  cBAnchor.append(cBImage);
  cBAnchor.append(cBBreak);
  cBAnchor.append(cBSpan);
  cBAnchor.addEventListener("click", () => displayClickedChar(data));
}

// 2. When the character in the `div#character-bar` is clicked, display the
//    character's details in the `div#detailed-info`.

function loadFirstChild(data) {
  detailBoxName.textContent = data[0].name;
  detailBoxImage.src = data[0].image;
  detailBoxVotes.textContent = data[0].votes;
  featuredCharacter = data[0];
  return featuredCharacter;
}

function displayClickedChar(data) {
  detailBoxName.textContent = data.name;
  detailBoxImage.src = data.image;
  detailBoxVotes.textContent = data.votes;
  featuredCharacter = data;
  return featuredCharacter;
}

// 3. When the `form#votes-form` is submitted, add the number of votes from
//    the input field to the character displayed in the `div#detailed-info`. **No
//    persistence is needed**.

function addVotes(event) {
  event.preventDefault();
  let voteInput = document.getElementById("votes").value;
  voteInput === ""
    ? (voteInput = 1)
    : (voteInput = document.getElementById("votes").value);
  let initialVotesCount = parseInt(detailBoxVotes.textContent, 0);
  let newVoteCount = initialVotesCount + parseInt(voteInput, 0);
  detailBoxVotes.textContent = newVoteCount;
  let updateData = {
    id: `${featuredCharacter.id}`,
    votes: `${newVoteCount}`
  };
  //update clicked votes without refresh because it's using old data
  updateVotesToDB(updateData);
  updateHeaderDataAfterVotesChange(newVoteCount);
  event.target.reset();
}

function updateHeaderDataAfterVotesChange(newVoteCount) {
  return (featuredCharacter.votes = newVoteCount);
}

// 1. When the Reset Votes button is clicked, reset the votes back to 0.

function resetVotes() {
  let updateData = {
    id: `${featuredCharacter.id}`,
    votes: 0
  };
  updateVotesToDB(updateData);
  updateHeaderDataAfterVotesChange(0);
  detailBoxVotes.textContent = 0;
}

// 2. When the `form#character-form` is submitted, add a new character to the
//    `div#character-bar`. The new character in the character bar should behave the
//    same as the other characters when clicked (its details should be displayed
//    below, and it should have functionality to add votes).
// 3. In addition to adding the character to the `div#character-bar` upon
//    submitting the form, the character's details should show up immediately in
//    the `div#detailed-info`.

function addNewCharacter(data) {
  let addCharacterNameInput = document.querySelector("#character-form #name")
    .value;
  addCharacterNameInput === ""
    ? (addCharacterNameInput = Math.floor(Math.random() * 100))
    : (addCharacterNameInput = document.querySelector("#character-form #name")
        .value);
  let addCharacterImageInput = document.getElementById("image-url").value;
  addCharacterImageInput === ""
    ? (addCharacterImageInput = `assets/PC-${Math.floor(
        Math.random() * 9
      )}.png`)
    : (addCharacterImageInput = document.getElementById("image-url").value);
  let newDataAddToDB = {
    name: `${addCharacterNameInput}`,
    image: `${addCharacterImageInput}`,
    votes: "0"
  };
  addToDB(newDataAddToDB);
  let newDataWithID = {
    id: ++clientSideRealtimeData[clientSideRealtimeData.length - 1].id,
    name: `${addCharacterNameInput}`,
    image: `${addCharacterImageInput}`,
    votes: "0"
  };
  clientSideRealtimeData = [...data, { ...newDataWithID }];

  appendDisplayNames(newDataWithID);
  featuredNewCharacterAfterAdd(newDataWithID);
  document.querySelector("#character-form #name").value = "";
  filterBtnContainer.textContent = ""; ////where i decide to make the buttons refresh to catch any new first letter names
  createFirstLetterArray(clientSideRealtimeData);
  return clientSideRealtimeData;
}

function featuredNewCharacterAfterAdd(newDataWithID) {
  detailBoxName.textContent = newDataWithID.name;
  detailBoxImage.src = newDataWithID.image;
  detailBoxVotes.textContent = newDataWithID.votes;
  featuredCharacter = newDataWithID;
  return featuredCharacter;
}

function deleteFeaturedCharacter() {
  document.getElementById(`cBD${featuredCharacter.id}`).remove();
  let indexFoundAt = findIndexOfFeaturedCharacterInArray(featuredCharacter);
  clientSideRealtimeData.splice(indexFoundAt, 1);
  // ^^ABOVE^^ remove the element from clientside, indexed position to displayNextFeaturedCharacter
  deleteFromDB(featuredCharacter);
  displayNextFeaturedCharacter(indexFoundAt);
  filterBtnContainer.textContent = ""; ////where i decide to make the buttons refresh to catch any new first letter names
  createFirstLetterArray(clientSideRealtimeData);
  return clientSideRealtimeData;
}

function findIndexOfFeaturedCharacterInArray(featuredCharacter) {
  //pushing ids to an index so i can index which object gets deleted when client removes character
  let indexArrayClientCharacters = [];
  clientSideRealtimeData.forEach((element) =>
    indexArrayClientCharacters.push(element.id)
  );
  const indexFoundAt = indexArrayClientCharacters.findIndex(
    (element) => element === featuredCharacter.id
  );
  return indexFoundAt;
}

function displayNextFeaturedCharacter(indexBeforeDeletion) {
  if (indexBeforeDeletion >= 0) {
    if (clientSideRealtimeData[indexBeforeDeletion] !== undefined) {
      featuredCharacter = clientSideRealtimeData[indexBeforeDeletion];
      detailBoxName.textContent =
        clientSideRealtimeData[indexBeforeDeletion].name;
      detailBoxImage.src = clientSideRealtimeData[indexBeforeDeletion].image;
      detailBoxVotes.textContent =
        clientSideRealtimeData[indexBeforeDeletion].votes;
      return featuredCharacter;
    } else {
      featuredCharacter =
        clientSideRealtimeData[clientSideRealtimeData.length - 1];
      detailBoxName.textContent =
        clientSideRealtimeData[clientSideRealtimeData.length - 1].name;
      detailBoxImage.src =
        clientSideRealtimeData[clientSideRealtimeData.length - 1].image;
      detailBoxVotes.textContent =
        clientSideRealtimeData[clientSideRealtimeData.length - 1].votes;
      return featuredCharacter;
    }
  } else {
    featuredCharacter = clientSideRealtimeData[0];
    detailBoxName.textContent = clientSideRealtimeData[0].name;
    detailBoxImage.src = clientSideRealtimeData[0].image;
    detailBoxVotes.textContent = clientSideRealtimeData[0].votes;
    return featuredCharacter;
  }
}

// 1. When a user adds or resets the votes for a character, in addition to
//    displaying the updated votes on the page, the votes should **also** be
//    updated on the server. You will need to make a request that follows this
//    structure:

function addToDB(addData) {
  fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(addData)
  })
    .then((resp) => resp.json())
    .then((data) => data);
}

function updateVotesToDB(updateData) {
  fetch(`${BASE_URL}/${updateData.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updateData)
  })
    .then((resp) => resp.json())
    .then((data) => data.votes);
}

function updateEditedFeaturedCharacterToDB(updateData) {
  fetch(`${BASE_URL}/${updateData.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updateData)
  })
    .then((resp) => resp.json())
    .then((data) => data);
}

function deleteFromDB(featuredCharacter) {
  fetch(`${BASE_URL}/${featuredCharacter.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  });
}

function preventDBClearOutCheck() {
  if (clientSideRealtimeData.length > 1) {
    deleteFeaturedCharacter();
  } else {
    console.log("There always must be ONE!");
    return clientSideRealtimeData;
  }
}
//Testing out destructure with forEach loop
function createToggleBtns(element) {
  const elementLI = document.createElement("LI");
  elementLI.style = "list-style-type: none;";
  const elementBtn = document.createElement("BUTTON");
  elementBtn.id = `${element}`;
  elementBtn.style = `border-radius: 50px; height:50px; width:50px; background-image: url('assets/${element}.png'); background-repeat: no-repeat; background-position: center;`;
  oLToggleBtns.append(elementLI);
  elementLI.append(elementBtn);
  toggleBtnsArray.push(elementBtn);
  elementBtn.id === "releaseFeaturedToggleBtn"
    ? elementBtn.addEventListener("click", preventDBClearOutCheck)
    : elementBtn.addEventListener("click", () => toggleVisual(elementBtn.id));
  elementBtn.onmouseenter = function () {
    elementBtn.style.backgroundColor = "rgb(173, 0, 0)";
  };
  elementBtn.onmouseleave = function () {
    elementBtn.style.backgroundColor = "rgb(49, 109, 179)";
  };
  elementBtn.onmousedown = function () {
    elementBtn.style.backgroundColor = "rgb(126, 0, 0)";
  };
}

function toggleVisual(buttonClicked) {
  if (
    buttonClicked === "votesFeaturedToggleBtn" &&
    voteForm.style.visibility === "hidden"
  ) {
    voteForm.style.visibility = "visible";
    voteForm.scrollIntoView();
  } else {
    voteForm.style.visibility = "hidden";
  }
  if (
    buttonClicked === "addFeaturedToggleBtn" &&
    addCharacterForm.style.visibility === "hidden"
  ) {
    addCharacterForm.style.visibility = "visible";
    addCharacterForm.scrollIntoView();
  } else {
    addCharacterForm.style.visibility = "hidden";
  }
  if (buttonClicked === "editFeaturedToggleBtn") {
    editFeaturedCharacter();
    detailBoxName.scrollIntoView();
  }
}

function editFeaturedCharacter() {
  if (document.getElementById("resetBtn") === null) {
    createEditVoteCountResetBtn();
    createEditImageBtn();
    detailInfoName.contentEditable = "true";
    detailInfoName.style.color = "lightgrey";
    editFeaturedToggleBtn.style.backgroundImage =
      "url('assets/saveToggleBtn.png')";
    editFeaturedToggleBtn.style.backgroundColor = "rgb(173, 0, 0)";
    votesFeaturedToggleBtn.disabled = true;
    votesFeaturedToggleBtn.style.backgroundColor = "black";
    addFeaturedToggleBtn.disabled = true;
    addFeaturedToggleBtn.style.backgroundColor = "black";
    releaseFeaturedToggleBtn.disabled = true;
    releaseFeaturedToggleBtn.style.backgroundColor = "black";
  } else {
    clickSaveEdits();
    reEnableBtns();
  }
}

function clickSaveEdits() {
  const imageContainerP = document.querySelector("#image-container p");
  if (imageContainerP !== null) {
    const testURL = imageContainerP.textContent;
    if (testURL.length > 14) {
      featuredCharacter.image = imageContainerP.textContent;
      imageContainerP.remove();
      detailBoxImage.style = "height: 300px; width:300px;";
      detailBoxVotes.style.visibility = "visible";
    } else {
      detailBoxImage.style = "height: 300px; width:300px;";
      detailBoxVotes.style.visibility = "visible";
      imageContainerP.remove();
    }
  }
  toggleOffEdit();
  let edittedFeatureCharacterData = {
    id: featuredCharacter.id,
    name: detailInfoName.textContent,
    image: featuredCharacter.image,
    votes: document.getElementById("vote-count").textContent
  };
  let indexFoundAt = findIndexOfFeaturedCharacterInArray(
    edittedFeatureCharacterData
  );
  //CHANGE IMAGE AND NAME IN HEADER
  const featuredCharacterInHeaderImage = document.querySelector(
    `#cBD${featuredCharacter.id} img`
  );
  const featuredCharacterInHeaderName = document.querySelector(
    `#cBD${featuredCharacter.id} span`
  );
  featuredCharacterInHeaderImage.src = edittedFeatureCharacterData.image;
  featuredCharacterInHeaderName.textContent = edittedFeatureCharacterData.name;
  //CHANGE display = edittedfeatureCharacterData
  detailBoxName.textContent = edittedFeatureCharacterData.name;
  detailBoxImage.src = edittedFeatureCharacterData.image;
  detailBoxVotes.textContent = edittedFeatureCharacterData.votes;
  //change full data in clientside array [problem the data the clicker reads from is the initial pull]
  clientSideRealtimeData.splice(indexFoundAt, 1, edittedFeatureCharacterData);
  featuredCharacter.name = edittedFeatureCharacterData.name;
  featuredCharacter.image = edittedFeatureCharacterData.image;
  featuredCharacter.votes = edittedFeatureCharacterData.votes;
  //push change to DB
  updateEditedFeaturedCharacterToDB(edittedFeatureCharacterData);
  //push updateclientSideRealtimeData
  return clientSideRealtimeData;
}

function createEditVoteCountResetBtn() {
  const resetBtn = document.createElement("BUTTON");
  resetBtn.id = "resetBtn";
  resetBtn.textContent = "x";
  resetBtn.style =
    "font-size: 12px; border-radius: 10px; border: 1px; margin-top: 0px; height: 20px; width: 20px; flex-direction: column; align-items: center; position: relative; margin-left: 5px; bottom:10px;";
  resetBtn.addEventListener("click", resetVotes);
  const h4DetailInfoBox = document.getElementById("vote-countH4");
  h4DetailInfoBox.append(resetBtn);
  detailBoxVotes.style.color = "lightgrey";
  detailBoxVotes.contentEditable = "true";
}

function createEditImageBtn() {
  const imageBtn = document.createElement("BUTTON");
  imageBtn.id = "imageBtn";
  imageBtn.textContent = "x";
  imageBtn.style =
    "font-size: 18px; border-radius: 25px; border: 1px; height: 30px; width: 30px; flex-direction: column; align-items: center; position: absolute;";
  detailedInfoDiv.insertBefore(imageBtn, detailedInfoDiv.children[1]);
  imageBtn.addEventListener("click", changeFeaturedImage);
}

function changeFeaturedImage() {
  const imageTextBox = document.createElement("P");
  imageTextBox.style =
    "overflow: hidden; font-size: 12px; height: 300px; width: 20vw; text-align:center; position: relative; left:41%; text-align:center; display:flex; align-items: center; justify-content:center; background-color: rgb(241, 241, 241);";
  imageTextBox.contentEditable = "true";
  detailedInfoDiv.append(imageTextBox);
  detailBoxImage.style = "max-height: 0px; max-width: 0px;";
  detailBoxImage.style.visibility = "hidden";
  document.querySelector("#imageBtn").remove();
}

function toggleOffEdit() {
  document.getElementById("resetBtn").remove();
  detailBoxVotes.style.color = "black";
  detailInfoName.style.color = "black";
  detailBoxVotes.contentEditable = "false";
  detailInfoName.contentEditable = "false";
  if (document.querySelector("#imageBtn") !== null) {
    document.querySelector("#imageBtn").remove();
  }
}

function reEnableBtns() {
  editFeaturedToggleBtn.style.backgroundImage =
    "url('assets/editFeaturedToggleBtn.png')";
  votesFeaturedToggleBtn.disabled = false;
  votesFeaturedToggleBtn.style.backgroundColor = "rgb(49, 109, 179)";
  addFeaturedToggleBtn.disabled = false;
  addFeaturedToggleBtn.style.backgroundColor = "rgb(49, 109, 179)";
  releaseFeaturedToggleBtn.disabled = false;
  releaseFeaturedToggleBtn.style.backgroundColor = "rgb(49, 109, 179)";
}

let firstLetterArrayRemoveDuplicates = [];
let filterFullNameArray = [];

//\\////\\////\\////\\////\\////\\////\\////\\////\\////\\////\\////\\////\\////\\////\\////\\////\\////\\
//\\////\\////\\////\\////            FILTER BY FIRST LETTER FUNCTIONS          ////\\////\\////\\////\\//
//\\////\\////\\////\\////\\////\\////\\////\\////\\////\\////\\////\\////\\////\\////\\////\\////\\////\\

function filterByFirstLetter(letterToFilter) {
  //match letter to full name and store index when name match
  const filterMatchAtIndex = []; //reseting array to hold nothing before being filled
  filterFullNameArray.filter((name, index) => {
    ///CHANGE ALL TO UPPERCASE
    if (name.charAt(0).toUpperCase() === `${letterToFilter.toUpperCase()}`) {
      filterMatchAtIndex.push(index);
    }
  });
  //get id based off index
  const filterIDAtIndex = [];
  filterMatchAtIndex.forEach((element) =>
    filterIDAtIndex.push(clientSideRealtimeData[element])
  );
  const filterIDFromIndex = [];
  filterIDAtIndex.forEach((element) => filterIDFromIndex.push(element.id));
  //send all matches to float left
  floatMatchingIDsLeft(filterIDFromIndex);
  //since this is only clientside visual we just need to manipulate the HTML order of the cards, so if they delete the newArray will just remove from html but delete by clientsidedataArray's index so we dont need to make more splice codes
}
//create array to iterate through using clientdatasidedata, pulling first letters by charAt(), and pushing to an array
function createFirstLetterArray(clientSideRealtimeData) {
  createFullNameArray();
  let filterFirstLetterArray = [];
  clientSideRealtimeData.forEach((element) =>
    filterFirstLetterArray.push(element.name.charAt(0).toUpperCase())
  );
  firstLetterArrayRemoveDuplicates = [...new Set(filterFirstLetterArray)];
  createButtonsForFilterLetters(firstLetterArrayRemoveDuplicates);
  return firstLetterArrayRemoveDuplicates;
}

function createFullNameArray() {
  filterFullNameArray = [];
  clientSideRealtimeData.forEach((element) =>
    filterFullNameArray.push(element.name)
  );
  return filterFullNameArray;
}

function createButtonsForFilterLetters(firstLetterArrayRemoveDuplicates) {
  firstLetterArrayRemoveDuplicates.sort().forEach((element) => {
    const letterBtn = document.createElement("BUTTON");
    letterBtn.id = `filterLetter${element}`;
    letterBtn.textContent = element;
    letterBtn.style =
      "padding: 8px; margin-top: 2px; margin-left: 2px; margin-right: 2px; font-size: 14px; font-weight: bold; background: rgb(61, 134, 218);";
    filterBtnContainer.append(letterBtn);
    letterBtn.addEventListener("click", () => {
      let characterCards = document.querySelectorAll("#character-bar .card");
      characterCards.forEach((element) => (element.style.float = "none"));
      filterByFirstLetter(element);
    });
  });
}

let floatCharacterLeftArray;

function floatMatchingIDsLeft(filterIDFromIndex) {
  floatCharacterLeftArray = [];
  filterIDFromIndex.forEach((element) => {
    let floatCharacterLeft = document.getElementById(`cBD${element}`);
    floatCharacterLeft.style.float = "left";
    floatCharacterLeftArray.push(floatCharacterLeft);
  });
}
