/**
 启动程序
 */
package main

import (
	. "./DbModule"
	"fmt"
)
import "./Cfg"
func main()  {
	db := Db{
		Ip: Cfg.DbIp,
		Port: Cfg.DbPort,
		MaxIdle: 10,
		MaxOpen: 10,
		User: Cfg.DbUser,
		Pwd: Cfg.DbPwd,
		DbName: Cfg.DbName,
	}
	err := db.Init()
	if err != nil {
		fmt.Println("连接出错：", err.Error())
	} else {
		fmt.Println("连接成功")
		stmt, err := db.Pool.Prepare("INSERT user SET id=?,name=?,pw=?")
		defer stmt.Close()
		if err != nil {
			fmt.Println("prepare出错了")
		}
		res, err := stmt.Exec(10, "张三", "1234")
		if err != nil {
			fmt.Println("插入出错")
		} else {
			fmt.Println("插入成功", res)
		}
	}
}
