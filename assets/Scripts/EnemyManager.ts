import { _decorator, Component, instantiate, math, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EnemyManager')
export class EnemyManager extends Component {

    @property
    enemy0SpawnTime: number = 1;
    @property(Prefab)
    enemy0Prefab: Prefab = null;

    @property
    enemy1SpawnTime: number = 2;
    @property(Prefab)
    enemy1Prefab: Prefab = null;

    @property
    enemy2SpawnTime: number = 7;
    @property(Prefab)
    enemy2Prefab: Prefab = null;

    @property
    rewardSpawnTime: number = 10;
    @property(Prefab)
    reward1Prefab: Prefab = null;
    @property(Prefab)
    reward2Prefab: Prefab = null;

    start() {
        // this.schedule(() => {
        //     this.enemy0Spawn();
        // }, this.enemy0SpawnTime);

        this.schedule(this.enemy0Spawn, this.enemy0SpawnTime);
        this.schedule(this.enemy1Spawn, this.enemy1SpawnTime);
        this.schedule(this.enemy2Spawn, this.enemy2SpawnTime);
        this.schedule(this.rewardSpawn, this.rewardSpawnTime);

    }

    protected onDestroy(): void {
        this.unschedule(this.enemy0Spawn);
        this.unschedule(this.enemy1Spawn);
        this.unschedule(this.enemy2Spawn);
        this.unschedule(this.rewardSpawn);
    }

    update(deltaTime: number) {
        
    }

    enemy0Spawn() {
        this.nodeSpawn(this.enemy0Prefab, 205, 450);
    }

    enemy1Spawn() {
        this.nodeSpawn(this.enemy1Prefab, 200, 480);
    }

    enemy2Spawn() {
        this.nodeSpawn(this.enemy2Prefab, 150, 555);
    }

    rewardSpawn() {
        const rewardType = math.randomRangeInt(0, 2);
        let reward: Prefab = null;
        if (rewardType === 0) {
            reward = this.reward1Prefab;
        } else {
            reward = this.reward2Prefab;
        }
        this.nodeSpawn(reward, 200, 490);
    }

    nodeSpawn(prefeb: Prefab, xRange: number, yPos: number ) {
        const node = instantiate(prefeb);
        this.node.addChild(node);
        const x = math.randomRangeInt(-xRange, xRange);
        node.setPosition(x, yPos);
    }
}

