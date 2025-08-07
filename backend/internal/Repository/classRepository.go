package Repository

import (
	"context"
	"database/sql"

	"ava-sesisenai/backend/internal/Modules"

	"github.com/uptrace/bun"
)

type IClassRepository interface {
	List(ctx context.Context) ([]*Modules.Class, error)
	GetByID(ctx context.Context, id int64) (*Modules.Class, error)
	Create(databaseContext context.Context, class *Modules.Class) (*Modules.Class, error)
	Update(databaseContext context.Context, class *Modules.Class) (*Modules.Class, error)
	Delete(databaseContext context.Context, id int64) (*Modules.Class, error)
}
type ClassRepository struct {
	db *bun.DB
}

func NewClassRepository(db *bun.DB) *ClassRepository {
	return &ClassRepository{db: db}
}

func (r *ClassRepository) List(ctx context.Context) ([]*Modules.Class, error) {

	var classes []*Modules.Class

	err := r.db.NewSelect().Model(&classes).Order("class_id ASC").Scan(ctx)

	return classes, err

}

func (r *ClassRepository) GetByID(ctx context.Context, id int64) (*Modules.Class, error) {

	class := new(Modules.Class)

	err := r.db.NewSelect().
		Model(class).
		Where("class_id = ?", id).
		Limit(1).
		Scan(ctx)
	if err != nil {
		return nil, err
	}

	return class, nil

}

func (repository *ClassRepository) Create(databaseContext context.Context, class *Modules.Class) (*Modules.Class, error) {
	err := repository.db.RunInTx(databaseContext, nil, func(transactionContext context.Context, tx bun.Tx) error {
		_, err := tx.NewInsert().Model(class).Exec(transactionContext)
		return err
	})
	if err != nil {
		return nil, err
	}
	return class, nil
}

func (repository *ClassRepository) Update(databaseContext context.Context, class *Modules.Class) (*Modules.Class, error) {
	err := repository.db.RunInTx(databaseContext, nil, func(transactionContext context.Context, transaction bun.Tx) error {
		response, err := transaction.NewUpdate().
			Model(class).
			Where("class_id = ?", class.ID).
			Column("name", "semester", "updated_at", "code").
			Exec(transactionContext)
		if err != nil {
			return err
		}
		if affectedRows, _ := response.RowsAffected(); affectedRows == 0 {
			return sql.ErrNoRows
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	return class, nil
}

func (repository *ClassRepository) Delete(databaseContext context.Context, id int64) (*Modules.Class, error) {
	var class Modules.Class

	err := repository.db.RunInTx(databaseContext, nil, func(transactionContext context.Context, transaction bun.Tx) error {
		res, err := transaction.NewDelete().
			Model(&class).
			Where("class_id = ?", id).
			Exec(transactionContext)
		if err != nil {
			return err
		}
		if rowsAffected, _ := res.RowsAffected(); rowsAffected == 0 {
			return sql.ErrNoRows
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	return &class, nil
}
