import { _decorator, Collider2D, Component, Contact2DType, Node } from 'cc';
const { ccclass, property } = _decorator;

export enum RewardType {
    TwoShoot = 0,
    Bomb = 1
}


@ccclass('Reward')
export class Reward extends Component {

    @property
    speed: number = 70;

    @property
    rewardType: RewardType = RewardType.TwoShoot;

    start() {

    }

    protected onDestroy(): void {

    }

    update(deltaTime: number) {

        const pos = this.node.position;
        this.node.setPosition(pos.x, pos.y - this.speed * deltaTime);

        if (this.node.position.y < -485) {
            this.node.destroy();
        }
    }
}

