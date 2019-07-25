import { GameViewer, GameStatus } from "../types";
import { SquareGroup } from "../SquareGroup";
import { SquarePageViewer } from "./SquarePageViewer";
import { Game } from "../Game";
import GameConfig from "../GameConfig";
import PageConfig from "./PageConfig";

export class GamePageViewer implements GameViewer {

    private nextDom: HTMLElement = document.getElementById('next') as HTMLElement;
    private panelDom: HTMLElement = document.getElementById('panel') as HTMLElement;
    private scoreDom: HTMLElement = document.getElementById('score') as HTMLElement;
    private msgDom: HTMLElement = document.getElementById('msg') as HTMLElement;
    private msgText: HTMLElement = document.getElementById('msgText') as HTMLElement;

    showNext(teris: SquareGroup): void {
        teris.squares.forEach(sq => {
            sq.viewer = new SquarePageViewer(sq, this.nextDom);
        });
    }

    switch(teris: SquareGroup): void {
        teris.squares.forEach(sq => {
            // !是与？相对的，表示强制解析，这里一定有值
            sq.viewer!.remove();
            sq.viewer = new SquarePageViewer(sq, this.panelDom);
        });
    }

    init(game: Game) {
        // 1、设置宽高
        this.panelDom.style.cssText = this.panelDom.style.cssText + `width: ${GameConfig.panelSize.width * PageConfig.squareSize.width}px;
                                                                     height: ${GameConfig.panelSize.height * PageConfig.squareSize.height}px;`;
        this.nextDom.style.cssText = this.nextDom.style.cssText + `width: ${GameConfig.nextSize.width * PageConfig.squareSize.width}px;
                                                                   height: ${GameConfig.nextSize.height * PageConfig.squareSize.height}px`;
        // 2、注册键盘事件
        document.addEventListener('keydown', e => {
            switch (e.keyCode) {
                case 37: {
                    // 方向键左
                    game.controlLeft();
                    break;
                }
                case 38: {
                    // 方向键上
                    game.controlRotate();
                    break;
                }
                case 39: {
                    // 方向键右
                    game.controlRight();
                    break;
                }
                case 40: {
                    // 方向键下
                    game.controlDown();
                    break;
                }
                case 32: {
                    // 空格
                    if (game.gameStatus === GameStatus.playing) {
                        game.pause();
                    } else {
                        game.start();
                    }
                    break;
                }
            }
        });
    }

    showScore(score: number) {
        this.scoreDom.innerHTML = score.toString();
    }

    onGameOver() {
        this.msgDom.style.opacity = '1';
        this.msgText.innerHTML = '游戏结束';
    }

    onGamePause() {
        this.msgDom.style.opacity = '1';
        this.msgText.innerHTML = '游戏暂停';
    }

    onGameStart() {
        this.msgDom.style.opacity = '0';
    }
}