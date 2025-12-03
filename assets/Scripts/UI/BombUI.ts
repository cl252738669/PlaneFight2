import { _decorator, Component, Game, game, Label, Node } from 'cc';
import { GameManager } from '../GameManager';
const { ccclass, property } = _decorator;

@ccclass('BombUI')
export class BombUI extends Component {

    @property(Label)
    bombLabel: Label = null;

    start() {

        GameManager.instance.node.on('updateBombUI', (num: any) => {

            console.log('updateBombUI received in BombUI', num);
            const bombNumber = GameManager.instance.bombCount();

            this.bombLabel.string = `${bombNumber}`;
        });

    }

    update(deltaTime: number) {
        
    }
}

