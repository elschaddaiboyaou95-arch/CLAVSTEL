-- Script MySQL (facultatif : Hibernate cree deja ces tables avec ddl-auto=update)
CREATE DATABASE IF NOT EXISTS facturation_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE facturation_db;

CREATE TABLE IF NOT EXISTS gerant (
    id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom      VARCHAR(100) NOT NULL,
    login    VARCHAR(50)  NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL            -- hash BCrypt
);

CREATE TABLE IF NOT EXISTS client (
    idclient BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom      VARCHAR(100) NOT NULL,
    tel      VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS facture (
    idfact   BIGINT AUTO_INCREMENT PRIMARY KEY,
    montant  DOUBLE       NOT NULL,
    objet    VARCHAR(255) NOT NULL,
    idclient BIGINT       NOT NULL,
    CONSTRAINT fk_facture_client FOREIGN KEY (idclient)
        REFERENCES client (idclient) ON DELETE CASCADE
);
