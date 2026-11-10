# TP1 JEE - Application CRUD de facturation (Spring Boot + HTML/CSS + MySQL)

Auteur : Clavstel El Schaddai BOYAOU - M1 GELO

## Prerequis
- Java 17+ et Maven 3.9+
- MySQL 8 demarre en local (port 3306)

## Lancement
1. Verifier `src/main/resources/application.properties` (utilisateur / mot de passe MySQL).
   La base `facturation_db` et les tables sont creees automatiquement.
   (Script equivalent facultatif : `database/facturation.sql`)
2. mvn spring-boot:run
3. Ouvrir http://localhost:8080

## Compte gerant (cree au premier demarrage)
Login : admin   -   Mot de passe : admin123

## Fonctionnalites
Authentification du gerant ; ajout, modification, suppression et recherche des clients et des factures.
