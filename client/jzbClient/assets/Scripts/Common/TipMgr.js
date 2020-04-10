const TipMgr = cc.Class({
    statics: {
        getInstance() {
            if (!this.tipMgr) {
                this.tipMgr = new TipMgr();
            }
            return this.tipMgr;
        },
    },
    _curPNode: null,
    _popZIndex: null,
    ctor() {
        this._popZIndex = 10000;
    },
    /**
     *  初始化
     */
    init(node) {
        this._curPNode = node;
    },
    /**
     *  显示
     */
    show(str, time) {
        if (!this._curPNode) {
            this._curPNode = cc.find("Canvas");
        }
        if (this._curPNode.getChildByName("CommonTip")) {
            this._curPNode.getChildByName("CommonTip").destroy();
        }
        try {
            const pop = cc.instantiate(cc.resLoad.dirResList["Common"]["COMMONTIP"]);
            pop.time = time;
            pop.getComponent("CommonTip").setNote(str);
            this._curPNode.addChild(pop,this._popZIndex);
        } catch (err) {
            cc.error(err);
        }
    },
    /**
     *  隐藏
     */
    hide() {
        if (this._curPNode.getChildByName("CommonTip")) {
            this._curPNode.getChildByName("CommonTip").destroy();
        }
    },
});
cc.comTip = TipMgr.getInstance();