let axiom = "X"; //starting point
let treeGrowInterval = 1000;
let rules = [];
let shared, me, participants;
let generateCheck = true;
let y = 0;
let treeArea = 150;
let timer = 500;
let hostLoggers = [];
let fol_a = [];
let fol_b = [];
let fol_c = [];
let br1 = [];
let br2 = [];

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

setInterval(() => allTrees(), 30);

function recurTree(x, y, l, a, s) {
  resetMatrix();
  push();
  translate(x, y);
  noStroke();
  for (let i = 0; i < s.length; i++) {
    let current = s.charAt(i);
    if (current == "F") {
      fill(branchCol);
      rect(0, 0, 3, -l);
      translate(0, -l,1);
    }else if (current == "X"){
      // console.log(participants[0].folNum);
      for(const t of participants){
        if(t.folNum == 0){
          image(fol_a[t.folShape], 0,-l, 30,30);
        }else if(t.folNum == 1){
          image(fol_b[t.folShape], 0,-l, 30,30);
        }else if(t.folNum == 2){
          image(fol_c[t.folShape], 0,-l, 30,30);
        }
      }
      
      fill(treeBranch);
      rect(0, 0, 3, -l);
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

function generateNewSentence(x, y, c, cmax, l, a, s, ls) {
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
    recurTree(x, y, l, a, s);
    c++;
  }
}
function preload() {
  partyConnect(
    "wss://deepstream-server-1.herokuapp.com",
    "studeg_deforestation2",
    "main"
  );
  shared = partyLoadShared("globals");
  me = partyLoadMyShared();
  participants = partyLoadParticipantShareds();

  for(let i=1; i<4; i++){
    fol_a[i-1] = loadImage('assets/fol_a_'+i+'.png');
    fol_b[i-1] = loadImage('assets/fol_b_'+i+'.png');
    fol_c[i-1] = loadImage('assets/fol_c_'+i+'.png');
  }
}

function setup() {
  createCanvas(1300, 650);
  textAlign(CENTER, CENTER);

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
  me.folNum = floor(random(0,3));
  me.folShape = floor(random(0,3));

  me.apples = [];
  me.myTrees = [];
  shared.loggers = [];
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

setInterval(() => allTrees(), 30);
setInterval(() => addLogger(), 30000);
setInterval(() => rushLoggers(), 90000);

function mouseClicked() {
  if (me.setTree == false) {
    me.x = mouseX;
    me.y = mouseY;
    me.count = 0;
    me.countMax = int(random(1, 5));
    me.branchLength = random(100, 50);
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
        areaDistX <= treeArea / 2 &&
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
        });

        // adding apples back at a slower pace?
        //this runs as soon as the mouse is clicked and then creates the delay instead of delaying first and then creating an apple
        setTimeout(growApples(), 5000);
      }
    }
  }
}
// we need to do the thing where the drawing order is based on y position so the trees at the top are behind the ones towards the bottom
function allTrees() {
  background(bgCol);
  if (me.setTree == false) {
    push();
    fill(255, 255, 255, 150);
    ellipse(mouseX, mouseY, treeArea, treeArea / 2);
    fill("red");
    ellipse(mouseX, mouseY, 20);
    pop();
  }

  // growApples();
  for (const t of participants) {
    if (t.setTree == true) {
      // draw the area
      push();
      fill(255, 255, 255, 100);
      ellipse(t.x, t.y, treeArea, t.branchLength);
      pop();

      // draw the main tree per participant
      generateNewSentence(
        t.x,
        t.y,
        t.count,
        t.countMax,
        t.branchLength,
        t.angle,
        t.sentence,
        t.lSystem
      );

      //draw the apples
      // the apples should not be blinking, but only your own seem to do that
      for (const a of t.apples) {
        if (a.move == true) {
          a.x = mouseX;
          a.y = mouseY;
        }
        push();
        fill(255, 0, 0);
        ellipse(a.x, a.y, 10, 10);
        pop();
      }
      for (const m of t.myTrees) {
        push();
        // fill(0, 255, 0);
        // rect(m.x, m.y, 10, 20);
        generateNewSentence(
          m.x,
          m.y,
          m.count,
          m.countMax,
          m.branchLength,
          m.angle,
          m.sentence,
          m.lSystem
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
      ellipse(a.x, a.y, 13);
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

          // let partreeDist = dist(logger.pos.x, logger.pos.y, p.x, p.y);
          // if(partreeDist < 30) {
          //   //console.log('close');
          //   logger.cutting = true;
          //   if(partreeDist > 5) {
          //     logger.d.x = lerp(logger.d.x, (p.x-logger.pos.x)/20, 0.2);
          //     logger.d.y = lerp(logger.d.y, (p.y-logger.pos.y)/20, 0.2);
          //   }else if(partreeDist < 5){
          //     console.log('hit');
          //     if(int(millis())/1000 % 60){
          //       logger.cutTime--;
          //     }

          //     if(logger.cutTime == 0){
          //       logger.d.x = 0;
          //       logger.d.y = 0;
          //       p.x = null;
          //       p.y = null;
          //       //console.log(p.myTrees)
          //       logger.woodpicked = true;
          //     }
          //     setTimeout(()=>{
          //       logger.cutting = false;
          //       logger.cutTime = 10;
          //     }, 2000);

          //   }

          // }

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
      fill(0);
      circle(logger.x, logger.y, 10);
    } else {
      fill(0);
      circle(logger.x, logger.y, 10);
      fill("#795548");
      circle(logger.x, logger.y + 10, 10);
    }
  });
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

function rushLoggers() {
  if (partyIsHost()) {
    hostLoggers.forEach((logger) => {
      logger.step += 6;
    });
  }
}

function growApples() {
  if (me.setTree == true && me.apples.length < 3) {
    let treeHeight = treeHeightSum(me.branchLength, me.countMax);

    me.apples.push({
      y: random(me.y - (me.branchLength / 4) * 3, me.y - treeHeight),
      move: false,
      planted: false,
    });

    let appleYTop =
      me.y -
      me.branchLength -
      me.branchLength / 2 ** (me.countMax - me.countMax / 3);
    for (const a of me.apples) {
      if (a.y > appleYTop) {
        a.x = random(me.x, me.x + 25);
      } else if (a.y < appleYTop) {
        a.x = random(me.x - 25, me.x + 25);
      }
    }
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
