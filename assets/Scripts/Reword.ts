import { _decorator, Collider2D, Component, Contact2DType, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Reword')
export class Reword extends Component {

    @property
    speed: number = 70;

    collider: Collider2D = null;

    start() {

        this.collider = this.getComponent(Collider2D);
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            
        }

    }

    protected onDestroy(): void {
        if (this.collider) {
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: any) {
        console.log('Reword onBeginContact with ' + otherCollider.node.name);
        if (otherCollider.node.name === 'Player') { 
        

            console.log('Get Reword!');
            if (this.collider) {
                this.collider.enabled = false;
            }  

            this.scheduleOnce(() => {
                if (this.node && this.node.isValid) {
                    this.node.destroy();
                }
            }, 0);
        }
    }

    update(deltaTime: number) {

        const pos = this.node.position;
        this.node.setPosition(pos.x, pos.y - this.speed * deltaTime);

        if (this.node.position.y < -485) {
            this.node.destroy();
        }
    }
}

