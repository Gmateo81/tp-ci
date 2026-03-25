CREATE DATABASE IF NOT EXISTS city_api;
USE city_api;

CREATE TABLE IF NOT EXISTS city (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    department_code VARCHAR(10) NOT NULL,
    insee_code VARCHAR(10),
    zip_code VARCHAR(10),
    name VARCHAR(255) NOT NULL,
    lat FLOAT NOT NULL,
    lon FLOAT NOT NULL,
    PRIMARY KEY (id)
);
