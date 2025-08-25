-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS class
(
    class_id   BIGSERIAL PRIMARY KEY,
    code       VARCHAR(50)   NOT NULL,
    name       VARCHAR(150)  NOT NULL,
    start_date DATE          NOT NULL,
    semester   VARCHAR(20)   NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS class;
-- +goose StatementEnd