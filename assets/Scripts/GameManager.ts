import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    private static _instance: GameManager = null;

    public static get instance(): GameManager {
        return this._instance;
    }

    @property
    private bombNumber: number = 0;

    onLoad() {
        if (GameManager._instance == null) {
            GameManager._instance = this;
        } else {
            this.destroy();
        }
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    onAddbomb() {
        this.bombNumber += 1;
        this.node.emit('updateBombUI',1111);
    }

    onUsebomb() {
        if (this.bombNumber > 0) {
            this.bombNumber -= 1;
            this.node.emit('updateBombUI',0);
        } 
    }

    bombCount(): number {
        return this.bombNumber;
    }
}

