CREATE TABLE IF NOT EXISTS city (
    id              SERIAL PRIMARY KEY,
    department_code VARCHAR(10)  NOT NULL,
    insee_code      VARCHAR(10),
    zip_code        VARCHAR(10),
    name            VARCHAR(255) NOT NULL,
    lat             FLOAT        NOT NULL,
    lon             FLOAT        NOT NULL
);
