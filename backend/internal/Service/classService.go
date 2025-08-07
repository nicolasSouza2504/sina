package Service

import (
	"ava-sesisenai/backend/internal/DTO/InBound"
	"ava-sesisenai/backend/internal/Modules"
	"ava-sesisenai/backend/internal/Repository"
	"context"
	"time"
)

type ClassService struct {
	repo Repository.IClassRepository
}

func NewClassService(repo Repository.IClassRepository) *ClassService {
	return &ClassService{repo: repo}
}

func (s *ClassService) List(ctx context.Context) ([]*Modules.Class, error) {
	return s.repo.List(ctx)
}

func (s *ClassService) CreateClass(ctx context.Context, classDTO *InBound.ClassDTO) (*Modules.Class, error) {

	class := &Modules.Class{
		Code:      classDTO.Code,
		Name:      classDTO.Name,
		StartDate: classDTO.StartDate,
		Semester:  classDTO.Semester,
		CreatedAt: time.Now(),
	}

	return s.repo.Create(ctx, class)

}

func (s *ClassService) UpdateClass(ctx context.Context, classDTO *InBound.ClassDTO) (*Modules.Class, error) {

	class := &Modules.Class{
		Code:      classDTO.Code,
		Name:      classDTO.Name,
		StartDate: classDTO.StartDate,
		Semester:  classDTO.Semester,
		UpdatedAt: time.Now(),
		ID:        int64(classDTO.ID),
	}

	return s.repo.Update(ctx, class)

}

func (s *ClassService) DeleteClass(ctx context.Context, id int64) (*Modules.Class, error) {
	return s.repo.Delete(ctx, id)
}
