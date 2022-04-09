// hyacinth's original code is in hweng_old.js
let axiom = "X"; //starting point
let treeGrowInterval=1000;
let rules = [];
let shared, me, participants;
let generateCheck=true;
let y=0;
let treeArea = 150;

rules[0] = {
  Xa: "X",
  Fa: "F",
  X: "F[+X]F[-X]+X",
  F: "FF"
}

bgCol="#a7d179";
treeBranch='#8c5c08';
treeFoliage="#088c0f";

setInterval(() => trees(), 30); 
setInterval(() => allTrees(), 30); 
// setInterval(() => treeMake(), 3000); 

function preload(){
  partyConnect(
    "wss://deepstream-server-1.herokuapp.com","studeg_deforestation",
    "main"
  );
  shared = partyLoadShared("globals");
  me = partyLoadMyShared();
  participants = partyLoadParticipantShareds();
}

function setup(){
  createCanvas(600, 600);
  textAlign(CENTER, CENTER);

  background(bgCol); //BG CONTROL HERE
  noStroke();
  me.x=0; 
  me.y=0; 
  me.count=0; 
  me.countMax=0;
  me.branchLength=0; 
  me.angle=0;
  me.sentence=0;
  me.setTree= false;

  me.apples = [];
  me.myTrees = [];
}
function recurTree(x,y,l,a,s){
  resetMatrix();
  
  push();
  translate(x,y);
  noStroke();
  for(let i = 0; i < s.length; i++){
    let current = s.charAt(i);
    if(current == "F"){
      fill(treeBranch);
      rect(0, 0, 3, -l);
      translate(0, -l,1);
    }else if (current == "X"){
      fill(treeFoliage);
      ellipse(0,-l, 30);
      fill(treeBranch);
      rect(0, 0, 3, -l);
      translate(0, -l,1);
    }else if (current == "+"){
      rotate(a);
    }else if (current == "-"){
      rotate(-a)
    }else if (current == "["){
      push();
    }else if (current == "]"){
      pop();
    }
  }
  translate(0,0);
  pop();
}

function generate(x,y,c,cmax,l,a,s){
  while(c<cmax){
    l *= 0.5;
    let nextSentence = "";
    for(let i = 0; i < s.length; i++){
      let current = s.charAt(i);
      let found = false;
      for(let j = 0; j < rules.length; j++){
        if(current == rules[j].Xa) {
          found = true;
          nextSentence += rules[j].X;
          break;
        }
        else if(current == rules[j].Fa){
          found = true;
          nextSentence += rules[j].F;
          break;
        }
      }
      if (!found) {
        nextSentence += current;
      }
    }
    s = nextSentence;
    // createP(s);
    recurTree(x,y,l,a,s);
    c++;
  }
}

function trees(){
  if(me.setTree==true){
    generate(me.x,me.y, me.count, me.countMax, me.branchLength, me.angle, me.sentence, me.setTree);
  }
}
// function treeMake(){
//   if(me.setTree==false && me.count<me.countMax){
//     me.count++;
//   }
// }

function mouseClicked(){
  if(me.setTree==false){
    me.x=mouseX;
    me.y=mouseY; 
    me.count=0; 
    me.countMax=int(random(1,5));
    me.branchLength=random(100,50); 
    me.angle=radians(20);
    me.sentence=axiom;
    me.setTree= true;
    for(let i=0; i<3; i++){
      growApples();
    }
  }
  else{
    // for(let i=0; i<3; i++){
    //   growApples();
    // }
    for(let i=0; i<me.apples.length; i++){
      let appleDist = dist(mouseX,mouseY,me.apples[i].x,me.apples[i].y);
      if(appleDist<=5 && me.apples[i].move == false && me.apples[i].planted == false){
        me.apples[i].move = true;
      }
      let areaDist = dist(mouseX,mouseY,me.x,me.y);
      if(me.apples[i].move == true && areaDist<=treeArea/2){
        me.apples[i].move = false;
        me.apples[i].planted = true;
        me.apples.splice(i,1);
        me.myTrees.push({
          x: mouseX,
          y: mouseY,
        });

        // i have no idea anymore
        // adding apples back at a slower pace?
       setTimeout(growApples(), 5000);
      }
    }
    
  }
}

// we need to do the thing where the drawing order is based on y position so the trees at the top are behind the ones towards the bottom
function allTrees(){
  background(bgCol);
  // console.log(me.setTree);
  if(me.setTree==false){
    push();
    fill(255,255,255,150);
    ellipse(mouseX,mouseY,150);
    fill("red"); 
    ellipse(mouseX, mouseY, 20);  
    pop();
  }
  
  // growApples();
  for(const t of participants){
    if(t.setTree == true){
      // draw the area
      push();
      fill(255,255,255,100);
      ellipse(t.x, t.y, treeArea,treeArea);
      pop();
      
      // draw the tree
      generate(t.x,t.y, t.count, t.countMax, t.branchLength, t.angle, t.sentence, t.setTree);
      
      //draw the apples
      // the apples should not be blinking, but only your own seem to do that
      for(const a of t.apples){
        if(a.move == true){
          a.x = mouseX;
          a.y = mouseY;
        }
        push();
        fill(255,0,0);
        ellipse(a.x,a.y,10,10);
        pop();
      }
      for(const m of t.myTrees){
        push();
        fill(0,255,0);
        rect(m.x,m.y,10,20);
        pop();
      }
    }
  }

  // draw apple selection outline
  for(const a of me.apples){
    d = dist(mouseX,mouseY,a.x,a.y);
    if(d<=5){
      push();
      noFill();
      stroke(255,230,5);
      strokeWeight(3);
      ellipse(a.x,a.y,13);
      pop();
    }
  }
// console.log(me.myTrees);
}

function growApples(){
  if(me.setTree == true && me.apples.length<3){
    me.apples.push({
      // HW: how do you make sure the apples are only spawning on the endpoints of the branches or something. i just have these set as arbitraty numbers rn
        x: random(me.x-25,me.x+25),
        y: random(me.y-me.branchLength, me.y-(me.branchLength*1.75)),
        move: false,
        planted: false,
    });
  }
}