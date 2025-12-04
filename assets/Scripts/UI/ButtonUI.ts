import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ButtonUI')
export class ButtonUI extends Component {

    onStartButtonClick() {
        director.loadScene('02-GameScene');
    }
}

