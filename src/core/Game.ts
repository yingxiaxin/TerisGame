import { GameStatus, MoveDirection, GameViewer } from "./types";
import { SquareGroup } from "./SquareGroup";
import { TerisRule } from "./TerisRule";
import { createTeris } from "./Teris";
import GameConfig from "./GameConfig";
import { Square } from "./Square";

export class Game {
    // 本来包含成员：
    // 1、游戏状态
    // 2、当前玩家操作的方块
    // 3、下一个方块
    // 4、计时器
    // 5、自动下落的间隔时间
    // 6、显示对象
    // 7、当前游戏中已存在的方块
    // 8、分数
    private _gameStatus: GameStatus = GameStatus.init;
    private _curTeris?: SquareGroup;
    private _nextTeris: SquareGroup = createTeris({ x: 2, y: 2 });
    private _timer?: number;
    private _duration: number = GameConfig.level[0].duration;
    private _viewer: GameViewer;
    private _exists: Square[] = [];
    private _score: number = 0;

    // 访问器
    // 分数访问器
    public get score() {
        return this._score;
    }

    public set score(val: number) {
        this._score = val;
        this._viewer.showScore(this._score);

        // 分数发生变化的时候，需要进行级别判断，好更改下落的时间间隔
        const level = GameConfig.level.filter(it => it.score <= this._score).pop()!;
        if (level.duration === this._duration) {
            return;
        }
        this._duration = level.duration;
        // 停止原先的计时器，并根据新的下落间隔时间，重新开启定时器
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = undefined;
            this.autoDrop();
        }
    }

    // 游戏状态访问器
    public get gameStatus() {
        return this._gameStatus;
    }

    constructor(viewer: GameViewer) {
        this._viewer = viewer;
        this.resetCenterPoint(GameConfig.nextSize.width, this._nextTeris);
        this._viewer.showNext(this._nextTeris);
        this._viewer.init(this);
        this._viewer.showScore(this.score);
    }


    private init() {
        this._exists.forEach(sq => {
            if (sq.viewer) {
                sq.viewer.remove();
            }
        });
        this._exists = [];
        this._nextTeris = createTeris({ x: 0, y: 0 });
        this.resetCenterPoint(GameConfig.nextSize.width, this._nextTeris);
        this._viewer.showNext(this._nextTeris);
        this._curTeris = undefined;
        this.score = 0;
    }

    /**
     * 游戏开始
     */
    public start() {
        // 游戏状态改变
        if (this._gameStatus === GameStatus.playing) {
            return;
        }
        // 从游戏结束到开始
        if (this._gameStatus === GameStatus.over) {
            // 初始化操作
            this.init();
        }
        this._gameStatus = GameStatus.playing;

        if (!this._curTeris) {
            // 给当前玩家操作的方块赋值
            this.switchTeris();
        }
        this.autoDrop();

        this._viewer.onGameStart();
    }

    /**
     * 游戏暂停
     */
    public pause() {
        if (this._gameStatus === GameStatus.playing) {
            this._gameStatus = GameStatus.pause;
            clearInterval(this._timer);
            this._timer = undefined;

            this._viewer.onGamePause();
        }
    }

    public controlLeft() {
        if (this._curTeris && this._gameStatus === GameStatus.playing) {
            TerisRule.move(this._curTeris, MoveDirection.left, this._exists);
        }
    }

    public controlRight() {
        if (this._curTeris && this._gameStatus === GameStatus.playing) {
            TerisRule.move(this._curTeris, MoveDirection.right, this._exists);
        }
    }

    public controlDown() {
        if (this._curTeris && this._gameStatus === GameStatus.playing) {
            TerisRule.moveDirectly(this._curTeris, MoveDirection.down, this._exists);
            // 触底
            this.hitBottom();
        }
    }

    public controlRotate() {
        if (this._curTeris && this._gameStatus === GameStatus.playing) {
            TerisRule.rotate(this._curTeris, this._exists);
        }
    }

    /**
     * 切换方块
     */
    private switchTeris() {
        this._curTeris = this._nextTeris;
        this.resetCenterPoint(GameConfig.panelSize.width, this._curTeris);
        // 暂时先移除viewer，为了当游戏结束判断时，“下一方块”提示处直接消失
        // 否则主面板和提示面板大小不一致，游戏结束会跳动一下
        this._curTeris.squares.forEach(sq => {
            if (sq.viewer) {
                sq.viewer.remove();
            }
        });

        // 有可能出问题，当前方块一出现时，就已经和之前的方块重叠了
        // 那么此处判断游戏是否结束
        if (!TerisRule.canIMove(this._curTeris.shape, this._curTeris.centerPoint, this._exists)) {
            // 游戏结束
            this._gameStatus = GameStatus.over;
            clearInterval(this._timer);
            this._timer = undefined;

            this._viewer.onGameOver();
            return;
        }

        this._nextTeris = createTeris({ x: 0, y: 0 });
        this.resetCenterPoint(GameConfig.nextSize.width, this._nextTeris);
        this._viewer.switch(this._curTeris);
        this._viewer.showNext(this._nextTeris);
    }

    /**
     * 当前方块自由下落
     */
    private autoDrop() {
        if (this._timer || this._gameStatus !== GameStatus.playing) {
            return;
        }
        this._timer = setInterval(() => {
            if (this._curTeris) {
                if (!TerisRule.move(this._curTeris, MoveDirection.down, this._exists)) {
                    // 触底
                    this.hitBottom();
                }
            }
        }, this._duration);
    }


    /**
     * 重新设置下一个方块的中心点坐标。让方块出现在容器的中上方
     * 因为用0，0的默认值，会使得方块部分超过边界
     * @param width 逻辑宽度，而不是容器的实际像素宽度
     * @param teris 需要显示的方块
     */
    private resetCenterPoint(width: number, teris: SquareGroup) {
        const x = Math.ceil(width / 2) - 1;
        let y = 0;
        teris.centerPoint = { x, y };
        while (teris.squares.some(it => it.point.y < 0)) {
            teris.centerPoint = {
                x: teris.centerPoint.x,
                y: teris.centerPoint.y + 1,
            }
        }
    }


    private hitBottom() {
        // 将当前的俄罗斯方块包含的小方块加入到exists方块数组中
        this._exists = this._exists.concat(this._curTeris!.squares);

        // 处理移除
        const num = TerisRule.deleteSquare(this._exists);

        // 增加积分
        this.addScore(num);

        // 切换方块
        this.switchTeris();
    }

    private addScore(lineNum: number) {
        switch (lineNum) {
            case 0: {
                return;
            }
            case 1: {
                this.score += 10;
                break;
            }
            case 2: {
                this.score += 15;
                break;
            }
            case 3: {
                this.score += 20;
                break;
            }
            case 4: {
                this.score += 25;
                break;
            }
            default: {
                this.score += 30;
                break;
            }
        }
    }
}