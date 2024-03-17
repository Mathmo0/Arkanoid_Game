import { Vector } from "../types";
import { BRICK_ENERGY } from "../setup"

export class Brick {
    private brickImage: HTMLImageElement = new Image();

    constructor(
        private brickWidth: number,
        private brickHeight: number,
        private position: Vector,
        private brickEnergy: number,
        image: string
    ) {
        this.brickWidth = brickWidth;
        this.brickHeight = brickHeight;
        this.position = position;
        this.brickEnergy = brickEnergy;
        this.brickImage.src = image; // chemin de l'image
    }

    // get
    get width(): number {
        return this.brickWidth;
    }

    get height(): number {
        return this.brickHeight;
    }

    get pos(): Vector {
        return this.position;
    }

    get image(): HTMLImageElement {
        return this.brickImage;
    }

    get energy(): number {
        return this.brickEnergy;
    }

    // set
    set energy(energy: number) {
        this.brickEnergy = energy;
    }

    addClickEvent(clickEvent: boolean) {
        if (clickEvent) {
            this.brickImage?.addEventListener('click', () => {
                if(this.brickEnergy < BRICK_ENERGY[-1])
                    this.brickEnergy += 1;
                else
                    this.brickEnergy = 0;
            });
        }
        else {
            this.brickImage?.addEventListener('click', () => {

            });
        }
    }
}