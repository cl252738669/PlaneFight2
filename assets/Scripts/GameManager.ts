import { _decorator, Component, director, Node, find, input, Input, AudioClip } from 'cc';
import { Player } from './Player';
import { Enemy } from './Enemy';
import { AudioMgr } from './AudioMgr';
const { ccclass, property } = _decorator;

// 游戏配置常量
const GAME_CONFIG = {
    INITIAL_BOMB: 2,
    INITIAL_LIFE: 5,
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

    @property(Node)
    public enemyManager: Node = null;
    @property(Node)
    public bulletParent: Node = null;
    @property(Node)
    playerNode: Node = null;

    @property(AudioClip)
    gameMusic:AudioClip = null;

    doubleClickInterval: number = 0.5;
    lastClickTime: number = 0;

    onLoad() {
        if (GameManager._instance == null) {
            GameManager._instance = this;
        } else {
            this.destroy();
        }

        this.pauseButton.active = true;
        this.resumeButton.active = false;

        this.lastClickTime = 0;
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    protected start(): void {
        AudioMgr.inst.play(this.gameMusic,true,0.3)
    }

    onTouchEnd(event: any) {
        // 双击检测逻辑
        const currentTime = Date.now() / 1000;
        const timeDiff = currentTime - this.lastClickTime;
        
        if (timeDiff < this.doubleClickInterval) {
            console.log('Double click detected');

            if (this.bombNumber >= 1) {
               
               if (this.enemyManager) {
                     // 使用炸弹
                    this.onBombChange(-1);
                    const nodes = this.enemyManager.children;

                    for (let i = nodes.length - 1; i >= 0; i--) {
                       const node = nodes[i];
                       const enemy = node.getComponent(Enemy);
                       if (enemy) {
                          enemy.enemyExploe();
                       }
                    }
                }

            }
            // 双击逻辑
        }
        
        this.lastClickTime = currentTime;
    }

     public static get instance(): GameManager {

        return this._instance;
    }

    protected onDestroy(): void {
        
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        
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
    }

    onRestartGameButtonClick() {
        console.log('Restart Game');
        this.onResumeButtonClick();

        // 重新加载当前场景
        // GameManager._instance = null;
        // director.loadScene(director.getScene().name);

        //手动重新置游戏数据
        // 1. 重置游戏数据
        this.resetGameData();
        // 2. 清理场景中的动态对象
        this.cleanupScene();
        // 3. 重置玩家状态
        this.resetPlayer();
        // 4. 重新开始游戏逻辑
        // this.startNewGame();
        // 5. 隐藏游戏结束UI
        this.hideGameOverUI();
       
    }

    onQuitGameButtonClick() {
        console.log('Quit Game');
        // director.loadScene('01-Start');
    }

    // 重置游戏数据
    resetGameData() {
        this.bombNumber = GAME_CONFIG.INITIAL_BOMB;
        this.lifeNumber = GAME_CONFIG.INITIAL_LIFE;
        this.score = GAME_CONFIG.INITIAL_SCORE;

        this.node.emit('updateBombUI',this.bombNumber);
        this.node.emit('updateLifeCountUI', this.lifeNumber);
        this.node.emit('updateScoreUI', this.score);
    }

    cleanupScene() {
        // 清理所有敌机(奖励也在里面)
        if (this.enemyManager) {
            const enemies = this.enemyManager.children;

            console.log('Cleaning up enemies, count:', enemies.length);
            for (let i = enemies.length - 1; i >= 0; i--) {
                enemies[i].destroy();
            }
        }
        
        // 清理所有子弹
        if (this.bulletParent) {
            const bullets = this.bulletParent.children;
            for (let i = bullets.length - 1; i >= 0; i--) {
                bullets[i].destroy();
            }
        }
        
    }

    // 重置玩家状态
    resetPlayer() {
        this.playerNode.active = true;
        const player = this.playerNode.getComponent(Player);
        if (player) {
            player.resetPlayer();
        }
    }

    hideGameOverUI() {
       this.node.emit('hideGameOverUI');
    }
}

