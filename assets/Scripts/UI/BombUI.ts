import { _decorator, Component, Game, game, Label, Node } from 'cc';
import { GameManager } from '../GameManager';
const { ccclass, property } = _decorator;

@ccclass('BombUI')
export class BombUI extends Component {

    @property(Label)
    bombLabel: Label = null;

    start() {

        this.bombLabel.string = `${GameManager.instance.bombCount()}`;

        GameManager.instance.node.on('updateBombUI', (bombCount: number) => {
            console.log('updateBombUI received in BombUI', bombCount);
            this.bombLabel.string = `${bombCount}`;
        });

    }

    update(deltaTime: number) {
        
    }
}

