import {UI_CFG, UIManager, UIClass} from "../../UIManager/UIManager";
import AddUi from "./AddUi";
import QueryUi from "./QueryUi";
import MeUi from "./MeUi";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    private _curBtn: cc.Node = null; // 当前按钮

    private _autoBtnName: string = "BtnMe";

    private _curShowPop: UIClass<T> = null;

    onLoad () {
        this._selectBtn(this.node.getChildByName(this._autoBtnName));
        this.node.parent.zIndex = UI_CFG.UI_ZINDEX2;
        UIManager.getInstance().showUI(MeUi);
        this._curShowPop = MeUi;
    }

    start () {

    }

    /**
     * 选择节点
     * @param sNode
     * @private
     */
    private _selectBtn(sNode: cc.Node): void {
        if (this._curBtn) {
            this._curBtn.getComponent(cc.Button).interactable = true;
        }
        if (sNode) {
            this._curBtn = sNode;
            sNode.getComponent(cc.Button).interactable = false;
        }
    }

    /**
     *  按钮
     */
    public onBtnClick(event: any, custom: string): void {
        this._selectBtn(event.target);
        if (this._curShowPop) {
            UIManager.getInstance().delUI(this._curShowPop);
        }
        switch (custom) {
            case "add": {
                this._curShowPop = AddUi;
                break;
            }
            case "query": {
                this._curShowPop = QueryUi;
                break;
            }
            case "me": {
                this._curShowPop = MeUi;
                break;
            }
            default: {
                cc.log(`未知的：${custom}`);
                break;
            }
        }
        if (this._curShowPop) {
            UIManager.getInstance().showUI(this._curShowPop);
        }
    }

    // update (dt) {}
}
