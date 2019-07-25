import { Square } from "../Square";
import { IViewer } from "../types";
import PageConfig from "./PageConfig";

/**
 * 显示一个小方块到页面上
 */
export class SquarePageViewer implements IViewer {

    private square: Square;
    private container: HTMLElement;
    private dom?: HTMLElement;
    private isRemove: boolean = false;

    public constructor(square: Square, container: HTMLElement) {
        this.square = square;
        this.container = container;
    }

    public show(): void {
        // 如果已经被移除，不再显示
        if (this.isRemove) {
            return;
        }
        if (!this.dom) {
            // 初始生成小方块的样式
            let div = document.createElement('div');
            div.style.cssText = `position: absolute;
                                 width: ${PageConfig.squareSize.width}px;
                                 height: ${PageConfig.squareSize.height}px;
                                 border: 1px solid #ccc;
                                 box-sizing: border-box;`;
            this.dom = div;
            this.container.append(this.dom);
        }
        // 小方块的位置、颜色等会变化的样式设置
        this.dom.style.left = this.square.point.x * PageConfig.squareSize.width + 'px';
        this.dom.style.top = this.square.point.y * PageConfig.squareSize.height + 'px';
        this.dom.style.backgroundColor = this.square.color;
    }

    public remove(): void {
        if (this.dom && !this.isRemove) {
            this.container.removeChild(this.dom);
            this.isRemove = true;
        }
    }
}