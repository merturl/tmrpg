package handler

import (
	"fmt"
	"time"

	"gopkg.in/macaron.v1"
)

type Person struct {
	Name string
	Age  int
	Time string
}

//IndexHandler Call index.html
func IndexHandler(ctx *macaron.Context) {
	// w := ctx.Resp
	// w.Header().Set("Acess-Control-Allow-Origin", "*")
	ctx.HTML(200, "index")
}

//HelloHandler Call CTX.JSON
func HelloHandler(ctx *macaron.Context) {
	t := time.Now()
	p := Person{"James", 25, fmt.Sprintf("%02d:%02d:%02d", t.Hour(), t.Minute(), t.Second())}
	ctx.JSON(200, &p)
}
