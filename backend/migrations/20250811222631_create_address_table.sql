-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS address
(
    id           BIGSERIAL PRIMARY KEY,
    postal_code  VARCHAR(9)   NOT NULL,
    street       VARCHAR(255) NOT NULL,
    complement   VARCHAR(255),
    number       INTEGER  NOT NULL,
    neighborhood VARCHAR(150) NOT NULL,
    city         VARCHAR(150) NOT NULL,
    state        VARCHAR(100)   NOT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
    DROP TABLE IF EXISTS address;
-- +goose StatementEnd
