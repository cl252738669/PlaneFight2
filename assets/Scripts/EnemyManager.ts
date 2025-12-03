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
        const enemy = instantiate(this.enemy0Prefab);
        this.node.addChild(enemy);
        const x = math.randomRangeInt(-205, 205);
        enemy.setPosition(x, 450);
    }

    enemy1Spawn() {
        const enemy = instantiate(this.enemy1Prefab);
        this.node.addChild(enemy);
        const x = math.randomRangeInt(-200, 200);
        enemy.setPosition(x, 480);
    }

    enemy2Spawn() {
        const enemy = instantiate(this.enemy2Prefab);
        this.node.addChild(enemy);
        const x = math.randomRangeInt(-150, 150);
        enemy.setPosition(x, 555);
    }

    rewardSpawn() {
        const rewardType = math.randomRangeInt(0, 2);
        let reward: Node = null;
        if (rewardType === 0) {
            reward = instantiate(this.reward1Prefab);
        } else {
            reward = instantiate(this.reward2Prefab);
        }
        this.node.addChild(reward);
        const x = math.randomRangeInt(-200, 200);
        reward.setPosition(x, 490);
    }
}

