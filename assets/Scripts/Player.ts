import { _decorator, Component, EventTouch, Input, input, instantiate, Node, Prefab, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

enum ShootType {
    BULLET1 = 0,
    BULLET2 = 1,
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

    @property
    shootRate: number = 0.2;
    shootTimer: number = 0;

    @property
    shootType: ShootType = ShootType.BULLET1;

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

