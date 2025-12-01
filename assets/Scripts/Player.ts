import { _decorator, Component, EventMouse, EventTouch, Input, input, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {

    protected onLoad(): void {
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    onTouchMove(event: EventTouch) {
        let delta = event.getDelta();

        let targetPos = new Vec3();

        if (this.node.position.x + delta.x < -230) {
            targetPos.x = -230;
        } else if (this.node.position.x + delta.x > 230) {
            targetPos.x = 230;
        } else {
            targetPos.x = this.node.position.x + delta.x;
        }

        if (this.node.position.y + delta.y < -370) {
            targetPos.y = -370;
        } else if (this.node.position.y + delta.y > 370) {
            targetPos.y = 370;
        } else {
            targetPos.y = this.node.position.y + delta.y;
        }   

        this.node.setPosition(targetPos);

    }
}

