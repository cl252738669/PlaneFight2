import { _decorator, Component, Label, Node } from 'cc';
import { GameManager } from '../GameManager';
const { ccclass, property } = _decorator;

@ccclass('ScoreUI')
export class ScoreUI extends Component {
    
    @property(Label)
    scoreCountLabel: Label = null;

    start() {

        this.scoreCountLabel.string = `${GameManager.instance.scoreCount()}`;
        GameManager.instance.node.on('updateScoreUI', (score: number) => {
            console.log('updateScoreUI received in ScoreUI', score);
            this.scoreCountLabel.string = `${score}`;
        });
        
    }
}

