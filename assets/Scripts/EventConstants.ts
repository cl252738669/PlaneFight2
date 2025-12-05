/**
 * 事件常量定义
 * 所有 emit 和 on 的事件名称都在这里定义
 */

export const EVENT_NAMES = {
    // UI 事件
    UPDATE_LIFE_COUNT_UI: 'updateLifeCountUI',
    UPDATE_BOMB_UI: 'updateBombUI',
    UPDATE_SCORE_UI: 'updateScoreUI',
    
    // 游戏状态事件
    GAME_PAUSED: 'gamePaused',
    GAME_RESUMED: 'gameResumed',
    GAME_OVER_EVENT: 'gameOverEvent',
    HIDE_GAME_OVER_UI: 'hideGameOverUI',
};
