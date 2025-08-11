package Repository

import (
	"context"

	"ava-sesisenai/backend/internal/Modules"

	"github.com/uptrace/bun"
)

type RolesRepository struct {
	db *bun.DB
}

func NewRolesRepository(db *bun.DB) *RolesRepository {
	return &RolesRepository{db: db}
}

func (r *RolesRepository) List(ctx context.Context) ([]Modules.Role, error) {
	var roles []Modules.Role
	err := r.db.NewSelect().Model(&roles).Order("role_id ASC").Scan(ctx)
	return roles, err
}

func (r *RolesRepository) GetByID(ctx context.Context, id int64) (*Modules.Role, error) {
	role := new(Modules.Role)
	err := r.db.NewSelect().
		Model(role).
		Where("role_id = ?", id).
		Limit(1).
		Scan(ctx)
	if err != nil {
		return nil, err
	}
	return role, nil
}
