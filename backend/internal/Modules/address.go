package Modules

import "github.com/uptrace/bun"

type Address struct {
	bun.BaseModel `bun:"table:address"`

	Id           *int64  `json:"id" bun:"id,pk,autoincrement"`
	PostalCode   string  `json:"postal_code" bun:"postal_code,notnull"`
	Street       string  `json:"street" bun:"street,notnull"`
	Complement   string  `json:"complement" bun:"complement,notnull"`
	Number       string  `json:"number" bun:"number,notnull"`
	Neighborhood string  `json:"neighborhood" bun:"neighborhood,notnull"`
	City         string  `json:"city" bun:"city,notnull"`
	State        string  `json:"state" bun:"state,notnull"`
	CreatedAt    *string `json:"-" bun:"created_at,notnull,default:current_timestamp"`
	UpdatedAt    *string `json:"-" bun:"updated_at,notnull,default:current_timestamp,on update current_timestamp"`
}
