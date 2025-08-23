-- +goose Up
INSERT INTO roles (role_name)
VALUES ('Admin'),
       ('Professor'),
       ('Student') ON CONFLICT (role_name) DO NOTHING;

-- +goose Down
DELETE
FROM roles
WHERE role_name IN ('Admin', 'Professor', 'Student');
