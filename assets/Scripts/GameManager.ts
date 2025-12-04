import { _decorator, Component, director, Node, find } from 'cc';
const { ccclass, property } = _decorator;

// 游戏配置常量
const GAME_CONFIG = {
    INITIAL_BOMB: 1,
    INITIAL_LIFE: 3,
    INITIAL_SCORE: 0,
    HEIGHEST_SCORE: 'heighestScore',
};

@ccclass('GameManager')
export class GameManager extends Component {

    private static _instance: GameManager = null;
    private bombNumber: number = GAME_CONFIG.INITIAL_BOMB;
    private lifeNumber: number = GAME_CONFIG.INITIAL_LIFE;
    private score: number = GAME_CONFIG.INITIAL_SCORE;
    private gamePaused: boolean = false;

    @property(Node)
    public pauseButton: Node = null;
    @property(Node)
    public resumeButton: Node = null;

    onLoad() {
        if (GameManager._instance == null) {
            GameManager._instance = this;
        } else {
            this.destroy();
        }

        this.pauseButton.active = true;
        this.resumeButton.active = false;
    }

     public static get instance(): GameManager {

        return this._instance;
    }

    // 生命变化
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

    //
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

    // 分数变化
    onScoreChange(count: number) {
        this.score += count;
        this.node.emit('updateScoreUI', this.score);
    }

    scoreCount(): number {
        return this.score;
    }

    onPauseButtonClick() {
        console.log('Game Paused');
        director.pause();
        this.gamePaused = true;
        this.pauseButton.active = false;
        this.resumeButton.active = true;
    }

    onResumeButtonClick() {
        console.log('Game Resumed');
        director.resume();
        this.gamePaused = false;
        this.pauseButton.active = true;
        this.resumeButton.active = false;
    }

    getIsGamePaused(): boolean {
        return this.gamePaused;
    }

    gameOver() {
        console.log('Game Over');
        this.onPauseButtonClick();

        let heighestScore = localStorage.getItem(GAME_CONFIG.HEIGHEST_SCORE);
        let heighestScoreInt = 0;
        if (heighestScore) {
            heighestScoreInt = parseInt(heighestScore,10);
        }

        if (this.score > heighestScoreInt) {
            localStorage.setItem(GAME_CONFIG.HEIGHEST_SCORE,this.score.toString())
        }

        this.node.emit('gameOverEvent', heighestScoreInt, this.score);
        // this.resetGame();
    }

    onRestartGameButtonClick() {
        console.log('Restart Game');
        this.resetGame();
        director.loadScene('02-GameScene');
        this.onResumeButtonClick();
    }

    onQuitGameButtonClick() {
        console.log('Quit Game');
        this.resetGame();
        // director.loadScene('01-Start');
    }

    // 重置游戏数据
    resetGame() {
        this.bombNumber = GAME_CONFIG.INITIAL_BOMB;
        this.lifeNumber = GAME_CONFIG.INITIAL_LIFE;
        this.score = GAME_CONFIG.INITIAL_SCORE;

        this.node.emit('updateBombUI',this.bombNumber);
        this.node.emit('updateLifeCountUI', this.lifeNumber);
        this.node.emit('updateScoreUI', this.score);
    }
}

