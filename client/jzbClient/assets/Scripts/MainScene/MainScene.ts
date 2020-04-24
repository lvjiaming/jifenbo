
import {User} from "../Common/User";
import {Net} from "../Event/Net";
import jzbPb = require('../Proto/JiZhangBo/jiZhangBo_pb')
import msgPb = require('../Proto/Common/msg_pb')
import {TipMgr} from "../Common/TipMgr";
import {Utils} from "../Common/Utils";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property({
        type: cc.Label,
        tooltip: "名字",
    })
    nameLab = null;

    onLoad () {
        Utils.setScreenFit(this.node);
        TipMgr.getInstance().init(this.node);
        this._initName();
        Net.getInstance().addObserver(this);
        Net.getInstance().setListen(this);
    }

    start () {
        
    }

    onDestroy() {
        Net.getInstance().removeListen();
        Net.getInstance().removeObserver(this);
    }

    /**
     *  重连成功
     */
    public reconnectSuc(): void {
        const userInfo = cc.sys.localStorage.getItem("userInfo");
        if (userInfo && userInfo != "") {
            const info = JSON.parse(userInfo);
            const login = new jzbPb.LoginReq();
            const user = new jzbPb.User();
            user.setName(info.name);
            user.setPwd(info.pwd);
            login.setUser(user);
            Net.getInstance().send(msgPb.Event.EVENT_LOGIN_REQ, login);
        }
    }

    /**
     *  重连失败
     */
    public reconnectFail(): void {
        TipMgr.getInstance().show("重连失败");
        cc.director.loadScene("LoginScene.fire");
    }

    /**
     *  初始化玩家名字
     * @private
     */
    private _initName(): void {
        if (this.nameLab) {
            this.nameLab.string = User.getInstance().name || "";
        }
    }

    public onEventMessage(event, data): void {
        switch (event) {
            case msgPb.Event.EVENT_MSG_INFO: {
                TipMgr.getInstance().show(data.getMsg(), 2);
                break;
            }
            case msgPb.Event.EVENT_LOGIN_REP: {
                console.log("登录回复");
                TipMgr.getInstance().hide();
                if (data.getCode().getCode() == msgPb.CodeType.SUC) {
                    TipMgr.getInstance().show("登录成功", 1);
                    User.getInstance().init(data.getUser());
                } else {
                    TipMgr.getInstance().show(data.getCode().getMsg(), 1);
                }
                break;
            }
        }
    }

    // update (dt) {}
}
