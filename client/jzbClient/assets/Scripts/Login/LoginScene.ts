// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {Net} from "../Event/Net";
import jzbPb = require('../Proto/JiZhangBo/jiZhangBo_pb')
import msgPb = require('../Proto/Common/msg_pb')
import {CommonCfg} from "../Common/CommonCfg";
import {resLoad} from "../Common/ResLoad";
import {TipMgr} from "../Common/TipMgr";
import {User} from "../Common/User";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property({
        type: cc.Node,
        tooltip: "登录节点",
    })
    loginNode = null;

    @property({
        type: cc.Node,
        tooltip: "注册节点",
    })
    registerNode = null;

    onLoad () {
        Net.getInstance().addObserver(this);
        TipMgr.getInstance().init(this.node);
        resLoad.loadDirRes("dirRes/Common", () => {
            TipMgr.getInstance().show("连接服务器中");
            Net.getInstance().connect(CommonCfg.HALL_HOST, () => {
                TipMgr.getInstance().show("服务器连接成功", 1);
                this.isShowLogin(true);
            });
        });
    }

    start () {

    }

    onDestroy() {
        Net.getInstance().removeObserver(this);
    }

    /**
     *  是否显示登录界面
     * @param state
     */
    public isShowLogin(state): void {
        if (state) {
            if (this.loginNode) {
                this.loginNode.active = true;
                this.initLogin();
            }
            if (this.registerNode) {
                this.registerNode.active = false;
            }
        } else {
            if (this.loginNode) {
                this.loginNode.active = false;
            }
            if (this.registerNode) {
                this.registerNode.active = true;
                this.initRegister();
            }
        }
    }
    /**
     *  初始化登录界面
     */
    public initLogin(): void {
        if (this.loginNode) {
            const name = this.loginNode.getChildByName("name");
            const pw = this.loginNode.getChildByName("password");
            if (name) {
                name.getComponent(cc.EditBox).string = "";
            }
            if (pw) {
                pw.getComponent(cc.EditBox).string = "";
            }
        }
    };
    /**
     *  初始化注册界面
     */
    public initRegister(): void {
        if (this.registerNode) {
            const name = this.registerNode.getChildByName("name");
            const pw1 = this.registerNode.getChildByName("password");
            const pw2 = this.registerNode.getChildByName("password2");
            if (name) {
                name.getComponent(cc.EditBox).string = "";
            }
            if (pw1) {
                pw1.getComponent(cc.EditBox).string = "";
            }
            if (pw2) {
                pw2.getComponent(cc.EditBox).string = "";
            }
        }
    };
    /**
     *  登录
     */
    public onLoginClick(): void {
        console.log("登录");
        const name = this.loginNode.getChildByName("name");
        const pw = this.loginNode.getChildByName("password");
        if (!name.getComponent(cc.EditBox).string || !pw.getComponent(cc.EditBox).string) {
            TipMgr.getInstance().show("不能输入空！！");
        } else {
            TipMgr.getInstance().show("登录中！！");
            const login = new jzbPb.LoginReq();
            const user = new jzbPb.User();
            user.setName(name.getComponent(cc.EditBox).string);
            user.setPwd(pw.getComponent(cc.EditBox).string);
            login.setUser(user);
            Net.getInstance().send(msgPb.Event.EVENT_LOGIN_REQ, login);
        }
    }
    /**
     *  注册
     */
    public onRegisterClick(): void {
        console.log("注册");
        const name = this.registerNode.getChildByName("name");
        const pw1 = this.registerNode.getChildByName("password");
        const pw2 = this.registerNode.getChildByName("password2");
        let isSame = false;
        if (this.registerNode) {
            if (pw1.getComponent(cc.EditBox).string == pw2.getComponent(cc.EditBox).string) {
                isSame = true;
            }
        }
        if (!isSame) {
            TipMgr.getInstance().show("请输入正确的信息", 2);
            return;
        }
        TipMgr.getInstance().show("正在注册中！！");
        const register = new jzbPb.RegisterReq();
        const user = new jzbPb.User();
        user.setName(name.getComponent(cc.EditBox).string);
        user.setPwd(pw1.getComponent(cc.EditBox).string);
        register.setUser(user);
        Net.getInstance().send(msgPb.Event.EVENT_REGISTER_REQ, register);
    }
    /**
     *  打开注册界面
     */
    public onOpenRegisterClick(): void {
        this.isShowLogin(false);
    }
    /**
     *  打开登录界面
     */
    public onOpenLoginClick(): void {
        this.isShowLogin(true);
    }
    public onEventMessage(event, data): void {
        switch (event) {
            case msgPb.Event.EVENT_REGISTER_REP: {
                console.log("注册回复");
                TipMgr.getInstance().show(data.getCode().getMsg(), 1);
                if (data.getCode().getCode() == msgPb.CodeType.SUC) {
                    TipMgr.getInstance().show(data.getCode().getMsg(), 1);
                    this.isShowLogin(true);
                }
                break;
            }
            case msgPb.Event.EVENT_LOGIN_REP: {
                console.log("登录回复");
                if (data.getCode().getCode() == msgPb.CodeType.SUC) {
                    User.getInstance().init(data.getUser());
                    cc.director.loadScene("MainScene.fire");
                } else {
                    TipMgr.getInstance().show(data.getCode().getMsg(), 1);
                }
                break;
            }
        }
    }
    // update (dt) {}
}
