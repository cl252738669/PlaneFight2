import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bg')
export class Bg extends Component {

    @property(Node)
    bg01: Node = null;

    @property(Node)
    bg02: Node = null;

    @property
    speed: number = 100;
    start() {

    }

    update(deltaTime: number) {
        this.bg01.setPosition(this.bg01.position.x, this.bg01.position.y - this.speed * deltaTime);
        this.bg02.setPosition(this.bg02.position.x, this.bg02.position.y - this.speed * deltaTime);


        const p1 = this.bg01.position;
        const p2 = this.bg02.position;

        if (this.bg01.position.y <= -852) {
            this.bg01.setPosition(p1.x, p2.y + 852);
        }
        if (this.bg02.position.y <= -852) {
            this.bg02.setPosition(p2.x, p1.y + 852);
        }
        
    }
}

