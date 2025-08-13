-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS users
(
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(50)  NOT NULL,
    email      VARCHAR(150) NOT NULL UNIQUE,
    phone      VARCHAR(15)  NOT NULL,
    address_id BIGINT       NOT NULL,
    password   VARCHAR(255) NOT NULL,
    role_id    BIGINT       NOT NULL,
    is_active  BOOLEAN   DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_role FOREIGN KEY (role_id)
        REFERENCES roles (role_id)
        ON DELETE NO ACTION
        ON UPDATE CASCADE,
    CONSTRAINT fk_address FOREIGN KEY (address_id)
        REFERENCES address (id)
        ON DELETE NO ACTION
        ON UPDATE CASCADE
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP TABLE IF EXISTS users;
-- +goose StatementEnd
