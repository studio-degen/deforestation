let axiom = "X"; //starting point
let treeGrowInterval = 1000;
let rules = [];
let shared, me, participants;
let generateCheck = true;
let y = 0;
let timer = 500;
let hostLoggers = [];
let fol_a = [];
let fol_b = [];
let fol_c = [];
// let br1 = [];
// let br2 = [];
let appleImgs = [];
let axeGif,woodGif;
let insGifs = [];
let allOfTheTrees = [];
let allOfTheChildTrees = [];
let gameTime = 0;
let gameBegin = false;
let gameOver = false;

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
let gameScreenMode = 4;
let instruct = 0;
let lastPage = 5; //count of numer of instruction pages
let nextButton;
let nextButtonX = 150;
let prevButton;
let prevButtonX = 150;
let finButton;
let finButtonX = 150;
let finButtonTxt = "START GAME";

let bgCol = "#a7d179"; //colours
let branchCol = "#8c5c08";
let foliageCol = "#088c0f";
let appleCol = "red";
let shadowCol = (rules[0] = {
  X: "X",
  F: "F",
  X1: "F[+X]F[-X]+X",
  X2: "F[+X][-X]FX",
  X3: "F-[[X]+X]+F[+FX]-X",
  F1: "FF",
});

setInterval(() => gameState(), 30);
setInterval(() => allTrees(), 30);
setInterval(() => gameTimer(), 1000);
setInterval(() => addLogger(), 15000);
setInterval(() => rushScene(), 30000);

function preload() {
  partyConnect(
    "wss://deepstream-server-1.herokuapp.com",
    "studeg_deforestation",
    "hw"
  );
  shared = partyLoadShared("globals");
  me = partyLoadMyShared();
  participants = partyLoadParticipantShareds();

  for(let i=1; i<5; i++){
    insGifs.push(loadImage("assets/ins_"+i+".gif"));
  }

  for (let i = 1; i < 4; i++) {
    fol_a[i - 1] = loadImage("assets/fol_a_" + i + ".png");
    fol_b[i - 1] = loadImage("assets/fol_b_" + i + ".png");
    fol_c[i - 1] = loadImage("assets/fol_c_" + i + ".png");

    appleImgs[i - 1] = loadImage("assets/apple" + i + ".png");
  }

  // for (let j = 1; j < 5; j++) {
  //   for (let k = 1; k < 2; k++) {
  //     br1.push(loadImage(`assets/br${1}_${j}_${k}.png`));
  //     br2.push(loadImage(`assets/br${2}_${j}_${k}.png`));
  //   }
  // }

  axeGif = loadImage('assets/logger_axe.gif');
  woodGif = loadImage('assets/logger_wood.gif');
}
function setup() {
  createCanvas(1300, 650);
  // textAlign(CENTER, CENTER);
  imageMode(CENTER);
  textFont('Inter');

  background(bgCol); //BG CONTROL HERE
  noStroke();
  me.x = 0;
  me.y = 0;
  me.count = 0;
  me.countMax = 0;
  me.branchLength = 0;
  me.angle = 0;
  me.sentence = 0;
  me.setTree = false;
  me.treeArea = 150;
  me.folNum = floor(random(0, 3));
  me.folShape = floor(random(0, 3));
  me.appleShape = floor(random(0, 3));
  me.branchCol = floor(random(0, 2));
  me.branchShape = {
    a: floor(random(0, 2)),
    b: floor(random(2, 4)),
    c: floor(random(4, 6)),
    d: floor(random(6, 8)),
    e: floor(random(8, 10)),
  };
  //a is the biggest/lowest level branch

  me.apples = [];
  me.myTrees = [];
  shared.loggers = [];
  shared.gameStartChk = false;
  if (partyIsHost()) {
    instruct = 0;
    hostLoggers.push(
      new Logger(
        { x: random(width), y: random(height) },
        { x: random(-6, 6), y: random(-6, 6) },
        6
      )
    );
  }

  nextButton = createButton("NEXT");
  nextButton.position(width - nextButtonX, height);
  nextButton.mousePressed(nextFn);

  prevButton = createButton("PREVIOUS");
  prevButton.position(prevButtonX, height);
  prevButton.mousePressed(prevFn);

  finButton = createButton(finButtonTxt);
  finButton.position(prevButtonX, height);
  finButton.mousePressed(finFn);
}
function mousePressed() {
  if (
    shared.gameStartChk == true &&
    screenMode == gameScreenMode &&
    me.state == "player"
  ) {
    if (me.setTree == false) {
      me.x = mouseX;
      me.y = mouseY;
      me.count = 0;
      me.countMax = int(random(2, 5));
      me.branchLength = random(130, 70);
      me.angle = radians(20);
      me.sentence = axiom;
      me.lSystem = int(random(1, 4));
      me.setTree = true;
      for (let i = 0; i < 3; i++) {
        growApples();
      }
    } else {
      for (let i = 0; i < me.apples.length; i++) {
        let appleDist = dist(mouseX, mouseY, me.apples[i].x, me.apples[i].y);
        if (
          appleDist <= 5 &&
          me.apples[i].move == false &&
          me.apples[i].planted == false
        ) {
          me.apples[i].move = true;
        }
        let areaDistX = dist(mouseX, 0, me.x, 0);
        let areaDistY = dist(0, mouseY, 0, me.y);
        if (
          me.apples[i].move == true &&
          areaDistX <= me.treeArea / 2 &&
          areaDistY <= me.branchLength / 2
        ) {
          me.apples[i].move = false;
          me.apples[i].planted = true;
          me.apples.splice(i, 1);
          me.myTrees.push({
            x: mouseX,
            y: mouseY,
            count: 0,
            countMax: int(random(1, 3)),
            branchLength: random(40, 20),
            angle: radians(20),
            sentence: axiom,
            lSystem: int(random(1, 4)),
            setTree: true,
            folNum: floor(random(0, 3)),
            folShape: floor(random(0, 3))
          });

          // adding apples back at a slower pace?
          //this runs as soon as the mouse is clicked and then creates the delay instead of delaying first and then creating an apple
          //setTimeout(growApples(), 5000);
        }
      }
    }
  }
}
function recurTree(x, y, l, a, s, c, num, shape, size) {
  resetMatrix();
  push();
  translate(x, y);
  noStroke();
  for (let i = 0; i < s.length; i++) {
    let current = s.charAt(i);
    if (current == "F") {
      fill(branchCol);
      if(c < 1){
        rect(0, 0, 5, -l);
      }else{
        rect(0, 0, 2, -l);
      }
      //rect(0, 0, 5, -l);
      translate(0, -l, 1);
    } else if (current == "X") {
      for (const t of participants) {
        fill(branchCol);
      if(c < 1){
        rect(0, 0, 5, -l);
      }else{
        rect(0, 0, 2, -l);
      }
        if (num == 0) {
          image(fol_a[shape], 0, -l, size, size);
        } else if (num == 1) {
          image(fol_b[shape], 0, -l, size, size);
        } else if (num == 2) {
          image(fol_c[shape], 0, -l, size, size);
        }
      }

      
      translate(0, -l, 1);
    } else if (current == "+") {
      rotate(a);
    } else if (current == "-") {
      rotate(-a);
    } else if (current == "[") {
      push();
    } else if (current == "]") {
      pop();
    }
  }
  translate(0, 0);
  pop();
}
function generateNewSentence(x, y, c, cmax, l, a, s, ls, num, shape, size) {
  //console.log(x, y, c, cmax, l, a, s, ls);
  while (c < cmax) {
    l *= 0.5;
    let nextSentence = "";
    for (let i = 0; i < s.length; i++) {
      let current = s.charAt(i);
      let found = false;
      for (let j = 0; j < rules.length; j++) {
        if (current == rules[0].X) {
          found = true;
          if (ls == 1) nextSentence += rules[0].X1;
          else if (ls == 2) nextSentence += rules[0].X2;
          else nextSentence += rules[0].X3;
          break;
        } else if (current == rules[0].F) {
          found = true;
          nextSentence += rules[0].F1;
          break;
        }
      }
      if (!found) {
        nextSentence += current;
      }
    }
    s = nextSentence;
    // createP(s);
    recurTree(x, y, l, a, s, c, num, shape, size);
    c++;
  }
}
// we need to do the thing where the drawing order is based on y position so the trees at the top are behind the ones towards the bottom
function allTrees() {
  // console.log(shared.gameStartChk, screenMode, gameScreenMode);
  if (shared.gameStartChk == true && screenMode == gameScreenMode) {
    // console.log(shared.gameStartChk, screenMode, gameScreenMode);
    background(bgCol);

    gameBegin = true;
    text(gameTime, width-200, 100)
    text(allOfTheChildTrees.length, width-200, 140);

    if (me.state == "viewer") {
      push();
      textSize(15);
      text("you are a viewer", mouseX, mouseY);
      pop();
    }

    if (me.setTree == false && me.state == "player") {
      //draw initial planting area
      push();
      fill(255, 255, 255, 150);
      ellipse(mouseX, mouseY, me.treeArea, me.treeArea / 2);
      image(appleImgs[me.appleShape], mouseX, mouseY, 12, 12);
      pop();
    }

    // draw the area
    push();
    fill(255, 255, 255, 100);
    ellipse(me.x, me.y, me.treeArea, me.branchLength);
    pop();

    for (const t of participants) {
      if (t.setTree == true) {
        // draw the area
        // push();
        // fill(255, 255, 255, 100);
        // ellipse(t.x, t.y, me.treeArea, t.branchLength);
        // pop();

        // draw the main tree per participant
        generateNewSentence(
          t.x,
          t.y,
          t.count,
          t.countMax,
          t.branchLength,
          t.angle,
          t.sentence,
          t.lSystem,
          t.folNum,
          t.folShape,
          30
        );

        //draw the apples
        for (const a of t.apples) {
          if (a.move == true) {
            a.x = mouseX;
            a.y = mouseY;
          }
          image(appleImgs[t.appleShape], a.x, a.y, 12, 12);
        }
        for (const m of t.myTrees) {
          push();
          generateNewSentence(
            m.x,
            m.y,
            m.count,
            m.countMax,
            m.branchLength,
            m.angle,
            m.sentence,
            m.lSystem,
            m.folNum,
            m.folShape,
            20
          );
          pop();
        }
      }
    }

    // draw apple selection outline
    for (const a of me.apples) {
      d = dist(mouseX, mouseY, a.x, a.y);
      if (d <= 5) {
        push();
        noFill();
        stroke(255, 230, 5);
        strokeWeight(3);
        ellipse(a.x, a.y, 17);
        pop();
      }
    }

    if (partyIsHost()) {
      shared.loggers = [];
      hostLoggers.forEach((logger) => {
        logger.move();
        //logger.show();

        participants.forEach((p) => {
          if (!logger.woodpicked) {
            //console.log(p.myTrees);

            let treeDist;
            p.myTrees.forEach((t, index) => {
              treeDist = dist(logger.pos.x, logger.pos.y, t.x, t.y);
              if (treeDist < 30) {
                //console.log('close');
                logger.cutting = true;
                if (treeDist > 10) {
                  logger.d.x = lerp(logger.d.x, (t.x - logger.pos.x) / 20, 0.2);
                  logger.d.y = lerp(logger.d.y, (t.y - logger.pos.y) / 20, 0.2);
                } else if (treeDist < 10) {
                  //console.log('hit');
                  // if(int(millis())/1000 % 60){
                  //   logger.cutTime--;
                  // }

                  //if(logger.cutTime == 0){
                  //logger.d.x = 0;
                  //logger.d.y = 0;
                  p.myTrees.splice(index, 1);
                  //console.log(p.myTrees)
                  logger.woodpicked = true;
                  //}
                  setTimeout(() => {
                    logger.cutting = false;
                    //logger.cutTime = 10;
                  }, 2000);
                }
              }
            });
          }
        });

        shared.loggers.push({
          x: logger.pos.x,
          y: logger.pos.y,
          woodpicked: logger.woodpicked,
        });
      });
    }

    shared.loggers.forEach((logger) => {
      if (!logger.woodpicked) {
        image(axeGif, logger.x,logger.y,25,25);
      } else {
        image(woodGif, logger.x,logger.y,25,25);
      }
    });

    //console.log((floor(int(millis())/1000)/10) % 1 == 0);
    let randint = random();
    if (randint < 0.003) {
      setTimeout(growApples(), 3000);
    }
  }
}
function addLogger() {
  if (partyIsHost()) {
    hostLoggers.push(
      new Logger(
        { x: random(width), y: random(height) },
        { x: random(-6, 6), y: random(-6, 6) },
        6
      )
    );
  }
}
function rushScene() {
  if (partyIsHost()) {
    hostLoggers.forEach((logger) => {
      if (logger.step < 20) {
        logger.step += 4;
      }
    });
  }

  if (me.treeArea < 400) {
    me.treeArea += 50;
  }
}
function gameTimer() {
  if (gameBegin) {
    gameTime++;
  }

  allOfTheTrees = [];
  allOfTheChildTrees = [];
  participants.forEach((p) => {
    allOfTheTrees.push("tree");
    p.myTrees.forEach((mt) => {
      allOfTheTrees.push("tree");
      allOfTheChildTrees.push("tree");
    });
  });

  if (gameTime >= 60) {
    if (allOfTheChildTrees.length == 0) {
      gameOver = true;

      screenMode = 5;

    }
  }
  // console.log(gameTime, allOfTheTrees.length);
}
function growApples() {
  if (me.setTree == true && me.apples.length < 3) {
    let treeHeight = treeHeightSum(me.branchLength, me.countMax);

    me.apples.push({
      x: random(me.x - 15, me.x + 25),
      y: random(me.y - (me.branchLength / 4) * 3, me.y - treeHeight),
      move: false,
      planted: false,
    });

    let appleYTop =
      me.y -
      me.branchLength -
      me.branchLength / 2 ** (me.countMax - me.countMax / 3);
    // for (const a of me.apples) {
    //   if (a.y > appleYTop) {
    //     a.x = random(me.x, me.x + 25);
    //   } else if (a.y < appleYTop) {
    //     a.x = random(me.x - 25, me.x + 25);
    //   }
    // }
    // console.log(me.apples);
  }
}
function treeHeightSum(length, countMax) {
  let sum = length;
  let temp = length;
  for (let i = 1; i < countMax; i++) {
    temp /= 2;
    sum += temp;
  }
  return sum;
}
function gameState() {
  switch (screenMode) {
    case 0:
      instructionScreen();
      // console.log("instructions");
      break;
    case 1:
      readyScreen();
      // console.log("ready screen");
      break;
    case 3: //i think this is a bug, it doesn't work if screenmode 2
      launchScreen();
      break;
    case 4:
      gameScreen(); //this reassigns host if the host exists the game. So the game will continue as long as atleast one player is in the room
      break;
    case 5:
      endScreen(); //not implemented
      break;
  }
}
function instructionScreen() {
  background(bgCol);
  switch (instruct) {
    case 0:
      //title screen
      showButtons();
      textSize(32);
      text("Page 1", 10, 30);
      break;
    case 1:
      //actual instructions start
      showButtons();
      image(insGifs[0],width/2,height/2);
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
    for (let i = 0; i < participants.length; i++) {
      image(appleImgs[me.appleShape], (width/2-(participants.length/2)*100) + 100*i, height/2, 50, 50);
    }
  } else {
    screenMode = 4;
  }
}
function gameScreen() {
  showButtons();
  screenMode = 4;
  shared.gameStartChk = true; //need to set this on button click
}
function endScreen(){
  background(red);
}
function nextFn() {
  instruct++;
}
function prevFn() {
  instruct--;
}
function finFn() {
  screenMode++;
  // console.log(screenMode);
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
