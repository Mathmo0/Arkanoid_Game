import { CanvasView } from "./View/CanvasView";
import { Ball } from "./sprites/Ball";
import { Brick } from "./sprites/Brick";
import { Paddle } from "./sprites/Paddle";
import { Collision } from "./Collision";

// Images
import PADDLE_IMAGE from './images/barre.png';
import BALL_IMAGE from './images/ball.png';

// Level and Colors
import {
    PADDLE_SPEED,
    PADDLE_WIDTH,
    PADDLE_HEIGHT,
    PADDLE_STARTX,
    BALL_SPEED,
    BALL_SIZE,
    BALL_STARTX,
    BALL_STARTY,
    BRICK_ENERGY, 
    BRICK_IMAGES,
} from './setup';

// helpers
import { createBrickEditLevel, createBricks, createEmptyBrickLevel } from "./helpers";

let gameOver = false;
let score = 0;
let brickGlobal = [] as Brick[];
let brickGlobalCopy = [] as Brick[];

function setGameOver(view: CanvasView) {
    view.drawInfo('GAME OVER !');
    gameOver = false;
    brickGlobal = brickGlobalCopy;
}

function setGameWin(view: CanvasView) {
    view.drawInfo('GAME WON !');
    gameOver = false;
    brickGlobal = brickGlobalCopy;
}

function gameLoop(
    view: CanvasView,
    bricks: Brick[],
    paddle: Paddle,
    ball: Ball,
    collision: Collision
){
    view.clear();
    view.drawBrick(bricks);
    view.drawSprite(paddle);
    view.drawSprite(ball);

    // move ball
    ball.moveBall();

    // On verifie qu'il ne sorte pas de du champs
    if (
        (paddle.isMovingLeft && paddle.pos.x > 0) ||
        (paddle.isMovingRight && paddle.pos.x < view.canvas.width - paddle.width)
    ) {
        paddle.movePaddle();
    }

    collision.checkBallCollision(ball, paddle, view);

    if (collision.isCollidingBricks(ball, bricks)) {
        score += 1;
        view.drawScore(score);
    }

    // le jeu se termine quand la ball sort du terrain
    gameOver = ball.pos.y > view.canvas.height;
    if (bricks.length === 0) {
        view.clear();
        view.drawBrick(bricks);
        view.drawSprite(paddle);
        view.drawSprite(ball); 
        return setGameWin(view);
     }
    if (gameOver) return setGameOver(view); 

    requestAnimationFrame(() => gameLoop(view, bricks, paddle, ball, collision));
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

function startGame(view: CanvasView) {
    // reset display
    score = 0;
    view.drawInfo('');
    view.drawScore(0);
    view.showChangeSize(false);
    view.canvas.removeEventListener('click', onClickCanvasEdit);
    // create collision instance
    const collision = new Collision();
    // create all bricks
    if (brickGlobal.length != 0){
        brickGlobal = brickGlobal.filter((elmt) => elmt.image.src.split('/').pop() !== BRICK_IMAGES[0].split('/').pop());
        brickGlobalCopy = brickGlobal.filter((elmt) => elmt.image.src.split('/').pop() !== BRICK_IMAGES[0].split('/').pop());
    }
    else{
        brickGlobal = createBricks();
        brickGlobalCopy = createBricks();
    }
    // create ball
    const ball = new Ball(
        BALL_SPEED,
        BALL_SIZE,
        {
            x: BALL_STARTX,
            y: BALL_STARTY
        },
        BALL_IMAGE
    );
    // create a paddle
    const paddle = new Paddle(
        PADDLE_SPEED, 
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
        {
            x: PADDLE_STARTX,
            y: view.canvas.height - PADDLE_HEIGHT - 5
        },
        PADDLE_IMAGE
    );

    gameLoop(view, brickGlobal, paddle, ball, collision);
}

function editLevel(view: CanvasView) {
    view.showChangeSize(true);
    // reset display
    score = 0;
    view.drawInfo('');
    // create all bricks
    brickGlobal = createBrickEditLevel();
    brickGlobal.forEach(element => {
        element.image.addEventListener('click', () => {
            if(element.energy < 5)
                element.energy += 1;
            else
                element.energy = 0;
            view.clear();
            view.drawBrick(brickGlobal);
        });
    });
    view.canvas.addEventListener('click', onClickCanvasEdit);
    view.clear();
    view.drawBrick(brickGlobal);
}

function onClickCanvasEdit(event: MouseEvent){
    var x = event.pageX - (view.canvas.offsetLeft + view.canvas.clientLeft);
    var y = event.pageY - (view.canvas.offsetTop + view.canvas.clientTop);
    brickGlobal.forEach((elmt) => {
        if (y > elmt.pos.y && y < elmt.pos.y + elmt.height && x > elmt.pos.x && x < elmt.pos.x + elmt.width){ 
            if (elmt.image.src.split('/').pop() != BRICK_IMAGES[5].split('/').pop()){
                var i = 0;
                for(i; i <= 5; i++){
                    if (BRICK_IMAGES[i].split('/').pop() == elmt.image.src.split('/').pop()){
                        break;
                    }
                }
                i++;
                elmt.energy = BRICK_ENERGY[i > 5 ? 0 : i];
                elmt.image.src = BRICK_IMAGES[i > 5 ? 0 : i];
            }
            else {
                elmt.energy = BRICK_ENERGY[0];
                elmt.image.src = BRICK_IMAGES[0]
            }
        }
    });
    view.clear();
    view.drawBrick(brickGlobal);
    event.stopImmediatePropagation();
}

function clearBricks(view: CanvasView) {
    brickGlobal = createEmptyBrickLevel();
    view.clear();
    view.drawBrick(brickGlobal);
}

// Create a new view
const view = new CanvasView('#playField');
view.initStartButton(startGame);
view.initEditButton(editLevel);
view.initChangeSizeButton(clearBricks);