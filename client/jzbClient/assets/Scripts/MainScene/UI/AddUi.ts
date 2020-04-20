
import {BaseUI} from "../../UIManager/UIManager";
import {TipMgr} from "../../Common/TipMgr";
import jzbPb = require("../../Proto/JiZhangBo/jiZhangBo_pb");
import msgPb = require("../../Proto/Common/msg_pb");
import {Net} from "../../Event/Net";
const {ccclass, property} = cc._decorator;

@ccclass
export default class AddUi extends BaseUI {

    @property({
        type: cc.EditBox,
        tooltip: "用途输入框"
    })
    useTypeEditBox = null;

    @property({
        type: cc.EditBox,
        tooltip: "金额输入框",
    })
    valEditBox = null;

    /**
     *  初始化
     */
    public init(): void {

    }

    /**
     *  获取路径
     * @returns {string}
     */
    public static getPath(): string {
        return "ui/AddUI";
    }

    /**
     *  提交按钮
     */
    public onFixClick(): void {
        if (this.useTypeEditBox && this.valEditBox) {
            if (!this.useTypeEditBox.string || !this.valEditBox.string) {
                TipMgr.getInstance().show("请输入有效值", 2);
            } else {
                const useType = this.useTypeEditBox.string;
                const val = parseFloat(this.valEditBox.string);
                cc.log(`添加的信息(用途：${useType}, 金额： ${val})`);
                const addReq = new jzbPb.AddInfoReq();
                const info = new msgPb.Info();
                info.setUsetype(useType);
                info.setVal(val);
                addReq.setInfo(info)
                Net.getInstance().send(msgPb.Event.EVENT_ADD_ONE_INFO, addReq);
            }
        } else {
            cc.log("未绑定");
        }
    }
}
