import {Utils} from "../../Common/Utils";
import {InfoManager, InfoBaseClass, INFO_STATE} from "../../UIManager/InfoManager";
import jzbPb = require("../../Proto/JiZhangBo/jiZhangBo_pb");
import msgPb = require("../../Proto/Common/msg_pb");
import {Net} from "../../Event/Net";
import {TipMgr} from "../../Common/TipMgr";
const {ccclass, property} = cc._decorator;

@ccclass
export default class InfoItem extends InfoBaseClass {

    @property({
        type: cc.Label,
        tooltip: "id",
    })
    idLab = null;

    @property({
        type: cc.Label,
        tooltip: "用途",
    })
    useTypeLab = null;

    @property({
        type: cc.Label,
        tooltip: "时间",
    })
    timeLab = null;

    @property({
        type: cc.Label,
        tooltip: "金额",
    })
    valLab = null;

    @property({
        type: cc.Node,
        tooltip: "编辑节点"
    })
    editNode = null;

    @property({
        type: cc.Node,
        tooltip: "信息的节点"
    })
    infoNode = null;

    @property({
        type: cc.Toggle,
        tooltip: "删除选择"
    })
    delToggle = null;

    @property({
        type: cc.EditBox,
        tooltip: "用途的编辑框",
    })
    useTypeEditBox = null;

    @property({
        type: cc.EditBox,
        tooltip: "金额的编辑框",
    })
    valEditBox = null;

    private _index: number = 0;

    private _touchTime: number = 1; // 长按的时间
    onLoad () {
        this._data = (<any>this.node).data || {};
        this._index = (<any>this.node).infoIndex;
        this._initInfo();
        this.node.on("touchstart", this._touchStart, this, false);
        this.node.on("touchend", this._touchEnd, this, false);
        this.node.on("touchcancel", this._touchCancel, this, false);
        this.node.on("touchmove", this._touchMove, this, false);

        if (InfoManager.getInstance().getInfoState() == INFO_STATE.DEL) {
            this.showDelUI();
        }
        InfoManager.getInstance().addShowInfo(this);
    }

    start () {

    }

    onDestroy() {
        // InfoManager.getInstance().removeShowInfo(this);
        this.node.off("touchstart", this._touchStart, this, false);
        this.node.off("touchend", this._touchEnd, this, false);
        this.node.off("touchcancel", this._touchCancel, this, false);
        this.node.off("touchmove", this._touchMove, this, false);
    }

    /**
     *  触摸开始
     * @private
     */
    private _touchStart(event: any): void {
        this.scheduleOnce(() => {
            // cc.log("显示吧", );
            InfoManager.getInstance().showTip(this, (qpNode: any) => {
                if (qpNode) {
                    const curTouch = event.currentTouch._point;
                    const nodePos = qpNode.parent.convertToNodeSpaceAR(curTouch);
                    qpNode.position = nodePos;
                }
            });
        }, this._touchTime);
    }

    /**
     *  触摸结束
     * @private
     */
    private _touchEnd(): void {
        cc.director.getScheduler().unscheduleAllForTarget(this);
    }

    /**
     *  触摸取消
     * @private
     */
    private _touchCancel(): void {
        cc.director.getScheduler().unscheduleAllForTarget(this);
    }

    /**
     *  触摸移动
     * @private
     */
    private _touchMove(): void {

    }

    /**
     *  显示删除ui
     */
    public showDelUI(): void {
        if (this.editNode) {
            this.editNode.active = true;
            const selectNode = this.editNode.getChildByName("Select");
            if (selectNode) {
                selectNode.active = true;
            }
            if (InfoManager.getInstance().checkIsInDelList(this._data.getId())) {
                this.selectDel();
            }
        }
    }

    /**
     *  显示修改的界面
     */
    public showChangeUI(): void {
        if (this.editNode) {
            this.editNode.active = true;
            const changeNode = this.editNode.getChildByName("ChangeInfo");
            if (changeNode) {
                changeNode.active = true;
                if (this.infoNode) {
                    this.infoNode.active = false;
                }
                if (this.useTypeEditBox) {
                    this.useTypeEditBox.string = this._data.getUsetype();
                }
                if (this.valEditBox) {
                    this.valEditBox.string = Utils.changeVal(this._data.getVal());
                }
            }
        }
    }

    /**
     *  隐藏修改的界面
     */
    public hideChangeUI(): void {
        if (this.editNode) {
            this.editNode.active = false;
            const changeNode = this.editNode.getChildByName("ChangeInfo");
            if (changeNode) {
                changeNode.active = false;
                if (this.infoNode) {
                    this.infoNode.active = true;
                }
            }
        }
    }

    /**
     *  取消的事件
     */
    public onCancelClick(): void {
        InfoManager.getInstance().endChange();
    }

    /**
     *  确认的事件
     */
    public onFixChangeClick(): void {
        if (this.useTypeEditBox && this.valEditBox) {
            if (!this.useTypeEditBox.string && !this.valEditBox.string) {
                cc.log("不做改变");
                InfoManager.getInstance().endChange();
                return;
            }
            if (this.useTypeEditBox.string == this._data.getUsetype() &&
                Utils.changeVal(parseFloat(this.valEditBox.string)) == Utils.changeVal(this._data.getVal())) {
                cc.log("信息未改变");
            } else {
                const changeReq = new jzbPb.ChangeInfoReq();
                if (this.useTypeEditBox.string) {
                    cc.log("用途变化");
                    changeReq.setChangeusetype(this.useTypeEditBox.string);
                }
                if (this.valEditBox.string) {
                    cc.log("金额变化");
                    changeReq.setChangeval(Utils.changeVal(parseFloat(this.valEditBox.string)));
                }
                changeReq.setInfoid(this._data.getId());
                Net.getInstance().send(msgPb.Event.EVENT_CHANGE_INFO_REQ, changeReq);
            }
            InfoManager.getInstance().endChange();
        } else {
            InfoManager.getInstance().endChange();
        }
    }

    /**
     *  选择删除
     */
    public selectDel(): void {
        if (this.delToggle) {
            this.delToggle.isChecked = true;
            this.infoSelectState(true);
        }
    }

    /**
     *  取消选择
     */
    public unSelectDel(): void {
        if (this.delToggle) {
            this.delToggle.isChecked = false;
            this.infoSelectState(false);
        }
    }

    /**
     *  隐藏删除ui
     */
    public hideDelUI(): void {
        if (this.editNode) {
            this.editNode.active = false;
            const selectNode = this.editNode.getChildByName("Select");
            if (selectNode) {
                selectNode.active = false;
            }
        }
    }

    /**
     *  重新设置信息
     */
    public reSetInfo(data: any): void {
        this._data = data;
        this._initInfo();
    }

    /**
     *  获取信息
     * @returns {any}
     */
    public getInfo(): any {
        return this._data;
    }

    /**
     * 初始化信息
     * @private
     */
    private _initInfo(): void {
        if (this._data) {
            if (this.idLab) {
                this.idLab.string = this._index || "0";
            }
            if (this.useTypeLab) {
                this.useTypeLab.string = this._data.getUsetype() || "";
            }
            if (this.timeLab) {
                const str = Utils.getTime(this._data.getTime());
                this.timeLab.string = str || "";
            }
            if (this.valLab) {
                this.valLab.string = `${Utils.changeVal(this._data.getVal())}元`;
            }
        }
    }

    /**
     *  删除选择触发函数
     */
    public onDelToggleClick(event): void {
        this.infoSelectState(event.isChecked);
    }

    /**
     *  信息被选择的
     */
    public infoSelectState(state: boolean): void {
        if (state) {
            InfoManager.getInstance().addDelInfo(this._data.getId());
        } else {
            InfoManager.getInstance().removeDelInfo(this._data.getId());
        }
    }

    // update (dt) {}
}
