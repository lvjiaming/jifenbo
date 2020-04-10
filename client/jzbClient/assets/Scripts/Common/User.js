const User = cc.Class({
    statics: {
        getInstance() {
            if (!this.user) {
                this.user = new User();
            }
            return this.user;
        },
    },
    _userId: null,
    _name: null,
    ctor() {
        this._userId = null;
        this._name = null;
    },
    /**
     *  初始化
     */
    init(data) {
        this.setUserId(data.id);
        this.setName(data.name);
    },
    /**
     *  设置userId
     * @param id
     */
    setUserId(id) {
        this._userId = id;
    },
    /**
     *  返回userId
     * @returns {Number}
     */
    getUserId() {
        return parseInt(this._userId);
    },
    /**
     * 设置名字
     * @param name
     */
    setName(name) {
        this._name = name;
    },
    /**
     *  得到名字
     * @returns {null}
     */
    getName() {
        return this._name;
    },
});
cc.user = User.getInstance();