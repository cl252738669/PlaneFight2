import { _decorator, Animation, animation, Collider2D, Component, Contact2DType, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {

    @property
    speed: number = 200;

    @property(Animation)
    ani:Animation = null;

    @property
    hp: number = 1;

    start() {
         let collider = this.getComponent(Collider2D);
        if (collider) {
            console.log('Enemy collider found');
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
           
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: any) {
        this.hp -= 1;
        this.ani.play();
        console.log('Enemy onBeginContact with ' + otherCollider.node.name);
    }

    update(deltaTime: number) {
        if (this.hp > 0) {
            const pos = this.node.position;
            this.node.setPosition(pos.x, pos.y - this.speed * deltaTime);

            if (this.node.position.y < -480) {
                this.node.destroy();
            }
        }
        

        
        
    }
}

