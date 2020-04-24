import {GameEventManager} from "./GameEventManager";
import msgPb = require('../Proto/Common/msg_pb')
import jpzPb = require("../Proto/JiZhangBo/jiZhangBo_pb")
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
            case msgPb.Event.EVENT_LOGIN_REQ: {
                this.sendMessage(msgId, data);
                break;
            }
            default: {
                this.sendMessage(msgId, data);
                break;
            }
        }
    }

    public onMsg(msgId, body): void {
        cc.log("协议id: ", msgId);
        // cc.log(body);
        let data = null;
        switch (msgId) {
            case msgPb.Event.EVENT_REGISTER_REP: {
                data = jpzPb.RegisterRep.deserializeBinary(body);
                break;
            }
            case msgPb.Event.EVENT_LOGIN_REP: {
                data = jpzPb.LoginRep.deserializeBinary(body);
                break;
            }
            case msgPb.Event.EVENT_MSG_INFO: {
                data = msgPb.Code.deserializeBinary(body);
                break;
            }
            case msgPb.Event.EVENT_RETURN_INFO_LIST: {
                data = jpzPb.InfoList.deserializeBinary(body);
                break;
            }
            case msgPb.Event.EVENT_DEL_INFO_REP: {
                data = jpzPb.DelInfoRep.deserializeBinary(body);
                break;
            }
            case msgPb.Event.EVENT_CHANGE_INFO_REP: {
                data = jpzPb.ChangeInfoRep.deserializeBinary(body);
                break;
            }
        }
        console.log(data);
        this.notifyEvent(msgId, data);
    }
}
