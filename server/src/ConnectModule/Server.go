package ConnectModule

import (
	"../Cfg"
	"fmt"
	"golang.org/x/net/websocket"
	"os"

	"net/http"
)

func StartServer() (err error) {
	fmt.Print("服务器开启中\n")
	http.Handle("/server", websocket.Handler(handle))
	adr := fmt.Sprintf(":%s", Cfg.ServerPort)
	fmt.Println("监听：", adr)
	if err = http.ListenAndServe(adr, nil); err != nil {
		fmt.Println("连接出错")
		os.Exit(1)
	}
	return
}