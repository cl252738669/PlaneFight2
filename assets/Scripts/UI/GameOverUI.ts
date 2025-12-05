import { _decorator, Component, Label, Node } from 'cc';
import { GameManager } from '../GameManager';
import { EVENT_NAMES } from '../EventConstants';
const { ccclass, property } = _decorator;

@ccclass('GameOverUI')
export class GameOverUI extends Component {
    @property(Label)
    heighestScoreLabel: Label = null;
    @property(Label)
    finalScoreLabel: Label = null;

    @property(Node)
    bgNode: Node = null;

    start() {

        // console.log('GameOverUI start');
        GameManager.instance.node.on(EVENT_NAMES.GAME_OVER_EVENT, (heighestScore: number, finalScore: number) => {
            this.bgNode.active = true;
            console.log('gameOverEvent received in GameOverUI', heighestScore, finalScore);
            this.heighestScoreLabel.string = `${heighestScore}`;
            this.finalScoreLabel.string = `${finalScore}`;
        });

        GameManager.instance.node.on(EVENT_NAMES.HIDE_GAME_OVER_UI, () => {
            this.bgNode.active = false;
        });
    }
}

