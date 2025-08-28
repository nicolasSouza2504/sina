
export interface  AuthLoginResponse{
    message: string,
    data: loginData,
}

export interface loginData{
    id: number,
    token: string,
}

export interface loginError {
    message: string,
    data: any
}