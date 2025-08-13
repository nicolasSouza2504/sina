package Service

import (
	"context"

	"ava-sesisenai/backend/internal/DTO/InBound"
	"ava-sesisenai/backend/internal/Modules"
	"ava-sesisenai/backend/internal/Repository"
	pwd "ava-sesisenai/backend/internal/pkg"
)

type UserService struct {
	repo Repository.IUserRepository
}

func NewUserService(repo Repository.IUserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) CreateUser(ctx context.Context, dto *InBound.CreateUserDTO) (*Modules.User, error) {
	pwHash, err := pwd.Hash(dto.Password)
	if err != nil {
		return nil, err
	}

	u := &Modules.User{
		Name:      dto.Name,
		Email:     dto.Email,
		Password:  pwHash,
		Phone:     dto.Phone,
		RoleID:    dto.RoleID,
		AddressID: dto.AddressID,
		ISActive:  true,
	}

	return s.repo.Create(ctx, u)
}
func (s *UserService) List(ctx context.Context) ([]*Modules.User, error) {
	return s.repo.List(ctx)

}
