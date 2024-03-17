// Types
import { Brick } from "../sprites/Brick";
import { Paddle } from "../sprites/Paddle";
import { Ball } from "../sprites/Ball";

export class CanvasView {
    canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D | null;
    private scoreDisplay: HTMLObjectElement | null;
    private start: HTMLObjectElement | null;
    private edit: HTMLObjectElement | null;
    private info: HTMLObjectElement | null;
    private changeSize: HTMLObjectElement | null;

    constructor(canvasName: string){
        this.canvas = document.querySelector(canvasName) as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d');
        this.scoreDisplay = document.querySelector('#score');
        this.start = document.querySelector('#start');
        this.edit = document.querySelector('#edit');
        this.info = document.querySelector('#info');
        this.changeSize = document.querySelector('#ChangeSize');
    }

    clear(): void {
        this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    initStartButton(startFunction: (view: CanvasView) => void): void {
        this.start?.addEventListener('click', () => startFunction(this));
    }

    initEditButton(editFunction: (view: CanvasView) => void): void {
        this.edit?.addEventListener('click', () => editFunction(this));
    }

    initChangeSizeButton(changeSizeFunction: (view: CanvasView) => void): void {
        this.changeSize?.addEventListener('click', () => changeSizeFunction(this));
    }

    showChangeSize(show: boolean): void{
        if(this.changeSize != undefined)
            this.changeSize.style.display = show ? "block" : "none"; 
    }

    drawScore(score: number): void {
        if (this.scoreDisplay) this.scoreDisplay.innerHTML = score.toString();
    }

    drawInfo(text: string): void {
        if (this.info) this.info.innerHTML = text;
    }

    drawSprite(brick: Brick | Paddle | Ball): void {
        if (!brick) return;

        this.context?.drawImage(
            brick.image, 
            brick.pos.x,
            brick.pos.y,
            brick.width,
            brick.height
        );
    }

    drawBrick(brick: Brick[]): void {
        brick.forEach(brick => this.drawSprite(brick));
    }
}