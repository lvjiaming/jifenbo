import {Utils} from "../../Common/Utils";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

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

    private _index: number = 0;


    private _data: any = null;
    onLoad () {
        this._data = (<any>this.node).data || {};
        this._index = (<any>this.node).infoIndex;
        this._initInfo();
    }

    start () {

    }

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

    // update (dt) {}
}
