import {GameEventManager} from "./GameEventManager";
import msgPb = require('../Proto/Common/msg_pb')
export class Net extends GameEventManager{
    public static net: Net = null;
    public static getInstance(): Net {
        if (this.net == null) {
            this.net = new Net();
        }
        return this.net;
    }

    public send(msgId, data): void {
        switch (msgId) {
            case msgPb.Event.EVENT_REGISTER_REQ: {
                this.sendMessage(msgId, data);
                break;
            }
        }
    }

    public onMsg(msgId, body): void {
        cc.log("协议id: ", msgId);
        switch (msgId) {
            case msgPb.Event.EVENT_REGISTER_REP: {
                const data = msgPb.Code.deserializeBinary(body);
                cc.log(data);
                break;
            }
        }
    }
}
