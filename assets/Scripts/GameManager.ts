import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    private static _instance: GameManager = null;

    public static get instance(): GameManager {
        return this._instance;
    }

    @property
    private bombNumber: number = 1;

    @property
    private lifeNumber: number = 3;

    onLoad() {
        if (GameManager._instance == null) {
            GameManager._instance = this;
        } else {
            this.destroy();
        }
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

    onbombChange(count: number) {
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
}

