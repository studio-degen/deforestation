let axiom = "X"; //starting point
let treeGrowInterval=1000;
let rules = [];
let me;
let participants;
let generateCheck=true;
let y=0;
rules[0] = {
  Xa: "X",
  Fa: "F",
  X: "F[+X]F[-X]+X",
  F: "FF"
}
backgroundCol="#a7d179";
treeBranch='#8c5c08';
treeFoliage="#088c0f";
setInterval(() => trees(), 30); 
setInterval(() => allTrees(), 30); 
// setInterval(() => treeMake(), 3000); 

function preload() {
  partyConnect(
    "wss://deepstream-server-1.herokuapp.com","tm_gameC_3",
    "main"
  );
  me = partyLoadMyShared();
  participants = partyLoadParticipantShareds();
}
function setup() {
  createCanvas(600, 600);
  background(backgroundCol); //BG CONTROL HERE
  noStroke();
  me.x=0; 
  me.y=0; 
  me.count=0; 
  me.countMax=0;
  me.length=0; 
  me.angle=0;
  me.sentence=0;
  me.setTree= false;
}
function recurTree(x,y,l,a,s) {
  // background("#a7d179"); //BG CONTROL HERE
  resetMatrix();
  push();
  translate(x,y);
  noStroke();
  for (let i = 0; i < s.length; i++) {
    let current = s.charAt(i);
    if (current == "F") {
      fill(treeBranch);
      rect(0, 0, 3, -l);
      translate(0, -l,1);
    } else if (current == "X") {
      fill(treeFoliage);
      ellipse(0,-l, 30);
      fill(treeBranch);
      rect(0, 0, 3, -l);
      translate(0, -l,1);
    } else if (current == "+") {
      rotate(a);
    } else if (current == "-") {
      rotate(-a)
    } else if (current == "[") {
      push();
    } else if (current == "]") {
      pop();
    }
  }
  translate(0,0);
  pop();
}
function generate(x,y,c,cmax,l,a,s) {
  while(c<cmax){
    l *= 0.5;
    let nextSentence = "";
    for (let i = 0; i < s.length; i++) {
      let current = s.charAt(i);
      let found = false;
      for (let j = 0; j < rules.length; j++) {
        if (current == rules[j].Xa) {
          found = true;
          nextSentence += rules[j].X;
          break;
        }
        else if (current == rules[j].Fa) {
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
    generate(me.x,me.y, me.count, me.countMax, me.length, me.angle, me.sentence, me.setTree);
  }
}
// function treeMake(){
//   if(me.setTree==false && me.count<me.countMax){
//     me.count++;
//   }
// }
function mousePressed(){
  if(me.setTree==false){
    let treeX = mouseX;
    let treeY = mouseY;
    me.x=treeX;
    me.y=treeY; 
    me.count=0; 
    me.countMax=int(random(1,5));
    me.length=random(100,50); 
    me.angle=radians(20);
    me.sentence=axiom;
    me.setTree= true;
  }
}
function allTrees(){
  background(backgroundCol); //BG CONTROL HERE
  console.log(me.setTree)
  if(me.setTree==false){
    push();
    fill("red"); 
    ellipse(mouseX, mouseY, 20);  
    pop();
  }
  console.log(participants.length)
  for (const t of participants) {
    console.log(me.setTree)
    if (t.setTree == true) {
      generate(t.x,t.y, t.count, t.countMax, t.length, t.angle, t.sentence, t.setTree);
    }
    // else{
    //   fill("red"); 
    //   ellipse(mouseX, mouseY, 20); 
    // }
  }
}