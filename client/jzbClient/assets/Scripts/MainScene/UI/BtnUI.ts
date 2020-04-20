import {UI_CFG, UIManager} from "../../UIManager/UIManager";
import AddUi from "./AddUi";
import QueryUi from "./QueryUi";
import MeUi from "./MeUi";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    private _curBtn: cc.Node = null; // 当前按钮

    private _autoBtnName: string = "BtnMe";

    onLoad () {
        this._selectBtn(this.node.getChildByName(this._autoBtnName));
        this.node.parent.zIndex = UI_CFG.UI_ZINDEX2;
        UIManager.getInstance().showUI(MeUi);
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
        switch (custom) {
            case "add": {
                UIManager.getInstance().showUI(AddUi);
                break;
            }
            case "query": {
                UIManager.getInstance().showUI(QueryUi);
                break;
            }
            case "me": {
                UIManager.getInstance().showUI(MeUi);
                break;
            }
            default: {
                cc.log(`未知的：${custom}`);
                break;
            }
        }
    }

    // update (dt) {}
}
