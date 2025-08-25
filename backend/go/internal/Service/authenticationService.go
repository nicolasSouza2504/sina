package Service

import (
	"ava-sesisenai/backend/internal/DTO/InBound"
	"ava-sesisenai/backend/internal/DTO/OutBound"
	"ava-sesisenai/backend/internal/Repository"
	pkg "ava-sesisenai/backend/internal/pkg"
	"context"
	"fmt"
)

type AuthService struct {
	repo Repository.IUserRepository
}

func NewAuthService(repo Repository.IUserRepository) *AuthService {
	return &AuthService{
		repo: repo,
	}
}

func (s *AuthService) Login(ctx context.Context, dto *InBound.UserLoginDTO) (OutBound.AuthenticatedResponse, error) {
	user, err := s.repo.GetByEmail(ctx, dto.Email)
	if err != nil {
		return OutBound.AuthenticatedResponse{}, fmt.Errorf("invalid Credentials")
	}

	if user == nil || !pkg.Compare(user.Password, dto.Password) {
		return OutBound.AuthenticatedResponse{}, fmt.Errorf("invalid Credentials")
	}

	token, err := pkg.EncodeJWT(pkg.BuildPayload(*user, []string{}))
	if err != nil {
		return OutBound.AuthenticatedResponse{}, fmt.Errorf("failed to generate token: %w", err)
	}

	return OutBound.AuthenticatedResponse{
		Token: token,
	}, nil
}
