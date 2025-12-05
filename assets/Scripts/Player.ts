import { _decorator, Animation, AudioClip, CCString, Collider2D, Component, Contact2DType, EventTouch, Input, input, instantiate, Node, Prefab, Sprite, Vec3 } from 'cc';
import { Reward, RewardType } from './Reward';
import { Enemy } from './Enemy';
import { GameManager } from './GameManager';
import { AudioMgr } from './AudioMgr';
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

    shootTypeChangeDuration: number = 5;
    shootTypeChangeTimer: number = 0;
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

    @property(AudioClip)
    bulletAudio: AudioClip = null;
    @property(AudioClip)
    getBombAudio: AudioClip = null;
    @property(AudioClip)
    getTwoShootAudio: AudioClip = null;
    @property(AudioClip)
    hurtAudio: AudioClip = null;

    isHit: boolean = false;
    isGetReward: boolean = false;

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

        if (GameManager.instance.getIsGamePaused()) { return; }
        if (GameManager.instance.lifeCount() <= 0) { return; }
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
        const enemy = otherCollider.node.getComponent(Enemy);

        if (enemy && !this.isHit) {
            this.onContactWithEnemy();
        } else {
            const reward = otherCollider.node.getComponent(Reward);
            if (reward && !this.isGetReward) {
                this.onContactWithReward(reward);
            }
        }
    }

    onContactWithEnemy() {

        console.log('Player Hit!');
        //避免重复触发
        this.isHit = true;
        this.onLifeCountChange(-1);
        if (GameManager.instance.lifeCount() > 0) {

            // 播放受伤动画
            this.ani.play(this.animationHit);
            AudioMgr.inst.playOneShot(this.hurtAudio);
            this.ani.once(Animation.EventType.FINISHED, () => {
                this.isHit = false;
                     // 立即切换到循环播放 Player_Idle
                this.scheduleOnce(() => {
                    this.ani.play('Player_Idle');
                    const idleState = this.ani.getState('Player_Idle');
                    if (idleState) {
                        idleState.repeatCount = Infinity;  // Player_Idle 无限循环
                    }
                }, 0);

            }, this);

        } else {
            // 播放死亡动画
            this.ani.play(this.animationDown);
            //停止攻击
            this.shootType = ShootType.NONE;
            if (this.collider) {
                this.collider.enabled = false;
            }
            
            this.ani.once(Animation.EventType.FINISHED, () => {
                this.isHit = false;
                this.node.active = false; // 暂时隐藏玩家

                //游戏结束
                this.scheduleOnce(() => {
                    GameManager.instance.gameOver();
                }, 0.5);

            }, this);

            
        }
    }

    onLifeCountChange(newCount: number) {
        GameManager.instance.onLifeCountChange(newCount);
    }

    onContactWithReward(reward: Reward) {
        console.log('Get Reward!');
        this.isGetReward = true;
        switch (reward.rewardType) {
            case RewardType.TwoShoot:
                AudioMgr.inst.playOneShot(this.getTwoShootAudio);
                this.changeShootType(ShootType.BULLET2);
                break;
            case RewardType.Bomb:
                AudioMgr.inst.playOneShot(this.getBombAudio);
                GameManager.instance.onBombChange(1);
                break;
        }

        reward.getComponent(Collider2D).enabled = false;
        reward.getComponent(Sprite).enabled = false;
        reward.scheduleOnce(() => {
            if (reward.node && reward.node.isValid) {
                reward.node.destroy();
                this.isGetReward = false;
            }
        }, 0);
    }

    changeShootType(type: ShootType) {
        this.shootType = type;
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
            AudioMgr.inst.playOneShot(this.bulletAudio,0.1);
            this.shootTimer = 0;
            const bullet1 = instantiate(this.bullet1Prefab);
            this.bulletParent.addChild(bullet1);
            bullet1.setWorldPosition(this.bullet1Pos.worldPosition);
        }
    }

    shootBullet2(dt: number) {
        this.shootTypeChangeTimer += dt;
        if (this.shootTypeChangeTimer >= this.shootTypeChangeDuration) {
            this.changeShootType(ShootType.BULLET1);
            this.shootTypeChangeTimer = 0;
        }

        this.shootTimer += dt;
        if (this.shootTimer >= this.shootRate) {
            AudioMgr.inst.playOneShot(this.bulletAudio,0.1);
            this.shootTimer = 0;
            const bullet2Left = instantiate(this.bullet2Prefab);
            this.bulletParent.addChild(bullet2Left);
            bullet2Left.setWorldPosition(this.bullet2PosLeft.worldPosition);

            const bullet2Right = instantiate(this.bullet2Prefab);
            this.bulletParent.addChild(bullet2Right);
            bullet2Right.setWorldPosition(this.bullet2PosRight.worldPosition);
        }
    }

    resetPlayer() {
        console.log("重置玩家状态");
        // 重置射击类型
        this.shootType = ShootType.BULLET1;
        
        // 重新启用碰撞体
        if (this.collider) {
            this.collider.enabled = true;
        }
        
        // 重置位置到初始位置
        this.node.setPosition(0, -370, 0);
        
        // 停止当前动画，并设置 animationDown 动画停在第一帧
        this.ani.stop();
        // 播放 animationDown 但立即停止在第一帧
        this.ani.play(this.animationDown);
        const downState = this.ani.getState(this.animationDown);
        if (downState) {
            downState.repeatCount = 0;  // 不重复，停在第一帧
            downState.speed = 0;  // 速度为 0，不继续播放
        }
        
        // 立即切换到循环播放 Player_Idle
        this.scheduleOnce(() => {
            this.ani.play('Player_Idle');
            const idleState = this.ani.getState('Player_Idle');
            if (idleState) {
                idleState.repeatCount = Infinity;  // Player_Idle 无限循环
            }
        }, 0);
        
        // 重置其他状态
        this.isHit = false;
        this.isGetReward = false;
        
        console.log("玩家重置完成");
    }
}

