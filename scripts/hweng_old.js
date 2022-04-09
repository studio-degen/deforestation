let shared, me, participants;
let placeMode = true;
let stage = 1;
let treeD = 50;
let treeAreaD = treeD*4;

function preload() {
    partyConnect(
        "wss://deepstream-server-1.herokuapp.com",
        "game_c_deforestation",
        "main"
    );
    shared = partyLoadShared("globals");
    me = partyLoadMyShared();
    participants = partyLoadParticipantShareds();
}

function setup(){
    createCanvas(600,600);
    textAlign(CENTER, CENTER);
    rectMode(CENTER);

    me.ready = false;
    me.tree = {
        placed: false,
        x:0,
        y:0,
    };
    me.apples = [];
}

function draw(){
    switch(stage){

        case 0://waiting room
            background(100);
            text('waiting for players to join...', width/2,50);
            rect(width/2,100, 40,20);
            text('ready',width/2,100);
            // text(mouseX+", "+mouseY, mouseX, mouseY);
        break;

        case 1:
            background(56, 212, 42);
            placeMe();
            growApple();
            for(let i=0; i<participants.length; i++){
                if(participants[i].tree.placed == true){
                    push();
                    fill(255,255,255,100);
                    ellipse(participants[i].tree.x, participants[i].tree.y, treeAreaD,treeAreaD);
                    pop();
                    ellipse(participants[i].tree.x, participants[i].tree.y, treeD,treeD);
                    
                    for(const a of participants[i].apples){
                        push();
                        fill(255,0,0);
                        ellipse(a.x,a.y,10,10);
                        pop();
                    }
                }
            }
            
        break;
    }
    
}

function placeMe(){
    if(me.tree.placed == false && placeMode == true){
        push();
        fill(255,255,255,200);
        ellipse(mouseX,mouseY,treeAreaD,treeAreaD);
        pop();
        ellipse(mouseX,mouseY, treeD,treeD);
        // console.log('not yet')
    }
}

function growApple(){
    if(placeMode == false && me.apples.length<3){
        me.apples.push({
            x: random(me.tree.x-treeD/2, me.tree.x+treeD/2),
            y: random(me.tree.y-treeD/2, me.tree.y+treeD/2),
        });
    }
    // console.log(me.apples[0]);
}

function mouseClicked(){
    if(stage == 0){
        if(mouseX>280 && mouseX<320 && mouseY>90 && mouseY<110){
            // stage = 1;
            me.ready = true;
        }
    }else if(stage == 1){
        if(me.tree.placed == false && placeMode == true){
            me.tree.x = mouseX;
            me.tree.y = mouseY;
            me.tree.placed = true;
            placeMode = false;
        }
        if(placeMode == false){

        }
    }
    
}