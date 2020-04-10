/**
 启动程序
 */
package main

import (
	. "./ModuleManager"
	"fmt"
	"sync"
)
var waitGroup sync.WaitGroup
func main()  {
	fmt.Print("等待准备工作\n")
	waitGroup.Add(1)
	go ConnectDb(&waitGroup) // 在其他包调用时需要传内存地址，传值无法生效
	waitGroup.Wait()
	fmt.Print("所有准备已就绪\n")
	ConnectServer()
}
