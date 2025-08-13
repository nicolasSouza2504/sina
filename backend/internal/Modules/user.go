package Modules

import "github.com/uptrace/bun"

type User struct {
	bun.BaseModel `bun:"table:users"`
	ID            *int     `json:"id"`
	Name          string   `json:"name" bun:"notnull"`
	Email         string   `json:"email" bun:"unique,notnull"`
	Password      string   `json:"-" bun:"notnull"`
	Phone         string   `json:"phone" bun:"notnull"`
	ISActive      bool     `json:"is_active" bun:"is_active,notnull,default:true"`
	RoleID        int64    `json:"role_id" bun:"role_id, notnull"`
	Role          *Role    `bun:"rel:belongs-to,join:role_id=role_id"`
	AddressID     int64    `json:"address_id" bun:"address_id, notnull"`
	Address       *Address `bun:"rel:belongs-to,join:address_id=address_id"`
	CreatedAt     *string  `json:"created_at" bun:"created_at,notnull,default:current_timestamp"`
	UpdatedAt     *string  `json:"updated_at" bun:"updated_at,notnull,default:current_timestamp,on update current_timestamp"`
}
