package pkg

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type ViaCepResponse struct {
	PostalCode   string `json:"cep" `
	Street       string `json:"logradouro" `
	Neighborhood string `json:"bairro" `
	City         string `json:"localidade" `
	State        string `json:"estado" `
}

func FetchViaCep(postalCode string) (*ViaCepResponse, error) {
	url := fmt.Sprintf("https://viacep.com.br/ws/%s/json/", postalCode)
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {

		}
	}(resp.Body)

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("ViaCep request failed: %s", resp.Status)
	}

	var result ViaCepResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return &result, nil
}
