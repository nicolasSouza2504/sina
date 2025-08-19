package Repository

import (
	"context"
	"database/sql"
	"fmt"

	"ava-sesisenai/backend/internal/Modules"

	"github.com/uptrace/bun"
)

type IUserRepository interface {
	Create(ctx context.Context, user *Modules.User) (*Modules.User, error)
	GetByEmail(ctx context.Context, email string) (*Modules.User, error)
	GetByID(ctx context.Context, id int64) (*Modules.User, error)
	Update(ctx context.Context, user *Modules.User) (*Modules.User, error)
	Reactivate(ctx context.Context, id int) (*Modules.User, error)
	Delete(ctx context.Context, id int) (*Modules.User, error)
	List(ctx context.Context) ([]*Modules.User, error)
}
type UserRepository struct {
	db *bun.DB
}

func NewUserRepository(db *bun.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (repository *UserRepository) List(databaseContext context.Context) ([]*Modules.User, error) {
	var users []*Modules.User
	err := repository.db.NewSelect().
		Model(&users).
		Relation("Role").
		Relation("Address").
		Scan(databaseContext)
	if err != nil {
		return nil, err
	}
	return users, nil
}

func (repository *UserRepository) GetByEmail(databaseContext context.Context, email string) (*Modules.User, error) {
	user := new(Modules.User)
	err := repository.db.NewSelect().
		Model(user).
		Relation("Role").
		Relation("Address").
		Where("email = ?", email).
		Limit(1).
		Scan(databaseContext)
	if err != nil {
		return nil, fmt.Errorf("no Results Were Found")
	}
	return user, nil
}

func (repository *UserRepository) GetByID(databaseContext context.Context, id int64) (*Modules.User, error) {
	uid := int(id)
	user := &Modules.User{ID: &uid}
	err := repository.db.NewSelect().
		Model(user).
		Relation("Role").
		Relation("Address").
		WherePK().
		Limit(1).
		Scan(databaseContext)
	if err != nil {
		return nil, fmt.Errorf("no Results Were Found")
	}
	return user, nil
}

func (repository *UserRepository) Create(databaseContext context.Context, user *Modules.User) (*Modules.User, error) {
	err := repository.db.RunInTx(databaseContext, nil, func(transactionContext context.Context, tx bun.Tx) error {
		_, err := tx.NewInsert().Model(user).Exec(transactionContext)
		return err
	})
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (repository *UserRepository) Update(databaseContext context.Context, user *Modules.User) (*Modules.User, error) {
	err := repository.db.RunInTx(databaseContext, nil, func(transactionContext context.Context, transaction bun.Tx) error {
		response, err := transaction.NewUpdate().
			Model(user).
			Where("id = ?", user.ID).
			Column("name", "email", "password", "phone", "address_id", "role_id", "updated_at").
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
	return user, nil
}

func (repository *UserRepository) Reactivate(databaseContext context.Context, id int) (*Modules.User, error) {
	var user Modules.User
	err := repository.db.RunInTx(databaseContext, nil, func(transactionContext context.Context, transaction bun.Tx) error {
		res, err := transaction.NewUpdate().
			Model(&user).
			Where("id = ?", id).
			Set("is_active = TRUE").
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
	return &user, nil
}

func (repository *UserRepository) Delete(databaseContext context.Context, id int) (*Modules.User, error) {
	var user Modules.User

	err := repository.db.RunInTx(databaseContext, nil, func(transactionContext context.Context, transaction bun.Tx) error {
		res, err := transaction.NewUpdate().
			Model(&user).
			Where("id = ?", id).
			Set("is_active = FALSE").
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
	return &user, nil
}
