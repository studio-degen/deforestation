let blue = "#25399F";
let brown1 = "#584239";
let brown2 = "#6C523B";
let green1 = "#2B734E";
let green2 = "#27AB5E";
let green3 = "#1CDC5F";
let green4 = "#76E44E";
let red = "#F14037";
let yellow = "#FFDD00";
let pink = "#F0909C";
let screenMode = 0;
let instruct = 0;
let lastPage = 5; //count of numer of instruction pages
let nextButton;
let nextButtonX = 150;
let prevButton;
let prevButtonX = 150;
let finButton;
let finButtonX = 150;
let finButtonTxt = "START GAME";

setInterval(() => gameState(), 30);
function preload() {
  partyConnect("wss://deepstream-server-1.herokuapp.com", "gamec-ui", "main");
  shared = partyLoadShared("globals");
  me = partyLoadMyShared();
  participants = partyLoadParticipantShareds();
}
function setup() {
  createCanvas(1300, 650);
  background(brown1);
  noStroke();
  nextButton = createButton("NEXT");
  nextButton.position(width - nextButtonX, height);
  nextButton.mousePressed(nextFn);

  prevButton = createButton("PREVIOUS");
  prevButton.position(prevButtonX, height);
  prevButton.mousePressed(prevFn);

  finButton = createButton(finButtonTxt);
  finButton.position(prevButtonX, height);
  finButton.mousePressed(finFn);

  if (partyIsHost()) {
    shared.gameStartChk = false;
    instruct = 0;
  }
}
function gameState() {
  switch (screenMode) {
    case 0:
      instructionScreen();
      console.log("instructions");
      break;
    case 1:
      readyScreen();
      console.log("ready screen");
      break;
    case 3: //i think this is a bug, it doesn't work if screenmode 2
      launchScreen();
      break;
    case 4:
      gameScreen(); //this reassigns host if the host exists the game. So the game will continue as long as atleast one player is in the room
      break;
    case 5:
      winScreen(); //not implemented
      break;
  }
}
function instructionScreen() {
  background(green4);
  switch (instruct) {
    case 0:
      showButtons();
      textSize(32);
      text("Page 1", 10, 30);
      break;
    case 1:
      showButtons();
      text("Page 2", 10, 30);
      break;
    case 2:
      showButtons();
      text("Page 3", 10, 30);
      break;
    case 3:
      showButtons();
      text("Page 4", 10, 30);
      break;
    case 4:
      showButtons();
      text("Page 5", 10, 30);
      break;
    case 5:
      showButtons();
      text("Page 6", 10, 30);
      break;
  }
}
function readyScreen() {
  showButtons();
  background(green3);
  if (shared.gameStartChk == false) {
    text("ready to play?", 20, 30);
    me.state = "player";
  } else {
    text("game is already in session. Join as viewer", 20, 30);
    me.state = "viewer";
  }
}
function launchScreen() {
  showButtons();
  background(green1);
  if (shared.gameStartChk == false) {
    if (partyIsHost()) {
      text("click to launch game", 20, 30);
    } else {
      text("waiting for host to launch game", 20, 30);
    }
  } else {
    screenMode = 4;
  }
}
function gameScreen() {
  showButtons();
  background(green2);
  shared.gameStartChk = true; //need to set this on button click
  if (shared.gameStartChk) {
    if (me.state == "player") {
      push();
      fill(red);
      noStroke();
      ellipse(mouseX, mouseY, 10, 10);
      pop();
    } else {
      console.log("you're just a viewer");
    }
  }
  // if(win==true) { //psuedo win fn call code
  //   screenMode = 5;
  // }
}
function mouseClicked() {
  if (screenMode < 4 && screenMode > 1) screenMode++;
}
function nextFn() {
  instruct++;
}
function prevFn() {
  instruct--;
}
function finFn() {
  screenMode++;
  console.log(screenMode);
}
function showButtons() {
  if (screenMode == 0) {
    if (instruct == 0) {
      prevButton.hide();
      nextButton.show();
      finButton.show();
      finButton.position(finButtonX, height);
    } else if (instruct == lastPage) {
      prevButton.show();
      nextButton.hide();
      finButton.show();
      finButton.position(width - finButtonX, height);
    } else {
      prevButton.show();
      nextButton.show();
      finButton.hide();
    }
  } else if (screenMode == 1) {
    prevButton.hide();
    nextButton.hide();
    finButton.show();
  } else if (screenMode == 3 && partyIsHost()) {
    prevButton.hide();
    nextButton.hide();
    finButton.show();
  } else if (screenMode > 3) {
    prevButton.hide();
    nextButton.hide();
    finButton.hide();
  } else {
    prevButton.hide();
    nextButton.hide();
    finButton.hide();
  }
}
