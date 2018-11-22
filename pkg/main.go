package main

import (
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"time"

	"github.com/go-macaron/session"
	"github.com/merturl/go-socket.io"
	"github.com/tmrpg/pkg/handler"
	"gopkg.in/macaron.v1"
)

type Player struct {
	ID        string `json:"id"`
	X         int64  `json:"x"`
	Y         int64  `json:"y"`
	Direction string `json:"direction"`
}

type Pointer struct {
	X         int64  `json:"x"`
	Y         int64  `json:"y"`
	Direction string `json:"direction"`
}

func randomInt63n(low, high int64) int64 {
	return rand.Int63n(high-low) + low
}

func main() {
	m := macaron.Classic()
	var clientIds map[string]Player

	clientIds = make(map[string]Player)

	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal(err)
	}
	server.On("connection", func(so socketio.Socket) {
		log.Println("on connection")
		log.Println(server.Count())
		so.Join("GameScene")
		so.On("newplayer", func() {
			player := Player{
				ID:        so.Id(),
				X:         randomInt63n(100, 400),
				Y:         randomInt63n(100, 400),
				Direction: "up",
			}

			clientIds[so.Id()] = player                          // add player List
			so.Emit("allplayers", clientIds)                     //render all users
			server.BroadcastTo("GameScene", "newplayer", player) //send clients newplayer join!

			so.On("keydown", func(msg string) {
				log.Println(msg)
				data := &Player{
					ID: so.Id(),
				}
				err := json.Unmarshal([]byte(msg), data)
				if err != nil {
					log.Fatal(err)
				}
				server.BroadcastTo("GameScene", "movePlayer", data) //send client is move all player
			})
		})
	})

	server.On("disconnection", func(so socketio.Socket) {
		delete(clientIds, so.Id())
		so.Leave("GameScene")
		log.Println("on disconnect")
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
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		origin := r.Header.Get("Origin")
		w.Header().Set("Access-Control-Allow-Origin", origin)
		server.ServeHTTP(w, r)
	})
	http.Handle("/", m)
	log.Fatal(http.ListenAndServe(":4000", nil))
	log.Println("Server is runnings...")
	log.Println("http://localhost:4000")
}
