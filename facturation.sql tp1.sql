-- =====================================================================
--  facturation.sql  -  TP1 JEE (Spring Boot + HTML/CSS + MySQL)
--  Auteur : Clavstel El Schaddai BOYAOU - M1 GELO
--
--  Modele (selon le sujet) :
--    Gerant (Id, nom, login, password)
--    Client (Idclient, nom, tel)
--    Facture (Idfact, montant, objet, IdClient)
--
--  Note TP2 : le TP2 utilise MongoDB (pas de SQL). Ce script ne concerne que MySQL.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS facturation
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE facturation;

-- Nettoyage (ordre inverse des dependances) pour pouvoir relancer le script
DROP TABLE IF EXISTS facture;
DROP TABLE IF EXISTS client;
DROP TABLE IF EXISTS gerant;

-- ---------------------------------------------------------------------
-- Table 1 : gerant  (Id, nom, login, password)
-- ---------------------------------------------------------------------
CREATE TABLE gerant (
    id       BIGINT       NOT NULL AUTO_INCREMENT,
    nom      VARCHAR(100) NOT NULL,
    login    VARCHAR(50)  NOT NULL,
    password VARCHAR(100) NOT NULL,          -- hash BCrypt, jamais en clair
    PRIMARY KEY (id),
    UNIQUE KEY uk_gerant_login (login)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- Table 2 : client  (Idclient, nom, tel)
-- ---------------------------------------------------------------------
CREATE TABLE client (
    idclient BIGINT       NOT NULL AUTO_INCREMENT,
    nom      VARCHAR(100) NOT NULL,
    tel      VARCHAR(20)  NULL,
    PRIMARY KEY (idclient)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- Table 3 : facture  (Idfact, montant, objet, IdClient)
-- IdClient = cle etrangere vers client ; supprimer un client supprime ses factures
-- ---------------------------------------------------------------------
CREATE TABLE facture (
    idfact   BIGINT       NOT NULL AUTO_INCREMENT,
    montant  DOUBLE       NOT NULL,
    objet    VARCHAR(255) NOT NULL,
    idclient BIGINT       NOT NULL,
    PRIMARY KEY (idfact),
    KEY idx_facture_client (idclient),
    CONSTRAINT fk_facture_client FOREIGN KEY (idclient)
        REFERENCES client (idclient) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
--  Donnees de test
-- =====================================================================

-- Gerant : login = admin / mot de passe = admin123 (hash BCrypt)
INSERT INTO gerant (nom, login, password) VALUES
    ('Administrateur', 'admin', '$2a$10$uLwkxETfZ.Tlp1Q1DEnPbu0JRF8NFmke4YgwfolOcFpdcwQRUNLWW');

INSERT INTO client (nom, tel) VALUES
    ('Moussa Diop',  '771234567'),
    ('Awa Ndiaye',   '781112233'),
    ('Cheikh Fall',  '765554433'),
    ('Fatou Sow',    '770001122');

INSERT INTO facture (montant, objet, idclient) VALUES
    (150000, 'Achat de materiel informatique', 1),
    (45000,  'Maintenance reseau',             1),
    (98500,  'Licence logicielle annuelle',    2),
    (27500,  'Formation utilisateurs',         3),
    (75000,  'Hebergement web annuel',         4);

-- =====================================================================
--  Requetes de verification
-- =====================================================================
SELECT * FROM gerant;
SELECT * FROM client;
SELECT f.idfact, c.nom AS client, f.objet, f.montant
FROM facture f JOIN client c ON c.idclient = f.idclient
ORDER BY f.idfact;
