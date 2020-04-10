/**
 数据库管理
 */
package DbModule

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
)

type Db struct {
	Ip string  // ip
	MaxIdle int //
	MaxOpen int // 最大连接数
	User string // 数据库的用户
	Pwd string // 数据库的密码
	DbName string // 数据库名字
	Port string // 端口
	Pool *sql.DB // 连接池
}

func (b *Db) Init() (err error) {
	url := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8",
		b.User,
		b.Pwd,
		b.Ip,
		b.Port,
		b.DbName,
		)
	fmt.Println("连接Db：", url)
	b.Pool, err = sql.Open("mysql", url) // 全局只需要调用一次
	if err != nil {
		return
	}
	err = b.Pool.Ping() // 每次用时，都需要ping一下
	if err != nil {
		return
	}
	if b.MaxIdle == 0 {
		b.MaxIdle = 10
	}
	if b.MaxOpen == 0 {
		b.MaxOpen = 10
	}
	// 设置最大连接数
	b.Pool.SetMaxIdleConns(b.MaxIdle)
	b.Pool.SetMaxOpenConns(b.MaxOpen)
	return
}


