package ConnectModule

import (
	"../../Proto/Common"
	"../../Proto/JiZhangBo"
	"fmt"
	"github.com/golang/protobuf/proto"
	"golang.org/x/net/websocket"
)

type handle struct {
	ws *websocket.Conn // ws连接
	wsMsg websocket.Codec
}

/**
 协议处理函数
 */
func (h *handle) handleFunc(msgId msg.Event, msgByte []byte)  {
	fmt.Println("收到的协议id: ", msgId)
	switch msgId {
	case msg.Event_EVENT_REGISTER_REQ: {
		user := &msg.User{}
		h.decodeData(msgByte, user)

		registerRep := &jiZhangBo.RegisterRep{
			Code: h.getSucCode("注册成功"),
		}
		h.send(msg.Event_EVENT_REGISTER_REP, registerRep)
	}
	case msg.Event_EVENT_LOGIN_REQ: {
		login := &jiZhangBo.LoginReq{}
		h.decodeData(msgByte, login)
		fmt.Println("登录信息：", login)
	}

	}
}

/**
 解析数据
 */
func (h *handle) decodeData (byteData []byte, receiveData proto.Message)  {
	proto.Unmarshal(byteData, receiveData)
}

/**
获取成功的Code
 */
func (h *handle) getSucCode (str string) (code *msg.Code) {
	code = &msg.Code{
		Code:                 msg.CodeType_SUC,
		Msg:                  str,
	}
	return
}

/**
获取失败的Code
 */
func (h *handle) getErrCode (errStr string) (code *msg.Code) {
	code = &msg.Code{
		Code:                 msg.CodeType_ERR,
		Msg:                  errStr,
	}
	return
}

func (h *handle) send (msgId msg.Event, msgData proto.Message)  {
	var sendByte []byte
	msgDataByte, _ := proto.Marshal(msgData)
	sendByte = append(sendByte, byte(msgId))
	sendByte = append(sendByte, msgDataByte...)
	if err := websocket.Message.Send(h.ws, sendByte); err != nil {
		fmt.Println("发送出错", err.Error())
	}
}