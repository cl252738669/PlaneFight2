import { _decorator, Animation, CCString, Collider2D, Component, Contact2DType, EventTouch, Input, input, instantiate, Node, Prefab, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

enum ShootType {
    NONE,
    BULLET1,
    BULLET2,
}

@ccclass('Player')
export class Player extends Component {

    @property(Prefab)
    bullet1Prefab: Prefab = null;
    @property(Node)
    bulletParent: Node = null;
    @property(Node)
    bullet1Pos: Node = null;

    @property(Prefab)
    bullet2Prefab: Prefab = null;
    @property(Node)
    bullet2PosLeft: Node = null;
    @property(Node)
    bullet2PosRight: Node = null;

    shootRate: number = 0.3;
    shootTimer: number = 0;
    collider: Collider2D = null;

    shootType: ShootType = ShootType.BULLET1;

    @property(Animation)
    ani:Animation = null;

    @property(CCString)
    animationHit: string = '';
    @property(CCString)
    animationDown: string = '';

    @property
    liftCount: number = 3;

    isHit: boolean = false;

    protected onLoad(): void {
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.collider = this.getComponent(Collider2D);
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            
        }
    }

    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        if (this.collider) {
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onTouchMove(event: EventTouch) {

        if (this.liftCount <= 0) { return; }
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

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: any) { 
        console.log('Player onBeginContact with ' + otherCollider.node.name);

        if (otherCollider.node.name.startsWith('Enemy')) {
            if (this.isHit) {
                return;
            }

            this.liftCount -= 1;
            if (this.liftCount > 0) {
                this.ani.play(this.animationHit);
                this.isHit = true;

                if (this.collider) {
                    this.collider.enabled = false;
                }

                this.ani.once(Animation.EventType.FINISHED, () => {
                     this.isHit = false;

                    if (this.collider) {
                        this.collider.enabled = true;
                    }
                }, this);
  
            } else {
                this.ani.play(this.animationDown);

                this.shootType = ShootType.NONE;
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
    }

    protected update(dt: number): void {

        switch (this.shootType) {
            case ShootType.BULLET1:
                this.shootBullet1(dt);
                break;
            case ShootType.BULLET2:
                this.shootBullet2(dt);
                break;
        }
        
    }

    shootBullet1(dt: number) {
        this.shootTimer += dt;
        if (this.shootTimer >= this.shootRate) {
            this.shootTimer = 0;
            const bullet1 = instantiate(this.bullet1Prefab);
            this.bulletParent.addChild(bullet1);
            bullet1.setWorldPosition(this.bullet1Pos.worldPosition);
        }
    }

    shootBullet2(dt: number) {
        this.shootTimer += dt;
        if (this.shootTimer >= this.shootRate) {
            this.shootTimer = 0;
            const bullet2Left = instantiate(this.bullet2Prefab);
            this.bulletParent.addChild(bullet2Left);
            bullet2Left.setWorldPosition(this.bullet2PosLeft.worldPosition);

            const bullet2Right = instantiate(this.bullet2Prefab);
            this.bulletParent.addChild(bullet2Right);
            bullet2Right.setWorldPosition(this.bullet2PosRight.worldPosition);
        }
    }
}

