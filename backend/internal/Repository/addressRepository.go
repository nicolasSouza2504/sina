package Repository

import (
	"context"
	"fmt"

	"ava-sesisenai/backend/internal/Modules"

	"github.com/uptrace/bun"
)

type IAddressRepository interface {
	Create(ctx context.Context, address *Modules.Address) (int64, error)
	GetByID(ctx context.Context, id int64) (*Modules.Address, error)
}

type AddressRepository struct {
	db *bun.DB
}

func NewAddressRepository(db *bun.DB) *AddressRepository {
	return &AddressRepository{db: db}
}

func (r *AddressRepository) Create(ctx context.Context, address *Modules.Address) (int64, error) {
	_, err := r.db.NewInsert().Model(address).Exec(ctx)
	if err != nil {
		return 0, err
	}
	if address.Id == nil {
		return 0, fmt.Errorf("address ID not returned after insert")
	}
	return *address.Id, nil
}

func (r *AddressRepository) GetByID(ctx context.Context, id int64) (*Modules.Address, error) {
	addr := new(Modules.Address)
	err := r.db.NewSelect().
		Model(addr).
		Where("id = ?", id).
		Limit(1).
		Scan(ctx)
	if err != nil {
		return nil, err
	}
	return addr, nil
}
