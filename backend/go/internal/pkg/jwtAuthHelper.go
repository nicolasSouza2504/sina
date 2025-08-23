package pkg

import (
	"ava-sesisenai/backend/internal/Modules"
	"encoding/json"
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type JwtPayload struct {
	Iss   string       `json:"iss"`
	Sub   int          `json:"sub"`
	Email string       `json:"email"`
	Role  Modules.Role `json:"role"`
	User  Modules.User `json:"user"`
	Iat   int64        `json:"iat"`
	Exp   int64        `json:"exp"`
}

type JwtToken struct {
	Iss   string
	Sub   int
	Email string
	Role  Modules.Role
	User  Modules.User
	Iat   int64
	Exp   int64
}

var (
	ErrTokenExpired     = errors.New("token expired")
	ErrTokenNotValidYet = errors.New("token not valid yet")
	ErrTokenInvalid     = errors.New("invalid token")
)

func BuildPayload(user Modules.User, permissions []string) JwtPayload {
	now := time.Now().Unix()
	return JwtPayload{
		Iss:   "auth_service",
		Sub:   *user.ID,
		Email: user.Email,
		Role:  *user.Role,
		User:  user,
		Iat:   now,
		Exp:   now + 86400, // 24h
	}
}

func EncodeJWT(payload JwtPayload) (string, error) {
	secret := os.Getenv("JWT_SECRET")
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"iss":   payload.Iss,
		"sub":   payload.Sub,
		"email": payload.Email,
		"role":  payload.Role,
		"user":  payload.User,
		"iat":   payload.Iat,
		"exp":   payload.Exp,
	})
	return token.SignedString([]byte(secret))
}

func DecodeJWT(tokenStr string) (*JwtToken, error) {
	secret := os.Getenv("JWT_SECRET")
	parsed, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})
	if err != nil {
		return nil, err
	}

	if claims, ok := parsed.Claims.(jwt.MapClaims); ok && parsed.Valid {
		data, _ := json.Marshal(claims)
		var payload JwtPayload
		if err := json.Unmarshal(data, &payload); err != nil {
			return nil, err
		}
		return &JwtToken{
			Iss:   payload.Iss,
			Sub:   payload.Sub,
			Email: payload.Email,
			Role:  payload.Role,
			User:  payload.User,
			Iat:   payload.Iat,
			Exp:   payload.Exp,
		}, nil
	}
	return nil, jwt.ErrTokenInvalidClaims
}
