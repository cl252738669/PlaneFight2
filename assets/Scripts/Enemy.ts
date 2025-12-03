import { _decorator, Animation, CCString, Collider2D, Component, Contact2DType, Node, Sprite } from 'cc';
import { Bullet } from './Bullet';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {

    @property
    speed: number = 200;

    @property(Animation)
    ani:Animation = null;

    @property(CCString)
    animationHit: string = '';
    @property(CCString)
    animationDown: string = '';

    @property
    hp: number = 1;

    collider: Collider2D = null;

    isHit: boolean = false;

    start() {
         this.collider = this.getComponent(Collider2D);
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
           
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: any) {
        const bullet = otherCollider.node.getComponent(Bullet);
        if (bullet && this.hp > 0 && !this.isHit) {
            this.onContactWithBullet(bullet);
        } 
    }

    onContactWithBullet(bullet: Bullet) {
        console.log('Enemy hit by Bullet');
        this.isHit = true;
        this.hp -= 1;

        bullet.getComponent(Collider2D).enabled = false;
        bullet.getComponent(Sprite).enabled = false;
        this.scheduleOnce(() => {
            if (bullet.node && bullet.node.isValid) {
                bullet.node.destroy();
            }
        }, 0);

        if (this.hp > 0) {
            this.ani.play(this.animationHit);
            this.ani.once(Animation.EventType.FINISHED, () => {
                this.isHit = false;
            }, this);   
        } else {
            this.ani.play(this.animationDown);
            if (this.collider) {
                this.collider.enabled = false;
            }
            
            this.ani.once(Animation.EventType.FINISHED, () => {
                this.isHit = false;
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

