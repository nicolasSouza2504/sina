package OutBound

type AuthenticatedResponse struct {
	Token string `json:"token" binding:"required"`
}
