package Modules

import (
	"time"

	"github.com/uptrace/bun"
)

type Class struct {
	bun.BaseModel `bun:"table:class"`

	ID        int64     `json:"id" bun:"class_id,pk,autoincrement"`
	Code      string    `json:"code" bun:"code,notnull"`
	Name      string    `json:"name" bun:"name,notnull"`
	StartDate time.Time `json:"start_date" bun:"start_date,notnull"`
	Semester  string    `json:"semester" bun:"semester,notnull"`
	CreatedAt time.Time `json:"-" bun:"created_at,notnull,default:current_timestamp"`
	UpdatedAt time.Time `json:"-" bun:"updated_at,notnull,default:current_timestamp"`
}
