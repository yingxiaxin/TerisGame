import { Point, IViewer } from "./types";

/**
 * 小方块
 */
export class Square {
    private _point: Point = {
        x: 0,
        y: 0
    };      // 坐标
    private _color: string = 'red';     // 颜色
    private _viewer?: IViewer;  // 显示者

    public get point() {
        return this._point;
    }

    public set point(val: Point) {
        this._point = val;
        // 完成显示
        if (this._viewer) {
            this._viewer.show();
        }
    }

    public get color() {
        return this._color;
    }

    public set color(val: string) {
        this._color = val;
        // 完成显示
        if (this._viewer) {
            this._viewer.show();
        }
    }

    public get viewer() {
        return this._viewer;
    }

    public set viewer(val) {
        if (val) {
            this._viewer = val;
            this._viewer.show();
        }
    }
}