import { _decorator, Animation, animation, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {

    @property
    speed: number = 200;

    @property(Animation)
    ani:Animation = null;

    start() {

    }

    update(deltaTime: number) {
        const pos = this.node.position;
        this.node.setPosition(pos.x, pos.y - this.speed * deltaTime);

        if (this.node.position.y < -480) {
            this.node.destroy();
        }
        
    }
}

