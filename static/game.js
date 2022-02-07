/* Variables */

let request_id;

let fpsInterval = 100/30;
let now;
let then = Date.now();

let canvas;
let context;

let frameX = 0;
let frameY = 0;

let spritedistance = 16;

let playerImage = new Image();
let enemyImage = new Image();
let backgroundImage = new Image();

let tilesPerRow = 40;
let tileSize = 16;

let enemys = [];

let counter = 0;

var bg = {
    empty: -1,
    g: 0,
    bush: 562,
    skull1: 147,
    skull2: 108,
    sign: 114,
    fxu: 684,
    fxd: 684,
    fyr: 724,
    fyl: 724,
    fbl: 722,
    fbr: 723,
    ftr: 683, 
    ftl: 682,
};

let player = {
    x: 0,
    y: 0,
    width: 16,
    height: 24,
    frameX: 0,
    frameY: 6,
    speed: 2,
};

let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;
let space = false;

let coins = 0;
let hearts = 100;
let timer = 1.5;
let level = 1;
let coinsdue = 10;

let xhttp;

/* Once loaded */

document.addEventListener("DOMContentLoaded", init, false);

function init() {
    /* get canvas and context, images, player location, activate window listeners */

    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");

    playerImage.src = 'static/images/character.png';
    enemyImage.src = 'static/images/tiny_skelly-SWEN.png';
    backgroundImage.src = 'static/images/Overworld.png';

    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height - player.height * 1.25;

    window.addEventListener("keydown", activate, false);
    window.addEventListener("keyup", deactivate, false);

    /* first call */
    document.getElementById("message").innerHTML = 'Press Enter to Begin.';

    document.addEventListener('keydown', begin, false);

    
}

function begin(event) {
    if (event.key === 'Enter') {
        document.removeEventListener('keydown', begin);
        draw(); 

    }
}

function draw() {
    /* loop and fps */
    request_id = window.requestAnimationFrame(draw);

    let now = Date.now();
    let elapsed = now - then;
    if (elapsed <= fpsInterval) {
        return;
    }
    then = now - (elapsed % fpsInterval);
    timer -= elapsed / 60000;

    if (timer <= 0 || hearts <= 0) {
        timer = 0;
        levelend()
    }

    /* Updating html */
    document.getElementById("coins").innerHTML = coins;
    document.getElementById("health").innerHTML = hearts;
    document.getElementById("time").innerHTML = 'Time left: ' + timer.toFixed(2);
    document.getElementById("level").innerHTML = 'Level: ' + level;
    document.getElementById("message").innerHTML = 'Explore the area to find skeletons.' + '<br> Rent due: ' + coinsdue;


    /* enemy maker and random x y off map */

    let axis = randint(0, 1);
    let xe;
    let ye;

    if (axis === 0) {
        let upordown = randint(0, 1);

        if (upordown === 0) {
            xe = canvas.height;
            ye = randint(0, canvas.width);
        } else {
            xe = 0;
            ye = randint(0, canvas.width);
        }
    } else {
        let upordown = randint(0, 1);

        if (upordown === 0) {
            xe = randint(0, canvas.height - 18);
            ye = canvas.width;
        } else {
            xe = randint(0, canvas.height - 18);
            ye = 0;
        }
    }

    if (player.x > player.width * 2.5 && player.x < canvas.width - player.width * 2.5 && player.y > player.height * 1.5 && player.y < canvas.height - player.height * 1.5) {
        if (enemys.length < level) {

        let enemy = {
            x : xe,
            y : ye,
            width: 13,
            height: 18,
            frameX: 0,
            frameY: 0,
            speed: 0.8, 
            direction: 0,
            dead: false,
            upordown: 0,
        }
            enemys.push(enemy);
        }
    }

    /* Location + Background */

    if (frameX === 2) {
        bg.fyr = 724;
        bg.ftr = 724;
        bg.fbr = 724;
        bg.ftl = 0;
        bg.fxu = 0;
    } else if (frameY === 2) {
        bg.fxu = 684;
        bg.ftr = 684;
        bg.ftl = 684;
        bg.fbr = 0;
        bg.fyr = 0;
    } else {
        bg.fyr = 0;
        bg.ftr = 0;
        bg.fbr = 0;
        bg.fxu = 0;
        bg.ftl = 0;
    }
    
    if (frameX === -2) {
        bg.fyl = 724;
        bg.ftl = 724;
        bg.fbl = 724;
        bg.fxd = 0;
    } else if (frameY === -2) {
        bg.fxd = 684;
        bg.fbr = 684;
        bg.fbl = 684;
        bg.fyl = 0;
    } else {
        bg.fyl = 0;
        bg.fbl = 0;
        bg.fxd = 0;
    }
   
    if (frameX === 2 && frameY === 2) {
        bg.ftr = 683;
        bg.fxu = 684;
        bg.ftl = 684;
    }

    if (frameX === 2 && frameY === -2) {
        bg.fbr = 723;
        bg.fyr = 724;
    }

    if (frameX === -2 && frameY === 2) {
        bg.ftl = 682;
        bg.fyl = 724;
    }

    if (frameX === -2 && frameY === -2) {
        bg.fbl = 722;
        bg.fxd = 684;
        bg.fbr = 684;
    }    
    
    let background = [
        [bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g],
        [bg.g, bg.ftl, bg.fxu, bg.fxu, bg.fxu, bg.fxu, bg.fxu, bg.fxu, bg.fxu, bg.fxu, bg.fxu, bg.fxu, bg.fxu, bg.fxu, bg.fxu, bg.fxu, bg.fxu, bg.ftr, bg.g],
        [bg.g, bg.fyl, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.fyr, bg.g],
        [bg.g, bg.fyl, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.fyr, bg.g],
        [bg.g, bg.fyl, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.fyr, bg.g],
        [bg.g, bg.fyl, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.fyr, bg.g],
        [bg.g, bg.fyl, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.fyr, bg.g],
        [bg.g, bg.fyl, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.fyr, bg.g],
        [bg.g, bg.fbl, bg.fxd, bg.fxd, bg.fxd, bg.fxd, bg.fxd, bg.fxd, bg.fxd, bg.fxd, bg.fxd, bg.fxd, bg.fxd, bg.fxd, bg.fxd, bg.fxd, bg.fxd, bg.fbr, bg.g],
        [bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g, bg.g]
    ]

    if (frameX === 0 && frameY === 0) {
        background[4][9] = 0; 
    } 

    if (background[1][17] !== 683 && background[1][1] !== 682 && frameY === 2) {
        background[1][18] = background[1][17];
        background[1][0] = background[1][17]; 
    }

    if (background[1][17] !== 683 && background[8][17] !== 723 && frameX === 2) {
        background[0][17] = background[1][17];
        background[9][17] = background[1][17]; 
    }

    if (background[1][1] !== 682 && background[8][1] !== 722 && frameX === -2) {
        background[0][1] = background[1][1];
        background[9][1] = background[1][1]; 
    }

    if (background[8][1] !== 722 && background[8][17] !== 723 && frameY === -2) {
        background[8][18] = background[8][1];
        background[8][0] = background[8][1]; 
    }

    if (frameX === 2 && frameY === 2) {
        background[1][0] = background[1][16]; 
        background[9][17] = background[8][17]; 
    }

    if (frameX === 2 && frameY === -2) {
        background[0][17] = background[1][17];
        background[8][0] = background[8][1]; 
    }

    if (frameX === -2 && frameY === 2) {
        background[1][18] = background[1][17];
        background[9][1] = background[2][1]; 
    }

    if (frameX === -2 && frameY === -2) {
        background[0][1] = background[1][1]; 
        background[8][18] = background[8][17];
    }    

    /* Drawing Player + Background */

    context.clearRect(0, 0, canvas.width, canvas.height)

    context.fillStyle = '#3abe41';
    context.fillRect(0, 0, canvas.width, canvas.height)

    for (let r=0; r<10; r+=1) {
        for (let c=0; c<19; c+=1) {
            let tile = background[r][c];
            if (tile >= 0) {
                let tileRow = Math.floor(tile / tilesPerRow);
                let tileCol = Math.floor(tile % tilesPerRow);
                context.drawImage(backgroundImage, 
                    tileCol * tileSize, tileRow * tileSize, tileSize, tileSize,
                    c * tileSize, r * tileSize, tileSize, tileSize);
            }    
        }
    }

    counter += 1;
    if (counter > 4) {
        counter = 0;
    }

    for (let enemy of enemys) {
        if (enemy.y > player.y + (player.height / 2)) {
            enemy.upordown = 1;
        } else {
            enemy.upordown = 0;
        }
        if (enemy.dead === false) {
            if (enemy.upordown === 0) {
                context.drawImage(enemyImage,
                enemy.frameX, enemy.frameY, enemy.width, enemy.height,
                enemy.x, enemy.y, enemy.width, enemy.height);

                enemy.direction = Math.atan2(enemy.y - player.y, enemy.x - player.x);

                let xChange = Math.cos(enemy.direction) * enemy.speed;
                let yChange = Math.sin(enemy.direction) * enemy.speed;

                enemy.x -= Math.round(xChange);
                enemy.y -= Math.round(yChange);

                
                if (xChange < 0) {
                    enemy.frameY = 32;
                } else if (xChange > 0) {
                    enemy.frameY = 96;
                }
                if (yChange > 0 && xChange > 0 && yChange > xChange) {
                    enemy.frameY = 0;
                } else if (yChange < 0 && xChange < 0 && yChange < xChange) {
                    enemy.frameY = 64;
                }
            }
        } else {
            enemy.frameX =0;
            enemy.frameY = 123;
            context.drawImage(enemyImage,
                enemy.frameX, enemy.frameY, enemy.width, enemy.height,
                enemy.x, enemy.y, enemy.width, enemy.height);
        }
    }
    
    context.drawImage(playerImage,
        player.frameX, player.frameY, player.width, player.height,
        player.x, player.y, player.width, player.height);

    for (let enemy of enemys) {
        if (enemy.dead === false) {
            if (enemy.upordown === 1) {
                context.drawImage(enemyImage,
                enemy.frameX, enemy.frameY, enemy.width, enemy.height,
                enemy.x, enemy.y, enemy.width, enemy.height);

                enemy.direction = Math.atan2(enemy.y - player.y, enemy.x - player.x);

                let xChange = Math.cos(enemy.direction) * enemy.speed;
                let yChange = Math.sin(enemy.direction) * enemy.speed;

                enemy.x -= Math.round(xChange);
                enemy.y -= Math.round(yChange);

                
                if (xChange < 0) {
                    enemy.frameY = 32;
                } else if (xChange > 0) {
                    enemy.frameY = 96;
                }
                if (yChange > 0 && xChange > 0 && yChange > xChange) {
                    enemy.frameY = 0;
                } else if (yChange < 0 && xChange < 0 && yChange < xChange) {
                    enemy.frameY = 64;
                }
            }
        } 
    }

    if (frameY === -2) {
        for (let r=0; r<10; r+=1) {
            for (let c=0; c<19; c+=1) {
                let tile = background[r][c];
                if (tile >= 0 && r === 8) {
                    let tileRow = Math.floor(tile / tilesPerRow);
                    let tileCol = Math.floor(tile % tilesPerRow);
                    context.drawImage(backgroundImage, 
                        tileCol * tileSize, tileRow * tileSize, tileSize, tileSize,
                        c * tileSize, r * tileSize, tileSize, tileSize);
                }    
            }
        }
    }

/* Boundaries + changing Location + Moving Character */
    
    if (player.x + player.width < 0) {
        player.x = canvas.width;
        enemys = []
        if (frameX > -2) {
            frameX += -1;
        }
        

    } else if (player.x > canvas.width) {
        player.x = 0;
        enemys = []
        if (frameX < 2) {
            frameX += 1;
        }
        
    } else if (player.y + player.height < 0) {
        player.y = canvas.height;
        enemys = []
        if (frameY < 2) {
            frameY += 1;
        }
        
    } else if (player.y > canvas.height) {
        player.y = 0;
        enemys = []
        if (frameY > -2) {
            frameY += -1;
        }
        
    }

    if (player.x+player.width > canvas.width-24 && frameX === 2) {
        player.x -= player.speed;
        

    }
    if (player.x < 28 && frameX === -2) {
        player.x += player.speed;
        
    }
    if (player.y > canvas.height-34 && frameY === -2) {
        player.y -= player.speed;
       
    }
    if (player.y < 20 && frameY === 2) {
        player.y += player.speed;
        
    }


    if (moveRight || moveLeft || moveDown || moveUp || space) {
        if (moveRight) {
            player.x += player.speed;
            
        }  
        if (moveLeft) {
            player.x -= player.speed;
    
        }  
        if (moveUp) {
            player.y -= player.speed;
            
        }  
        if (moveDown) {
            player.y += player.speed;
        
        }

        if (space && moveRight) {
            player.frameY = 199;
            player.speed = 1;
            player.width = 20;


        } else if (space && moveLeft) {
            player.frameY = 230;
            player.speed = 1;
            player.width = 20;

        } else if (space && moveUp) {
            player.frameY = 166;
            player.speed = 1;
            player.width = 20;

        } else if (space && moveDown) {
            player.frameY = 134;
            player.speed = 1;
            player.width = 20;

        } if (space) {
            player.speed = 1;
            player.width = 20;

            if (player.frameY === 39) {
                player.frameY = 199;

            }
            if (player.frameY === 102) {
                player.frameY = 230;

            }
            if (player.frameY === 69) {
                player.frameY = 166;

            }
            if (player.frameY === 6) {
                player.frameY = 134;

            }       

        } else {
            player.speed = 2;
            player.width = 16;

            if (moveRight) {
                player.frameY = 39;
            
            } 
        
            if (moveLeft) {
                player.frameY = 102;
        
            } 
        
            if (moveUp) {
                player.frameY = 69;
        
            } 
        
            if (moveDown) {
                player.frameY = 6;                                           
        
            } 
        } 

        if (counter % 4 === 0) {

            if (space || player.frameY === 199 || player.frameY === 230 || player.frameY === 166 || player.frameY === 134){
                player.frameX += spritedistance * 2;
            } else {
                player.frameX += spritedistance;
            } 

            if (player.frameX >= 96) {
                player.frameX = 0;
    
            } 

            if (player.frameX >= 64) {
                player.frameX = 0;
    
                }
        } 
        
        } else {
            player.frameX = 0;
    }

    if (counter % 4 === 0) {

        for (let enemy of enemys) {
            if (enemy.y !== player.y ) {
                enemy.frameX += 24;

                if (enemy.frameX > 48) {
                    enemy.frameX = 0;

                }
            } else {
                enemy.frameX = 0;
            }

            if (enemy.x+enemy.width > canvas.width-23 && frameX === 2) {
                enemy.x -= 24;
                
            }
            if (enemy.x < 27 && frameX === -2) {
                enemy.x += 28;
                
            }
            if (enemy.y > canvas.height-33 && frameY === -2) {
                enemy.y -= 34;
            
            }
            if (enemy.y < 19 && frameY === 2) {
                enemy.y += 20;
                
            }
        }
    }

    for (let enemy of enemys) {
        if (enemy.dead === false) {
            if (enemy.x < player.x) {
                if (enemy.y < player.y) {
                    if (enemy.x + enemy.width >= player.x && enemy.y + (enemy.height / 2) >= player.y) {
                        enemy.x -= 2;
                        enemy.y -= 2;
                        player.x += player.speed;
                        player.y += player.speed;

                        if (space && (player.frameY === 230 || player.frameY === 166)) {
                            enemy.dead = true;
                            coins += 1;
                        } else {
                        if (counter % 4 === 0) {
                            hearts -= 1;
                            if (space && (player.frameY === 230 || player.frameY === 166)) {
                                enemy.dead = true;
                                coins += 1;
                            }

                        }
                        }
                    }
                    } else if (enemy.y > player.y) {
                        if (enemy.x + enemy.width - 6 >= player.x && enemy.y <= player.y + 10 ){
                            enemy.x -= 2;
                            enemy.y += 2;
                            player.x += player.speed;
                            player.y -= player.speed;

                            if (space && (player.frameY === 230 || player.frameY === 134)) {
                                enemy.dead = true;
                                coins += 1;
                            } else {
                            if (counter % 4 === 0) {
                                hearts -= 1;
                                if (space && (player.frameY === 230 || player.frameY === 134)) {
                                    enemy.dead = true;
                                    coins += 1;
                                }

                            }
                        }
                        }
                    } 
                } 
            
            if (enemy.x > player.x) {
                if (enemy.y < player.y) {
                    if (enemy.x <= player.x + player.width && enemy.y + (enemy.height / 2) >= player.y) {
                        enemy.x += 2;
                        enemy.y -= 2;
                        player.x -= player.speed;
                        player.y += player.speed;

                        if (space && (player.frameY === 199 || player.frameY === 166)) {
                            enemy.dead = true;
                            coins += 1;
                        } else {
                        if (counter % 4 === 0) {
                            hearts -= 1;
                            if (space && (player.frameY === 199 || player.frameY === 166)) {
                                enemy.dead = true;
                                coins += 1;
                            }

                        }
                        }
                    }
                    } else if (enemy.y > player.y) {
                        if (enemy.x <= player.x + player.width && enemy.y <= player.y + 10){
                            enemy.x += 2;
                            enemy.y += 2;
                            player.x -= player.speed;
                            player.y -= player.speed;

                            if (space && (player.frameY === 199 || player.frameY === 134)) {
                                enemy.dead = true;
                                coins += 1;
                            } else {
                            if (counter % 4 === 0) {
                                hearts -= 1;
                                if (space && (player.frameY === 199 || player.frameY === 134)) {
                                    enemy.dead = true;
                                    coins += 1;
                                }

                            }
                        }
                    }
                    } 
                }
                
                if (enemy.y === player.y && enemy.x === player.x) {
                    if (space) {
                        enemy.dead = true;
                        coins += 1;
                        
                    } else {
                        if (counter % 4 === 0) {
                            hearts -= 5;
                            if (space) {
                                enemy.dead = true;
                                coins += 1;
                                
                            } 

                        }
                    }
        
                }

                if (enemy.x === player.x) {
                    if (enemy.y <= player.y) {
                        if (enemy.y + (enemy.height / 2) === player.y){
                            enemy.y -= 2;
                            player.y += player.speed;
                            if (space && player.frameY === 166) {
                                enemy.dead = true;
                                coins += 1;
                                
                            } else {
                                if (counter % 4 === 0) {
                                    hearts -= 1;
                                    if (space && player.frameY === 166) {
                                        enemy.dead = true;
                                        coins += 1;
                                        
                                    } 
        
                                }   
                            }
                        }
                    } else if (enemy.y >= player.y) {
                        if (enemy.y === player.y + (player.height / 2)){
                            enemy.y += 2;
                            player.y -= player.speed;
                            if (space && player.frameY === 134) {
                                enemy.dead = true;
                                coins += 1;
                                
                            } else {
                                if (counter % 4 === 0) {
                                    hearts -= 1;
                                    if (space && player.frameY === 134) {
                                        enemy.dead = true;
                                        coins += 1;
                                        
                                    }
        
                                }
                            }
                        }
                    }
                }

                if (enemy.y === player.y) {
                    if (enemy.x <= player.x) {
                        if (enemy.x + enemy.width === player.x){
                            enemy.x -= 2;
                            player.x += player.speed;
                            if (space && player.frameY === 230) {
                                enemy.dead = true;
                                coins += 1;
                                
                            } else {
                                if (counter % 4 === 0) {
                                    hearts -= 1;
                                    if (space  && player.frameY === 230) {
                                        enemy.dead = true;
                                        coins += 1;
                                        
                                    } 
        
                                }
                            }
                        }
                    } else if (enemy.x >= player.x) {
                        if (enemy.x === player.x + player.width - 6){
                            enemy.x += 2;
                            player.x -= player.speed;
                            if (space && player.frameY === 199) {
                                enemy.dead = true;
                                coins += 1;
                                
                            } else {
                                if (counter % 4 === 0) {
                                    hearts -= 1;
                                    if (space && player.frameY === 199) {
                                        enemy.dead = true;
                                        coins += 1;
                                        
                                    } 

                                }           
                            }
                        }
                    } 
                }

    }
    }
    
}

/* Key event watchers */

function activate(event) {
    let key = event.key;
    if (key === "ArrowLeft") {
        moveLeft = true;

    } else if (key === "ArrowRight") {
        moveRight = true;

    } else if (key === "ArrowUp") {
        moveUp = true;

    } else if (key === "ArrowDown") {
        moveDown = true;

    } else if (key === ' ') {
        space = true;
    }
}

function deactivate(event) {
    let key = event.key;
    if (key === "ArrowLeft") {
        moveLeft = false;

    } else if (key === "ArrowRight") {
        moveRight = false;

    } else if (key === "ArrowUp") {
        moveUp = false;

    } else if (key === "ArrowDown") {
        moveDown = false;

    } else if (key === ' ') {
        space = false;
    }
}

/* stop game + increase level */

function levelend() {
    coins -= coinsdue;
    if (hearts <= 0) {
        hearts = 0;
        document.getElementById("message").innerHTML = 'You Died.';
        level -= 1;
        house()
        stop()

    } else {
        if (coins < 0) {
            document.getElementById("message").innerHTML = 'You failed to pay rent for day ' + level + '. Better luck next time.';
            house()
            stop()
        } else {
            document.getElementById("message").innerHTML = 'You managed to pay rent for day ' + level + '. Congrats.';
            hearts = 100;
            timer = 1.5;
            level += 1;
            frameX = 0;
            frameY = 0;
            coinsdue += 4;
            enemys = []
                    
            player.x = canvas.width / 2 - player.width / 2;
            player.y = canvas.height - player.height * 1.25;
            return;
        }
    }

}

function house() {
    let screen = document.getElementById('screen');
    let retry = document.getElementById('retry');
    let p = document.createElement('p');
    let a = document.createElement('a');
    let section = document.createElement('section');
    section.setAttribute('id', 'house2')
    screen.remove()
    retry.appendChild(section);
    section.appendChild(p);
    p.appendChild(a);
    a.innerHTML = 'Click here to try again.'.link('/~es15/cgi-bin/ca2/run.py/game');
}

function stop() {
    window.removeEventListener("keydown",activate,false);
    window.removeEventListener("keyup",deactivate,false);
    window.cancelAnimationFrame(request_id);
    if (level != 1) {
        let data = new FormData();
        data.append('level', level);
        data.append('coins', coins);
        xhttp = new XMLHttpRequest();
        xhttp.addEventListener('readystatechange', handle_response, false);
        xhttp.open('POST', '/~es15/cgi-bin/ca2/run.py/store_score', true);
        xhttp.send(data);
    }
}

function handle_response() {
    if (xhttp.readyState === 4) {
        if (xhttp.status === 200) {
            if (xhttp.responseText === 'success') {
                document.getElementById("warning").innerHTML = 'New Highscore!';
                house()
            } else if (xhttp.responseText === 'toobad') {
                document.getElementById("warning").innerHTML = "You didn't beat your highscore, try again!";

            } else if (xhttp.responseText === 'login') {
                document.getElementById("warning").innerHTML = "You didn't login.";

            } else {
                document.getElementById("warning").innerHTML = 'Sincerest apologies, your score has been lost to the infinite void.';

            }
        }
    }
}

/* randint */

function randint(min,max) {
    return Math.round(Math.random() * (max-min)) + min;

}
