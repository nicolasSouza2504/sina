package Middleware

import (
	"errors"
	"net/http"
	"strings"

	"ava-sesisenai/backend/internal/pkg"

	"github.com/gin-gonic/gin"
)

const (
	CtxJwtToken = "jwtToken"
	CtxUserID   = "userID"
	CtxUser     = "user"
)

func RequireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		auth := c.GetHeader("Authorization")
		if auth == "" || !strings.HasPrefix(auth, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing or invalid Authorization header"})
			return
		}
		tokenStr := strings.TrimPrefix(auth, "Bearer ")
		tokenStr = strings.TrimSpace(tokenStr)
		if tokenStr == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "empty bearer token"})
			return
		}

		jt, err := pkg.DecodeJWT(tokenStr)
		if err != nil {
			if errors.Is(err, pkg.ErrTokenExpired) {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "token expired"})
				return
			}
			if errors.Is(err, pkg.ErrTokenNotValidYet) {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "token not valid yet"})
				return
			}
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			return
		}

		c.Set(CtxJwtToken, jt)
		c.Set(CtxUserID, jt.Sub)
		c.Set(CtxUser, jt.User)

		c.Next()
	}
}

func GetAuthUser(c *gin.Context) (int, bool) {
	v, ok := c.Get(CtxUserID)
	if !ok {
		return 0, false
	}
	uid, _ := v.(int)
	return uid, true
}
