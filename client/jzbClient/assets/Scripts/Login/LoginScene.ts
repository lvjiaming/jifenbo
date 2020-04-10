// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {GameEventManager} from "../Event/GameEventManager";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    start () {
        const net = new GameEventManager();
        // ws://127.0.0.1:6666/echo
        net.connect(cc.commonCfg.HALL_HOST, () => {
            cc.log("连接成功");
            setTimeout(() => {
                net.sendMessage(10, {msg: "嘻嘻"});
            }, 2000)
        });
    }

    // update (dt) {}
}
