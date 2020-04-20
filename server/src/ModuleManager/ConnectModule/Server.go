package ConnectModule

import (
	"../../Cfg"
	"../../ModuleManager"
	"../../Proto/Common"
	"../DbModule"
	"fmt"
	"golang.org/x/net/websocket"
	"net/http"
	"os"
)

var (
	UserDb *DbModule.UserDb
	userList []*handle
)

/**
 连接函数
 */

func connect(ws *websocket.Conn)  {
	//fmt.Print("有玩家连接呢\n")
	handle := &handle{
		ws: ws,
		wsMsg: websocket.Message,
	}
	userList = append(userList, handle)
	defer func() {
		for key, val := range userList{
			if val.ws == ws {
				userList = append(userList[:key], userList[key + 1:]...)
				break
			}
		}
		ws.Close()
		//fmt.Print("有玩家断开连接\n")
	}()
	var msgByte []byte
	for {
		if err := handle.wsMsg.Receive(ws, &msgByte); err != nil {
			break
		}
		var msgDataByte []byte
		// 以[]byte的第一位作为协议id，反编译数据时需要处理msgByte
		for key := 1; key < len(msgByte); key++ {
			msgDataByte = append(msgDataByte, msgByte[key])
		}
		msgId := msgByte[0]
		handle.handleFunc(msg.Event(msgId), msgDataByte)
	}
}

func StartServer() (err error) {
	// 这里获取到userDb
	db, err := ModuleManager.GetModuleManager().GetDb(Cfg.UserDb)
	if err == nil {
		uDb, ok := DbModule.GetUserDb(db)
		if ok != nil {
			fmt.Println(ok.Error())
		} else {
			UserDb = uDb
		}
	}
	fmt.Print("服务器开启中\n")
	http.Handle("/server", websocket.Handler(connect))
	adr := fmt.Sprintf(":%s", Cfg.ServerPort)
	fmt.Println("监听：", adr)
	if err = http.ListenAndServe(adr, nil); err != nil {
		fmt.Println("连接出错")
		os.Exit(1)
	}
	return
}