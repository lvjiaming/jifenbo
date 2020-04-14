package ConnectModule

import (
	"../Proto/Common"
	"fmt"
	"github.com/golang/protobuf/proto"
	"golang.org/x/net/websocket"
)

func handle(ws *websocket.Conn)  {
	fmt.Print("有玩家连接呢\n")
	//request := make([]byte, 128)
	defer func() {
		ws.Close()
		fmt.Print("有玩家断开连接\n")
	}()
	var msgByte []byte
	for {
		if err := websocket.Message.Receive(ws, &msgByte); err != nil {
			break
		}
		var msgDataByte []byte
		// 以[]byte的第一位作为协议id，反编译数据时需要处理msgByte
		for key := 1; key < len(msgByte); key++ {
			msgDataByte = append(msgDataByte, msgByte[key])
		}
		msgId := msgByte[0]
		go handleFunc(ws, msg.Event(msgId), msgDataByte)
	}
}

func handleFunc(ws *websocket.Conn, msgId msg.Event, msgByte []byte)  {
	fmt.Println("收到的协议id: ", msgId)
	switch msgId {
	case msg.Event_EVENT_REGISTER_REQ: {
		user := &msg.User{}
		proto.Unmarshal(msgByte, user)
		fmt.Println("玩家信息： ", user)

		code := &msg.Code{
			Code:                 msg.CodeType_SUC,
			Msg:                  "成功",
		}
		var codeDataByte []byte
		codeByte, _ := proto.Marshal(code)
		codeDataByte = append(codeDataByte, byte(msg.Event_EVENT_REGISTER_REP))
		codeDataByte = append(codeDataByte, codeByte...)
		if err := websocket.Message.Send(ws, codeDataByte); err != nil {
			fmt.Println("发送出错", err.Error())
		}
	}
	case msg.Event_EVENT_LOGIN_REQ: {

	}

	}
}
