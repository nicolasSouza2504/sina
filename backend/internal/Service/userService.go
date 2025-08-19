package Service

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"ava-sesisenai/backend/internal/DTO/InBound"
	"ava-sesisenai/backend/internal/Modules"
	"ava-sesisenai/backend/internal/Repository"
	pkg "ava-sesisenai/backend/internal/pkg"
)

type UserService struct {
	repo           Repository.IUserRepository
	addressRepo    Repository.IAddressRepository
	roleRepository Repository.IRolesRepository
}

func NewUserService(
	repo Repository.IUserRepository,
	addressRepo Repository.IAddressRepository,
	roleRepo Repository.IRolesRepository,
) *UserService {
	return &UserService{
		repo:           repo,
		addressRepo:    addressRepo,
		roleRepository: roleRepo,
	}
}

func (s *UserService) CreateUser(ctx context.Context, dto *InBound.CreateUserDTO) (*Modules.User, error) {
	pwHash, err := pkg.Hash(dto.Password)
	if err != nil {
		return nil, err
	}

	if err := s.validateUserEmailUsage(ctx, dto.Email); err != nil {
		return nil, err
	}

	via, err := pkg.FetchViaCep(dto.Address.PostalCode)
	if err != nil {
		return nil, err
	}

	var complement, number string
	if dto.Address.Complement != nil {
		complement = *dto.Address.Complement
	}
	if dto.Address.Number != nil {
		number = *dto.Address.Number
	}

	addr := &Modules.Address{
		PostalCode:   dto.Address.PostalCode,
		Street:       via.Street,
		Complement:   complement,
		Number:       number,
		Neighborhood: via.Neighborhood,
		City:         via.City,
		State:        via.State,
	}

	role, err := s.validateRoleID(ctx, dto.RoleID)
	if err != nil {
		return nil, fmt.Errorf("invalid role ID: %w", err)
	}
	if role == nil {
		return nil, fmt.Errorf("role not found")
	}

	addrID, err := s.addressRepo.Create(ctx, addr)
	if err != nil {
		return nil, err
	}
	addr.Id = &addrID

	u := &Modules.User{
		Name:      dto.Name,
		Email:     dto.Email,
		Password:  pwHash,
		Phone:     dto.Phone,
		RoleID:    role.ID,
		AddressID: addrID,
		IsActive:  true,

		Role:    role,
		Address: addr,
	}

	created, err := s.repo.Create(ctx, u)
	if err != nil {
		return nil, err
	}

	return created, nil
}

func (s *UserService) validateUserEmailUsage(ctx context.Context, email string) error {
	if email == "" {
		return nil
	}
	user, err := s.repo.GetByEmail(ctx, email)
	if err != nil {
		return nil
	}
	if user == nil {
		return nil
	}
	return fmt.Errorf("email %s is already in use", email)
}

func (s *UserService) validateRoleID(ctx context.Context, roleID int64) (*Modules.Role, error) {
	if roleID <= 0 {
		return nil, fmt.Errorf("role must be greater than 0")
	}
	return s.roleRepository.GetByID(ctx, roleID)
}

func (s *UserService) List(ctx context.Context) ([]*Modules.User, error) {
	return s.repo.List(ctx)
}

func (s *UserService) GetById(ctx context.Context, id int64) (*Modules.User, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *UserService) Update(ctx context.Context, dto *InBound.UpdateUserDTO, id int64) (*Modules.User, error) {
	user, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if dto.Name != nil {
		user.Name = *dto.Name
	}
	if dto.Email != nil && *dto.Email != user.Email {
		existing, err := s.repo.GetByEmail(ctx, *dto.Email)
		if err != nil && !errors.Is(err, sql.ErrNoRows) {
			return nil, err
		}
		if existing != nil && existing.ID != nil && user.ID != nil && *existing.ID != *user.ID {
			return nil, fmt.Errorf("email %s is already in use", *dto.Email)
		}
		user.Email = *dto.Email
	}
	if dto.Phone != nil {
		user.Phone = *dto.Phone
	}
	if dto.Password != nil {
		hash, err := pkg.Hash(*dto.Password)
		if err != nil {
			return nil, err
		}
		user.Password = hash
	}
	if dto.RoleID != nil && *dto.RoleID != user.RoleID {
		role, err := s.roleRepository.GetByID(ctx, *dto.RoleID)
		if err != nil {
			return nil, err
		}
		if role == nil {
			return nil, fmt.Errorf("role not found")
		}
		user.RoleID = role.ID
		user.Role = role
	}

	updated, err := s.repo.Update(ctx, user)
	if err != nil {
		return nil, err
	}

	return updated, nil
}

func (s *UserService) Delete(ctx context.Context, id int64) error {
	user, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return err
	}
	if user == nil {
		return fmt.Errorf("user with ID %d not found", id)
	}

	if user.IsActive {
		user.IsActive = false
		_, err = s.repo.Delete(ctx, *user.ID)
		if err != nil {
			return err
		}
	} else {
		return fmt.Errorf("user with ID %d is already inactive", id)
	}

	return nil
}

func (s *UserService) Reactivate(ctx context.Context, id int64) error {
	user, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return err
	}
	if user == nil {
		return fmt.Errorf("user with ID %d not found", id)
	}
	if user.IsActive {
		return fmt.Errorf("user with ID %d is already active", id)
	}

	user.IsActive = true

	user, err = s.repo.Reactivate(ctx, *user.ID)
	if err != nil {
		return err
	}
	return nil
}
