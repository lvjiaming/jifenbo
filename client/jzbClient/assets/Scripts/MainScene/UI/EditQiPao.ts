import {InfoManager} from "../../UIManager/InfoManager";
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
        this._close();
    }

    /**
     * 删除按钮
     */
    public onDelClick(): void {
        this._close();
        InfoManager.getInstance().startDelInfo();
        (<any>this.node).owner.selectDel();
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
