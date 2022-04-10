class Logger {
    constructor(pos, d, step) {
    this.pos = pos;
    this.d = d;
    this.step = step;
    this.cutting = false;
    this.woodpicked = false;
    this.cutTime = 10;
    }

    move(){
        let rand = random();
        if(!this.cutting){
        if(rand < 0.3){
            this.d.x = lerp(this.d.x, random(-this.step, this.step), 0.2);
            this.d.y = lerp(this.d.y, random(-this.step, this.step), 0.2);
        }

        }
        this.pos.x += this.d.x;
        this.pos.y += this.d.y;

        
    if(this.pos.x < -20 || this.pos.x > width+20){
        this.d.x = -this.d.x;
        this.woodpicked = false;
    }

    if(this.pos.y < -20 || this.pos.y > height+20){
        this.d.y = -this.d.y;
        this.woodpicked = false;
    }

    }

    // show(){
    //     if(!this.woodpicked){
    //         fill(0);
    //         circle(this.pos.x, this.pos.y, 10);
    //     }else{
    //         fill(0);
    //         circle(this.pos.x, this.pos.y, 10);
    //         fill('#795548');
    //         circle(this.pos.x, this.pos.y+10, 10);
    //     }
    // }
}