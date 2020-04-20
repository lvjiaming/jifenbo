
import {User} from "../Common/User";
import {Net} from "../Event/Net";
import jzbPb = require('../Proto/JiZhangBo/jiZhangBo_pb')
import msgPb = require('../Proto/Common/msg_pb')
import {TipMgr} from "../Common/TipMgr";
import {Utils} from "../Common/Utils";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property({
        type: cc.Label,
        tooltip: "名字",
    })
    nameLab = null;

    onLoad () {
        TipMgr.getInstance().init(this.node);
        this._initName();
        Net.getInstance().addObserver(this);
    }

    start () {
        cc.log("时间：", Utils.getTime(1587375543));
    }

    onDestroy() {
        Net.getInstance().removeObserver(this);
    }

    /**
     *  初始化玩家名字
     * @private
     */
    private _initName(): void {
        if (this.nameLab) {
            this.nameLab.string = User.getInstance().name || "";
        }
    }

    public onEventMessage(event, data): void {
        switch (event) {
            case msgPb.Event.EVENT_MSG_INFO: {
                TipMgr.getInstance().show(data.getMsg(), 2);
                break;
            }
        }
    }

    // update (dt) {}
}
