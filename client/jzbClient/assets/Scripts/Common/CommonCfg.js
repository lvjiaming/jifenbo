const CommonCfg = {
    HALL_HOST:
        "ws://192.168.0.11:20000/server",
    // "ws://59.110.221.90:20000/server",
    GAME_ID: {
        GAME_JUNQI: 1,
        GAME2: 2,
        GAME3: 3,
    },
    MSG_CODE: {
        ERR: 1, // 错误消息
        SUC: 2, // 成功消息
    },
    ROOM_STATE: {
        WAIT: 1,  // 等待状态
        GAME: 2,  // 游戏状态
        END: 3,  // 游戏结束状态
    },
    USER_STATE: {
        NONE: 0, // 无状态
        READY: 1, // 准备状态
        NO_READY: 2, // 未准备的状态
        OFF_LINE: 3, // 离线状态
    },
};
cc.commonCfg = CommonCfg;