import {InfoManager, INFO_STATE} from "../../UIManager/InfoManager";
import {TipMgr} from "../../Common/TipMgr";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    onLoad () {

    }

    start () {

    }

    /**
     *  关闭
     */
    public onCloseClick(): void {
        this._close();
    }

    /**
     *  修改按钮
     */
    public onChangeClick(): void {
        if (InfoManager.getInstance().getInfoState() == INFO_STATE.NONE) {
            InfoManager.getInstance().startChange((<any>this.node).owner);
        } else {
            TipMgr.getInstance().show("请结束上一步操作", 1)
        }
        this._close();
    }

    /**
     * 删除按钮
     */
    public onDelClick(): void {
        this._close();
        if (InfoManager.getInstance().getInfoState() == INFO_STATE.NONE) {
            InfoManager.getInstance().startDelInfo();
            (<any>this.node).owner.selectDel();
        } else {
            TipMgr.getInstance().show("请结束上一步操作", 1)
        }
    }

    /**
     *  关闭界面
     * @private
     */
    private _close(): void {
        this.node.destroy();
    }

    // update (dt) {}
}
