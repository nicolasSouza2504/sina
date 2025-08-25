package Modules

import "github.com/uptrace/bun"

type Role struct {
	bun.BaseModel `bun:"table:roles"`

	ID   int64  `json:"id" bun:"role_id,pk,autoincrement"`
	Name string `json:"name" bun:"role_name,unique,notnull"`
}
