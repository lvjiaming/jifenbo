// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {GameEventManager} from "../Event/GameEventManager";
import {Net} from "../Event/Net";
import jzbPb = require('../Proto/JiZhangBo/jiZhangBo_pb')
import msgPb = require('../Proto/Common/msg_pb')
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    start () {
        // ws://127.0.0.1:6666/echo
        Net.getInstance().connect(cc.commonCfg.HALL_HOST, () => {
            cc.log("连接成功");
            cc.log(jzbPb);
            const user = new jzbPb.User();
            user.setName("张三");
            user.setPwd("123b4kads");
            Net.getInstance().sendMessage(msgPb.Event.EVENT_REGISTER_REQ, user);
        });
    }
    // update (dt) {}
}
