/**
 *  uiclass
 */
interface UIClass<T extends BaseUI> {
    new(): T,
    getPath(): string, // 获取ui的路径
}

/**
 *  各种常量
 */
const UI_CFG = {
    UI_ZINDEX1: 1000, // 层级1
    UI_ZINDEX2: 100, // 层级2
    UI_ZINDEX3: 1, // 层级3
};
export {
    UI_CFG,
}

export class BaseUI extends cc.Component {
    protected _par: cc.Node = null; // 父节点
    public set par(p: cc.Node): void {
        this._par = p;
    }
    public get par(): cc.Node {
        return this._par || cc.find("Canvas");
    }
}

export class UIManager {
    public static uimage:UIManager = null;
    public static getInstance(): UIManager {
        if (!this.uimage) {
            this.uimage = new UIManager();
        }
        return this.uimage;
    }

    private _lastUi: cc.Node = null; // 上个ui

    // 泛型声明
    // function functionName <T>(args: T) {}
    public showUI<T extends BaseUI>(uiClass: UIClass<T>): void {
        cc.loader.loadRes(uiClass.getPath(), () => {}, (err, prefab) => {
            if (err) {
                cc.error("加载出错：", err);
            } else {
                const ui = cc.instantiate(prefab);
                const parNode = ui.getComponent(uiClass) as BaseUI;
                parNode.par.addChild(ui);
            }
        });
    }
}