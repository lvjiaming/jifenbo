

import {BaseUI} from "../../UIManager/UIManager";
import {User} from "../../Common/User";
import {Net} from "../../Event/Net";

import jzbPb = require("../../Proto/JiZhangBo/jiZhangBo_pb");
import msgPb = require("../../Proto/Common/msg_pb");
import {Utils} from "../../Common/Utils";
const {ccclass, property} = cc._decorator;

@ccclass
export default class MeUi extends BaseUI {

    @property({
        type: cc.Label,
        tooltip: "用户名",
    })
    userName = null;

    @property({
        type: cc.Node,
        tooltip: "统计信息节点",
    })
    statisyicalNode = null;

    onLoad () {
        Net.getInstance().addObserver(this);
        this._setName();
        this.updateStatisyicalInfo();
    }

    start () {

    }

    onDestroy() {
        Net.getInstance().removeObserver(this);
    }

    /**
     *  设置用户名
     * @private
     */
    private _setName(): void {
        if (this.userName) {
            this.userName.string = User.getInstance().name;
        }
    }

    public static getPath(): string {
        return "ui/MeUI"
    }

    /**
     * 更新统计信息
     */
    public updateStatisyicalInfo(): void {
        if (this.statisyicalNode) {
            const weekInfo = this.statisyicalNode.getChildByName("WeekInfo");
            const monInfo = this.statisyicalNode.getChildByName("MonInfo");
            const yearInfo = this.statisyicalNode.getChildByName("YearInfo");
            if (weekInfo) {
                weekInfo.getComponent(cc.Label).string = Utils.changeVal(User.getInstance().weekInfo);
            }
            if (monInfo) {
                monInfo.getComponent(cc.Label).string = Utils.changeVal(User.getInstance().monInfo);
            }
            if (yearInfo) {
                yearInfo.getComponent(cc.Label).string = Utils.changeVal(User.getInstance().yearInfo);
            }
        }
    }

    public onEventMessage(event, data): void {
        switch (event) {
            case msgPb.Event.EVENT_STATISYICAL_INFO_CHANGE: { // 更新信息
                User.getInstance().updateStatisyicalInfo(data);
                this.updateStatisyicalInfo();
                break;
            }
        }
    }

    // update (dt) {}
}
