const Room = cc.Class({
    // statics: {
    //     gameid: null,
    // },
    _userList: null,
    _roomCfg: null,
    ctor(data) {
        this.setUserList(data.userlist);
        this.setRoomCfg(data.roomCfg);
    },
    /**
     *  设置房间玩家列表
     * @param data
     */
    setUserList(data) {
        this._userList = data;
    },
    /**
     *  添加玩家
     * @param user
     */
    addUser(user) {
        this._userList.push(user);
    },
    /**
     *  移除玩家
     * @param id
     */
    removeUser(id) {
        this._userList.forEach((item, index) => {
            if (item.id == id) {
                this._userList.splice(index, 1);
            }
        });
    },
    /**
     *  获取房间玩家列表
     * @returns {null}
     */
    getUserList() {
        return this._userList;
    },
    /**
     *  设置房间的配置
     * @param cfg
     */
    setRoomCfg(cfg) {
        this._roomCfg = cfg;
    },
    /**
     *  获取房间的配置
     * @returns {null}
     */
    getRoomCfg() {
        return this._roomCfg;
    },
});
cc.room = Room;