package Bootstrap

import (
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"ava-sesisenai/backend/internal/Config"
	"ava-sesisenai/backend/internal/Controller"
	"ava-sesisenai/backend/internal/Repository"
	"ava-sesisenai/backend/internal/Routes"
	"ava-sesisenai/backend/internal/Service"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"go.uber.org/dig"
)

func newRouter() *gin.Engine {
	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(gin.Logger())

	// CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     allowOriginsFromEnv(),
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	return r
}

func allowOriginsFromEnv() []string {
	//ALLOWED_ORIGINS="https://myapp.com,https://admin.myapp.com"
	val := os.Getenv("ALLOWED_ORIGINS")
	if strings.TrimSpace(val) == "" {
		return []string{"*"}
	}
	parts := strings.Split(val, ",")
	out := make([]string, 0, len(parts))
	for _, p := range parts {
		if s := strings.TrimSpace(p); s != "" {
			out = append(out, s)
		}
	}
	return out
}

func BuildContainer() *dig.Container {
	c := dig.New()

	must(c.Provide(Config.NewDB))
	must(c.Provide(newRouter))

	// repos
	must(c.Provide(Repository.NewUserRepository, dig.As(new(Repository.IUserRepository))))
	must(c.Provide(Repository.NewRolesRepository))

	// services
	must(c.Provide(Service.NewUserService))

	// controllers
	must(c.Provide(Controller.NewUserController))
	must(c.Provide(Controller.NewRolesController))

	must(c.Invoke(Routes.Register))

	return c
}

func Run(c *dig.Container) {
	err := c.Invoke(func(r *gin.Engine, db *bun.DB) {
		srv := &http.Server{Addr: ":8080", Handler: r}

		go func() {
			if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
				log.Fatalf("server error: %v", err)
			}
		}()

		select {}
	})
	if err != nil {
		log.Fatal(err)
	}
}

func must(err error) {
	if err != nil {
		log.Fatal(err)
	}
}
