package ConnectModule

import (
	"fmt"
	"golang.org/x/net/websocket"
)

func handle(conn *websocket.Conn)  {
	request := make([]byte, 128)
	defer conn.Close()
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
}