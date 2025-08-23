package InBound

type UpdateUserDTO struct {
	Name     *string `json:"name"  binding:"omitempty,min=2,max=80"`
	Email    *string `json:"email" binding:"omitempty,email"`
	Phone    *string `json:"phone" binding:"omitempty"`
	Password *string `json:"password" binding:"omitempty,min=8"`
	RoleID   *int64  `json:"role_id" binding:"omitempty,min=1"`
}
