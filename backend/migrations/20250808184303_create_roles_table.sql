-- +goose Up
CREATE TABLE IF NOT EXISTS roles (
    role_id   BIGSERIAL PRIMARY KEY,
    role_name VARCHAR(30) NOT NULL UNIQUE
);

-- +goose Down
DROP TABLE IF EXISTS roles;
