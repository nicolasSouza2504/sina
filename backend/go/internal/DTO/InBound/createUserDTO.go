package InBound

type CreateUserDTO struct {
	Name            string     `json:"name"              binding:"required,min=2,max=80"`
	Email           string     `json:"email"             binding:"required,email"`
	Phone           string     `json:"phone"             binding:"required"`
	Password        string     `json:"password"          binding:"required,min=8"`
	PasswordConfirm string     `json:"password_confirm"  binding:"required,eqfield=Password"`
	Address         AddressDTO `json:"address"           binding:"required"`
	RoleID          int64      `json:"role_id"           binding:"required,gt=0"`
}

type AddressDTO struct {
	PostalCode string  `json:"postal_code" binding:"required,len=8,numeric"`
	Complement *string `json:"complement"  binding:"omitempty,max=120"`
	Number     *string `json:"number"      binding:"omitempty,max=10"`
}
