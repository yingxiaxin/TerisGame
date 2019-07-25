import { Shape, Point } from "./types";
import { getRandom } from "./util";
import { SquareGroup } from "./SquareGroup";

/**
 * “T”型的方块
 */
export class TShape extends SquareGroup {

    constructor(centerPoint: Point, color: string) {
        super([
            { x: -2, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: -1 }
        ], centerPoint, color);
    }
}

/**
 * “L”型的方块
 */
export class LShape extends SquareGroup {

    constructor(centerPoint: Point, color: string) {
        super([
            { x: -2, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: -1 }
        ], centerPoint, color);
    }
}

/**
 * “L”型镜像的方块
 */
export class LMirrorShape extends SquareGroup {

    constructor(centerPoint: Point, color: string) {
        super([
            { x: 2, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: -1 }
        ], centerPoint, color);
    }
}

/**
 * “Z”型的方块
 */
export class SShape extends SquareGroup {

    constructor(centerPoint: Point, color: string) {
        super([
            { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 1 }
        ], centerPoint, color);
    }

    rotate() {
        super.rotate();
        this._isClockWise = !this._isClockWise;
    }
}

/**
 * “Z”型镜像的方块
 */
export class SMirrorShape extends SquareGroup {

    constructor(centerPoint: Point, color: string) {
        super([
            { x: 0, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }
        ], centerPoint, color);
    }

    rotate() {
        super.rotate();
        this._isClockWise = !this._isClockWise;
    }
}

/**
 * 正方形的方块
 */
export class SquareShape extends SquareGroup {

    constructor(centerPoint: Point, color: string) {
        super([
            { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }
        ], centerPoint, color);
    }

    public rotateShape() {
        return this.shape;
    }
}

/**
 * 长条形的方块
 */
export class LineShape extends SquareGroup {

    constructor(centerPoint: Point, color: string) {
        super([
            { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }
        ], centerPoint, color);
    }

    rotate() {
        super.rotate();
        this._isClockWise = !this._isClockWise;
    }
}

export const shapes = [
    TShape,
    LShape,
    LMirrorShape,
    SShape,
    SMirrorShape,
    SquareShape,
    LineShape,
];

export const colors = [
    'red',
    'blue',
    'green',
    'orange',
    'purple',
    'white',
];

/**
 * 随机产生一个俄罗斯方块（颜色随机、形状随机）
 * @param centerPoint 
 */
export function createTeris(centerPoint: Point): SquareGroup {
    let index = getRandom(0, shapes.length);
    const shape = shapes[index];
    index = getRandom(0, colors.length);
    const color = colors[index];
    return new shape(centerPoint, color); 
}