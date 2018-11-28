package main

import (
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/merturl/go-socket.io"
	"github.com/merturl/tmrpg/pkg/handler"
	"gopkg.in/macaron.v1"
)

//Player is Player
type Player struct {
	ID        string `json:"id"`
	X         int64  `json:"x"`
	Y         int64  `json:"y"`
	Direction string `json:"direction"`
}

func determineListenAddress() (string, error) {
	port := os.Getenv("PORT")
	if port == "" {
		port = "4000"
	}
	return ":" + port, nil
}

func newSocketioInstance() *socketio.Server {
	var clientIds map[string]*Player
	var mutex = &sync.Mutex{}
	clientIds = make(map[string]*Player)

	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal(err)
	}

	server.On("connection", func(so socketio.Socket) {
		log.Println("on connection")
		log.Println(server.Count())
		log.Println()

		so.On("askNewPlayer", func() {
			so.Join("GameScene")
			player := &Player{
				ID:        so.Id(),
				X:         randomInt63n(100, 400),
				Y:         randomInt63n(100, 400),
				Direction: "up",
			}
			clientIds[so.Id()] = player                      // add player List
			so.Emit("currentPlayers", clientIds)             //render all users
			so.BroadcastTo("GameScene", "addPlayer", player) //send clients newplayer join!
		})

		so.On("keydown", func(msg string) {
			mutex.Lock()
			clientIds[so.Id()] = &Player{
				ID: so.Id(),
			}
			err := json.Unmarshal([]byte(msg), clientIds[so.Id()])
			if err != nil {
				log.Fatal(err)
			}
			server.BroadcastTo("GameScene", "movePlayer", clientIds[so.Id()]) //send client is move all player
			mutex.Unlock()
		})

		so.On("disconnection", func(so socketio.Socket) {
			server.BroadcastTo("GameScene", "removePlayer", so.Id())
			delete(clientIds, so.Id())
			so.Leave("GameScene")
			log.Println("on disconnect")
			log.Println()
		})
	})

	server.On("error", func(so socketio.Socket, err error) {
		log.Println("error:", err)
	})

	return server
}

func newMacaronInstance() *macaron.Macaron {
	m := macaron.New()
	m.Use(macaron.Logger())
	m.Use(macaron.Recovery())

	// Middlewares
	m.Use(macaron.Renderer(macaron.RenderOptions{
		IndentJSON:      false,
		Directory:       "public",
		HTMLContentType: "*/*",
	}))
	m.Use(macaron.Static("public", macaron.StaticOptions{
		Prefix:      "",
		SkipLogging: false,
		IndexFile:   "index.html",
		Expires: func() string {
			return time.Now().Add(24 * 60 * time.Minute).UTC().Format("Mon, 02 Jan 2006 15:04:05 GMT")
		},
	}))

	//Routers
	m.Get("/*", handler.IndexHandler)
	m.Get("/api", handler.HelloHandler)

	return m
}

func newGinInstance() *gin.Engine {
	router := gin.Default()
	router.Use(static.Serve("/", static.LocalFile("./public", true)))
	api := router.Group("/api")
	{
		api.GET("/", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"message": "pong",
			})
		})
	}
	return router
}

func randomInt63n(low, high int64) int64 {
	return rand.Int63n(high-low) + low
}

func main() {
	m := newGinInstance()
	// m := newMacaronInstance()
	server := newSocketioInstance()

	addr, err := determineListenAddress()
	if err != nil {
		log.Fatal(err)
	}

	http.HandleFunc("/socket.io/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		origin := r.Header.Get("Origin")
		w.Header().Set("Access-Control-Allow-Origin", origin)
		server.ServeHTTP(w, r)
	})
	http.Handle("/", m)
	http.ListenAndServe(addr, nil)
}
