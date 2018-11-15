package main

import (
	"log"
	"net/http"
	"time"

	"github.com/go-macaron/session"
	"github.com/googollee/go-socket.io"
	"github.com/internet-novel-editor/pkg/handler"
	"gopkg.in/macaron.v1"
)

func main() {
	m := macaron.Classic()

	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal(err)
	}
	server.On("connection", func(so socketio.Socket) {
		log.Println("on connection")
		so.Join("chat")
		so.On("chat message", func(msg string) {
			log.Println("emit:", so.Emit("chat message", msg))
			so.BroadcastTo("chat", "chat message", msg)
		})
		so.On("disconnection", func() {
			log.Println("on disconnect")
		})
	})
	server.On("error", func(so socketio.Socket, err error) {
		log.Println("error:", err)
	})

	m.Use(macaron.Static("public", macaron.StaticOptions{
		Prefix:      "public",
		SkipLogging: true,
		IndexFile:   "index.html",
		Expires: func() string {
			return time.Now().Add(24 * 60 * time.Minute).UTC().Format("Mon, 02 Jan 2006 15:04:05 GMT")
		},
	}))
	m.Use(macaron.Renderer(macaron.RenderOptions{
		IndentJSON:      false,
		Directory:       "public",
		HTMLContentType: "text/html",
	}))

	m.Use(session.Sessioner())
	m.Use(macaron.Recovery())

	m.Get("/*", handler.IndexHandler)
	m.Get("/api", handler.HelloHandler)

	m.Get("/signup", func(ctx *macaron.Context, f *session.Flash) {
		f.Warning("Just be careful.")
		ctx.JSON(200, "HEllo")
	})

	m.Get("/signup2", func(sess session.Store) string {
        sess.Set("session", "session middleware")
        return sess.Get("session").(string)
    })

	http.HandleFunc("/socket.io/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		server.ServeHTTP(w, r)
	})
	http.Handle("/", m)
	log.Fatal(http.ListenAndServe(":4000", nil))
	log.Println("Server is runnings...")
	log.Println("http://localhost:4000")
}
