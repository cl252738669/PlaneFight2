import { _decorator, Component, Label, Node, find } from 'cc';
import { GameManager } from '../GameManager';
const { ccclass, property } = _decorator;

@ccclass('LifeCountUI')
export class LifeCountUI extends Component {

    @property(Label)
    lifeCountLabel: Label = null;

    start() {

        this.lifeCountLabel.string = `${GameManager.instance.lifeCount()}`;

        GameManager.instance.node.on('updateLifeCountUI', (lifeCount: number) => {
            console.log('updateLifeCountUI received in LifeCountUI', lifeCount);
            this.lifeCountLabel.string = `${lifeCount}`;
        });
      
    }

    update(deltaTime: number) {
        
    }
}

