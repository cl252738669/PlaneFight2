import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

// 游戏配置常量
const GAME_CONFIG = {
    INITIAL_BOMB: 1,
    INITIAL_LIFE: 3,
    INITIAL_SCORE: 0,
};

@ccclass('GameManager')
export class GameManager extends Component {

    private static _instance: GameManager = null;
    private bombNumber: number = GAME_CONFIG.INITIAL_BOMB;
    private lifeNumber: number = GAME_CONFIG.INITIAL_LIFE;
    private score: number = GAME_CONFIG.INITIAL_SCORE;

    onLoad() {
        if (GameManager._instance == null) {
            GameManager._instance = this;
        } else {
            this.destroy();
        }
    }

     public static get instance(): GameManager {
        return this._instance;
    }

    onLifeCountChange(count: number) {
        this.lifeNumber += count;

        if (this.lifeNumber < 0) {
            this.lifeNumber = 0;
            return;
        }   

        this.node.emit('updateLifeCountUI', this.lifeNumber);
    }

    lifeCount(): number {
        return this.lifeNumber;
    }

    onBombChange(count: number) {
        this.bombNumber += count;

        // 0个炸弹不处理
        if (this.bombNumber < 0) {
            this.bombNumber = 0;
            return;
        }

        this.node.emit('updateBombUI',this.bombNumber);
    }

    bombCount(): number {
        return this.bombNumber;
    }

    onScoreChange(count: number) {
        this.score += count;
        this.node.emit('updateScoreUI', this.score);
    }

    scoreCount(): number {
        return this.score;
    }

    reaetGame() {
        this.bombNumber = GAME_CONFIG.INITIAL_BOMB;
        this.lifeNumber = GAME_CONFIG.INITIAL_LIFE;
        this.score = GAME_CONFIG.INITIAL_SCORE;

        this.node.emit('updateBombUI',this.bombNumber);
        this.node.emit('updateLifeCountUI', this.lifeNumber);
        this.node.emit('updateScoreUI', this.score);
    }
}

