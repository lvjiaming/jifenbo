
import {BaseUI} from "../../UIManager/UIManager";
import jzbPb = require("../../Proto/JiZhangBo/jiZhangBo_pb");
import msgPb = require("../../Proto/Common/msg_pb");
import {Utils} from "../../Common/Utils";
import {Net} from "../../Event/Net";
import {resLoad} from "../../Common/ResLoad";
import {InfoManager, INFO_STATE} from "../../UIManager/InfoManager";
import {TipMgr} from "../../Common/TipMgr";
const {ccclass, property} = cc._decorator;

const CFG = {
    ONE_YE_NUM: 6, // 一页的数量
    INFO_INTEM_SPACE_Y: -100,
};

@ccclass
export default class QueryUi extends BaseUI {

    @property({
        type: cc.EditBox,
        tooltip: "用途输入框"
    })
    useTypeEditBox = null;

    @property({
        type: cc.Node,
        tooltip: "内容节点",
    })
    noteNode = null;

    @property({
        type: cc.Label,
        tooltip: "页眉",
    })
    yeMeiLab = null;

    @property({
        type: cc.Node,
        tooltip: "总计",
    })
    zongJiNode = null;

    @property({
        type: cc.Node,
        tooltip: "删除操作节点",
    })
    delOptNode = null;

    private _hasSetStartTime: boolean = false;
    private _hasSetEndTiem: boolean = false;

    private _startTime: string = null;
    private _endTime: string = null;

    private _curYe: number = 0; // 当前第几页
    private _maxYe: number = 0; // 最大页
    private _data: Array<T> = null; //内容数组

    onLoad () {
        Net.getInstance().addObserver(this);
        InfoManager.getInstance().setDelOptNode(this.delOptNode);
        this._hasSetEndTiem = false;
        this._hasSetStartTime = false;
        this._updateYeMei();
        this._data = [];
        this._updateNote();
    }

    start () {

    }

    onDestroy() {
        Net.getInstance().removeObserver(this);
        InfoManager.getInstance().initInfoState();
    }

    public static getPath(): string {
        return "ui/QueryUI"
    }

    /**
     *  更新页眉
     * @private
     */
    private _updateYeMei(): void {
        if (this.yeMeiLab) {
            this.yeMeiLab.string = `${this._curYe}/${this._maxYe}`;
        }
    }

    /**
     *  更新内容
     * @private
     */
    private _updateNote(): void {
        this._updateYeMei();
        if (this.noteNode) {
            const tipLab = this.noteNode.getChildByName("TipLab");
            const noteNode = this.noteNode.getChildByName("Note");
            if (noteNode) {
                noteNode.children.forEach((item) => {
                    item.destroy();
                });
            }
            if (this._data.length > 0) {
                if (tipLab) {
                    tipLab.active = false;
                }
                if (noteNode) {
                    // const list = [];
                    for (let index = 0; index < CFG.ONE_YE_NUM; index++) {
                        const curData = this._data[index + (this._curYe - 1) * CFG.ONE_YE_NUM];
                        if (curData) {
                            const infoItem = cc.instantiate(resLoad.dirResList["dirRes"]["INFOITEM"]);
                            infoItem.data = curData;
                            infoItem.zIndex = CFG.ONE_YE_NUM - index;
                            infoItem.infoIndex = index + (this._curYe - 1) * CFG.ONE_YE_NUM + 1;
                            infoItem.y = index * CFG.INFO_INTEM_SPACE_Y - infoItem.height / 2;
                            noteNode.addChild(infoItem);
                            // list.push(infoItem.getComponent("InfoItem"))
                        } else {
                            break;
                        }
                    }
                }
                if (this.zongJiNode) {
                    this.zongJiNode.active = true;
                    this.zongJiNode.getComponent(cc.Label).string = `总计：${this._getAllVal()}元`;
                }
            } else {
                if (tipLab) {
                    tipLab.active = true;
                }
                if (this.zongJiNode) {
                    this.zongJiNode.active = false;
                }
            }
        }
    }

    /**
     *  获取总计金额
     * @private
     */
    private _getAllVal(): number {
        let num = 0;
        this._data.forEach((item) => {
            num += item.getVal();
        });
        return Utils.changeVal(num);
    }

    /**
     *  搜索按钮
     */
    public onQueryBtn(): void {
        if (InfoManager.getInstance().getInfoState() != INFO_STATE.NONE) {
            TipMgr.getInstance().show("正在编辑中", 1);
            return;
        }
        const queryReq = new jzbPb.QueryInfoReq();
        if (this.useTypeEditBox && this.useTypeEditBox.string) {
            queryReq.setUsetype(this.useTypeEditBox.string);
        }
        if (this._hasSetStartTime && this._hasSetEndTiem) {
            queryReq.setStarttime(Utils.getTimeTamp(this._startTime));
            queryReq.setEndtime(Utils.getTimeTamp(this._endTime));
        } else {
            if (!this._hasSetStartTime) {
                this._startTime = "2000-1-1 00:00:00";
            }
            if (!this._hasSetEndTiem) {
                this._endTime = Utils.getCurTime();
            }
            queryReq.setStarttime(Utils.getTimeTamp(this._startTime));
            queryReq.setEndtime(Utils.getTimeTamp(this._endTime));
        }
        // cc.log(queryReq);
        Net.getInstance().send(msgPb.Event.EVENT_QUERY_INFO_REQ, queryReq);
    }

    /**
     *  选择开始时间事件
     * @param event
     */
    public onStartTimeClick(event: cc.Event): void {
        const pop = cc.instantiate(resLoad.dirResList["dirRes"]["CALENDAR"]);
        const bg: cc.Node = pop.getChildByName("Bg");
        this.node.addChild(pop);
        if (bg) {
            const worldPos = event.target.parent.convertToWorldSpaceAR(event.target.position);
            const nodePos = bg.parent.convertToNodeSpaceAR(worldPos);
            bg.position = nodePos;
            bg.x = bg.x + bg.width / 2;
            bg.y = bg.y - bg.height / 2 - 30;
        }
        pop.cb = (time) => {
            cc.log(time);
            const lab = event.target.getChildByName("Lab");
            if (lab) {
                lab.getComponent(cc.Label).string = time;
            }
            this._startTime = time;
            this._hasSetStartTime = true;
        };
    }

    /**
     *  选择结束事件3
     * @param event
     */
    public onEndTimeClick(event: cc.Event): void {
        const pop = cc.instantiate(resLoad.dirResList["dirRes"]["CALENDAR"]);
        const bg: cc.Node = pop.getChildByName("Bg");
        this.node.addChild(pop);
        if (bg) {
            const worldPos = event.target.parent.convertToWorldSpaceAR(event.target.position);
            const nodePos = bg.parent.convertToNodeSpaceAR(worldPos);
            bg.position = nodePos;
            bg.x = bg.x + bg.width / 2;
            bg.y = bg.y - bg.height / 2 - 30;
        }
        pop.cb = (time) => {
            cc.log(time);
            const lab = event.target.getChildByName("Lab");
            if (lab) {
                lab.getComponent(cc.Label).string = time;
            }
            this._endTime = time;
            this._hasSetEndTiem = true;
        };
    }

    /**
     *  加页事件
     */
    public onAddYeClick(): void {
        this._curYe++;
        if (this._curYe > this._maxYe) {
            this._curYe = this._maxYe;
        }
        this._updateNote();
    }

    /**
     *  减页操作
     */
    public onJianYeClick(): void {
        this._curYe--;
        if (this._curYe <= 0) {
            this._curYe = 1;
        }
        this._updateNote();
    }

    /**
     *  设置数据
     * @private
     */
    private _setData(noteList): void {
        if (noteList.length == 0 || !noteList) {
            this._maxYe = 0;
        } else {
            let num1 = parseInt((noteList.length / CFG.ONE_YE_NUM).toString());
            const num2 = noteList.length % CFG.ONE_YE_NUM;
            if (num2 > 0) {
                num1 += 1;
            }
            this._maxYe = num1;
        }
        this._data = noteList;
        InfoManager.getInstance().setCurAllInfo(this._data);
    }

    /**
     *  处理数据
     * @param data
     * @private
     */
    private _dealWithData(data: any): void {
        const noteList = data.getInfolistList();
        this._setData(noteList);
        this._curYe = 1;
        this._updateNote();
    }

    /**
     *  删除取消
     */
    public onDelCancelClick(): void {
        InfoManager.getInstance().cancelDelInfo();
    }

    /**
     *  全选
     */
    public onDelAllSelectClick(event): void {
        InfoManager.getInstance().setAllInfoDel(event.isChecked);
    }

    /**
     *  确认删除
     */
    public onFixDelClick(): void {
        const delList = InfoManager.getInstance().getCurDelList();
        const delReq = new jzbPb.DelInfoReq();
        delReq.setIdlistList(delList);
        Net.getInstance().send(msgPb.Event.EVENT_DEL_INFO_REQ, delReq);
        InfoManager.getInstance().initInfoState()
        if (this.delOptNode) {
            this.delOptNode.active = false;
        }
    }

    public onEventMessage(event, data): void {
        switch (event) {
            case msgPb.Event.EVENT_RETURN_INFO_LIST: {
                this._dealWithData(data);
                break;
            }
            case msgPb.Event.EVENT_DEL_INFO_REP: {
                if (data.getCode().getCode() == msgPb.CodeType.ERR) {
                    TipMgr.getInstance().show(data.getCode().getMsg(), 1)
                } else {
                    data.getIdlistList().forEach((item1) => {
                        this._data.forEach((item2, index) => {
                            if (item1 == item2.getId()) {
                                this._data.splice(index, 1);
                            }
                        });
                    });
                    this._setData(this._data);
                    this._curYe = 1;
                    this._updateNote();
                }
                break;
            }
        }
    }

    // update (dt) {}
}
