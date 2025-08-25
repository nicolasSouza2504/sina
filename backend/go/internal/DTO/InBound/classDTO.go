package InBound

import "time"

type ClassDTO struct {
	Code      string    `json:"code"       binding:"required,min=1,max=80"`
	Name      string    `json:"name"       binding:"required,min=2,max=80"`
	StartDate time.Time `json:"start_date" binding:"required" time_format:"2006-01-02"`
	Semester  string    `json:"semester"   binding:"required,min=1,max=10"`
	ID int
}
