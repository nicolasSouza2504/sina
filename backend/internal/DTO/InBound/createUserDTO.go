package InBound

type CreateUserDTO struct {
	Name            string `json:"name"  binding:"required,min=2,max=80"`
	Email           string `json:"email" binding:"required,email"`
	Phone           string `json:"phone" binding:"required"`
	Password        string `json:"password" binding:"required,min=8"`
	PasswordConfirm string `json:"password_confirm" binding:"required,eqfield=Password"`
	AddressID       int64  `json:"address_id" binding:"required,min=1"`
	RoleID          int64  `json:"role_id" binding:"required,min=1"`
}
