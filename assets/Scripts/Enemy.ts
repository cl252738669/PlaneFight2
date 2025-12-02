import { _decorator, Animation, Collider2D, Component, Contact2DType, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {

    @property
    speed: number = 200;

    @property(Animation)
    ani:Animation = null;

    @property(String)
    animationHit: string = '';
    @property(String)
    animationDown: string = '';

    @property
    hp: number = 1;

    collider: Collider2D = null;

    start() {
         this.collider = this.getComponent(Collider2D);
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
           
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: any) {
        console.log('Enemy onBeginContact with ' + otherCollider.node.name);
        this.hp -= 1;

        if (otherCollider.node.name.startsWith('Bullet')) {
            this.scheduleOnce(() => {
                if (otherCollider.node && otherCollider.node.isValid) {
                    otherCollider.node.destroy();
                }
            }, 0);
        }

        if (this.hp > 0) {
            this.ani.play(this.animationHit);
        } else {
            this.ani.play(this.animationDown);
            if (this.collider) {
                this.collider.enabled = false;
            }
            
            this.ani.once(Animation.EventType.FINISHED, () => {
                if (this.node && this.node.isValid) {
                    this.node.destroy();
                }
            }, this);
        }
        

    }

    update(deltaTime: number) {
        if (this.hp > 0) {
            const pos = this.node.position;
            this.node.setPosition(pos.x, pos.y - this.speed * deltaTime);

            if (this.node.position.y < -560) {
                this.node.destroy();
            }
        }  
        
    }

    protected onDestroy(): void {
        if (this.collider) {
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }
}

