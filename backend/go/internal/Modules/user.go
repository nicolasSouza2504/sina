package Modules

import "github.com/uptrace/bun"

type User struct {
	bun.BaseModel `bun:"table:users"`

	ID       *int   `json:"id" bun:"id,pk,autoincrement"`
	Name     string `json:"name" bun:"name,notnull"`
	Email    string `json:"email" bun:"email,unique,notnull"`
	Password string `json:"-" bun:"password, notnull"`
	Phone    string `json:"phone" bun:"phone,notnull"`

	IsActive bool `json:"is_active" bun:"is_active,notnull,default:true"`

	RoleID int64 `json:"role_id" bun:"role_id,notnull"`
	Role   *Role `json:"role" bun:"rel:belongs-to,join:role_id=role_id"`

	AddressID int64    `json:"address_id" bun:"address_id,notnull"`
	Address   *Address `json:"address" bun:"rel:belongs-to,join:address_id=id"`

	CreatedAt *string `json:"-" bun:"created_at,notnull,default:current_timestamp"`
	UpdatedAt *string `json:"-" bun:"updated_at,notnull,default:current_timestamp,on update current_timestamp"`
}
