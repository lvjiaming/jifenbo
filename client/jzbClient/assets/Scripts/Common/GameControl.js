const GameControl = cc.Class({
    statics: {
        getInstance() {
            if (!this.gameControl) {
                this.gameControl = new GameControl();
            }
            return this.gameControl;
        },
    },
    _game: null,
    ctor(target) {
        this._game = target;
    },
    /**
     *  生成地图
     */
    createMap() {

    },
});
cc.gameControl = GameControl;