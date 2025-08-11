package Container

import (
	"ava-sesisenai/backend/internal/Controller"
	"ava-sesisenai/backend/internal/Repository"

	"github.com/uptrace/bun"
)

type Container struct {
	DB        *bun.DB
	RolesRepo *Repository.RolesRepository
	RolesCtl  *Controller.RolesController
}

func New(db *bun.DB) *Container {
	rolesRepo := Repository.NewRolesRepository(db)
	rolesCtl := Controller.NewRolesController(rolesRepo)

	return &Container{
		DB:        db,
		RolesRepo: rolesRepo,
		RolesCtl:  rolesCtl,
	}
}
