# TP2 JEE - Application de facturation (Spring Boot + React + MongoDB)

Auteur : Clavstel El Schaddai BOYAOU - M1 GELO

## Prerequis
- Java 17+ et Maven 3.9+
- Node.js 18+ et npm
- MongoDB 6/7 en local (port 27017)

## Lancement
1. Demarrer MongoDB (`mongod` ou service MongoDB).
2. Backend :  cd backend && mvn spring-boot:run      -> http://localhost:8080
3. Frontend : cd frontend && npm install && npm run dev -> http://localhost:5173

## Comptes de demonstration (crees au premier demarrage)
| Role   | Login  | Mot de passe |
|--------|--------|--------------|
| Gerant | admin  | admin123     |
| Client | moussa | client123    |
| Client | awa    | client123    |
| Client | cheikh | client123    |

## API REST
POST /api/auth/login | GET/POST /api/clients | GET/PUT/DELETE /api/clients/{id}
GET/POST /api/factures | GET/PUT/DELETE /api/factures/{id} | GET /api/factures/mes-factures
