package ConnectModule

import (
	"fmt"
	"golang.org/x/net/websocket"
)

func handle(conn *websocket.Conn)  {
	fmt.Print("有玩家连接呢\n")
	request := make([]byte, 128)
	defer conn.Close()
	//code := &msg.Code{
	//	Code: msg.CodeType_SUC,
	//	Msg: "123",
	//}
	//data, _ := proto.Marshal(code)
	//fmt.Println("编译的数据：", data)
	//newData := &msg.Code{}
	//proto.Unmarshal(data, newData)
	//fmt.Println("解码后的数据：", newData, int32(newData.Code))
	for {
		readLen, err := conn.Read(request)
		if err != nil {
			break
		}

		//socket被关闭了
		if readLen == 0 {
			fmt.Println("Client connection close!")
			break
		} else {
			//输出接收到的信息
			fmt.Println(string(request[:readLen]))
		}

		request = make([]byte, 128)
	}
	fmt.Print("有玩家断开连接\n")
}