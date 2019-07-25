import { Square } from "./Square";
import { Shape, Point } from "./types";

/**
 * 组合方块
 */
export class SquareGroup {
    private _squares: readonly Square[];
    private _shape: Shape;
    private _centerPoint: Point;
    private _color: string;
    protected _isClockWise: boolean = true;        // 旋转方向是否为顺时针

    // 访问器部分
    // 1、获取square
    public get squares() {
        return this._squares;
    }

    // 2、获取和设置centerPoint
    public get centerPoint(): Point {
        return this._centerPoint;
    }

    public set centerPoint(val: Point) {
        this._centerPoint = val;
        this.setSquarePoints();
    }

    // 3、获取和设置形状shape
    public get shape() {
        return this._shape;
    }

    public constructor(shape: Shape, centerPoint: Point, color: string) {
        this._shape = shape;
        this._centerPoint = centerPoint;
        this._color = color;

        // 设置小方块数组
        const array: Square[] = [];
        this._shape.forEach(p => {
            const sq = new Square();
            sq.color = this._color;
            sq.point = {
                x: this._centerPoint.x + p.x,
                y: this._centerPoint.y + p.y
            }
            array.push(sq);
        });
        this._squares = array;
    }

    /**
     * 获取旋转后的形状shape的新坐标
     */
    public rotateShape(): Shape {
        if (this._isClockWise) {
            return this._shape.map(p => {
                return {
                    x: -p.y,
                    y: p.x,
                }
            });
        } else {
            return this._shape.map(p => {
                return {
                    x: p.y,
                    y: -p.x,
                }
            });
        }
    }

    public rotate() {
        const newShape: Shape = this.rotateShape();
        this._shape = newShape;
        this.setSquarePoints();
    }

    /**
     * 根据中心点坐标，以及形状，设置每一个小方块的坐标
     */
    private setSquarePoints() {
        // 同时设置所有小方块的坐标
        this._shape.forEach((p, i) => {
            this._squares[i].point = {
                x: this._centerPoint.x + p.x,
                y: this._centerPoint.y + p.y
            };
        });
    }
}