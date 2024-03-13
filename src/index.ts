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
    BALL_STARTY
} from './setup';

// helpers
import { createBricks } from "./helpers";

let gameOver = false;
let score = 0;

function setGameOver(view: CanvasView) {
    view.drawInfo('GAME OVER !');
    gameOver = false;
}

function setGameWin(view: CanvasView) {
    view.drawInfo('GAME WON !');
    gameOver = false;
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

function startGame(view: CanvasView) {
    // reset display
    score = 0;
    view.drawInfo('');
    view.drawScore(0);
    // create collision instance
    const collision = new Collision();
    // create all bricks
    const bricks = createBricks();
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

    gameLoop(view, bricks, paddle, ball, collision);
}

// Create a new view
const view = new CanvasView('#playField');
view.initStartButton(startGame);