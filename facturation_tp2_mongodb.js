// =====================================================================
//  facturation_tp2_mongodb.js  -  TP2 JEE (Spring Boot + React + MongoDB)
//  Auteur : Clavstel El Schaddai BOYAOU - M1 GELO
//
//  MongoDB n'utilise pas de SQL : ce script est l'equivalent du fichier .sql du TP1.
//  Il cree la base, les collections, les index et des donnees de test.
//
//  Execution :   mongosh facturation_tp2_mongodb.js
//  (ou dans mongosh :  load("facturation_tp2_mongodb.js"))
//
//  Modele (TP2) :
//    gerants  : _id, nom, login, password
//    clients  : _id, nom, tel, login, password     (login/password : acces client)
//    factures : _id, montant, objet, idClient, date (idClient = _id du client, en texte)
// =====================================================================

// --- Base de donnees (equivalent de CREATE DATABASE + USE) ---
db = db.getSiblingDB("facturation_db");

// --- Nettoyage pour pouvoir relancer le script ---
db.factures.drop();
db.clients.drop();
db.gerants.drop();

// --- Collections (equivalent de CREATE TABLE), avec validation des champs ---
db.createCollection("gerants", {
  validator: { $jsonSchema: {
    bsonType: "object",
    required: ["nom", "login", "password"],
    properties: {
      nom: { bsonType: "string" },
      login: { bsonType: "string" },
      password: { bsonType: "string" }
    }
  } }
});

db.createCollection("clients", {
  validator: { $jsonSchema: {
    bsonType: "object",
    required: ["nom", "login", "password"],
    properties: {
      nom: { bsonType: "string" },
      tel: { bsonType: ["string", "null"] },
      login: { bsonType: "string" },
      password: { bsonType: "string" }
    }
  } }
});

db.createCollection("factures", {
  validator: { $jsonSchema: {
    bsonType: "object",
    required: ["montant", "objet", "idClient"],
    properties: {
      montant: { bsonType: "number", minimum: 0 },
      objet: { bsonType: "string" },
      idClient: { bsonType: "string" },
      date: { bsonType: ["date", "null"] }
    }
  } }
});

// --- Index (login unique ; recherche rapide des factures d'un client) ---
db.gerants.createIndex({ login: 1 }, { unique: true });
db.clients.createIndex({ login: 1 }, { unique: true });
db.factures.createIndex({ idClient: 1 });

// =====================================================================
//  Donnees de test
// =====================================================================
const joursAvant = (n) => new Date(new Date().setUTCHours(0, 0, 0, 0) - n * 86400000);

// Gerant : login = admin / mot de passe = admin123 (hash BCrypt)
db.gerants.insertOne({
  nom: "Administrateur",
  login: "admin",
  password: "$2a$10$zxG2oKDU4en8qRaDsQb2PesWf1LPj7GYaqP8NKQ./769su12cPEdG"
});

// Clients : mot de passe de chacun = client123 (hash BCrypt)
const HASH_CLIENT = "$2a$10$CxzTPGTOTst.WhqkuJluHu7ieLM6qPJgnQPhmgzkTemJtoj.sique";
const moussa = db.clients.insertOne({ nom: "Moussa Diop", tel: "771234567", login: "moussa", password: HASH_CLIENT });
const awa    = db.clients.insertOne({ nom: "Awa Ndiaye",  tel: "781112233", login: "awa",    password: HASH_CLIENT });
const cheikh = db.clients.insertOne({ nom: "Cheikh Fall", tel: "765554433", login: "cheikh", password: HASH_CLIENT });

// Factures : idClient = _id du client converti en texte
db.factures.insertMany([
  { montant: 150000, objet: "Achat de materiel informatique", idClient: moussa.insertedId.toHexString(), date: joursAvant(12) },
  { montant: 45000,  objet: "Maintenance reseau",             idClient: moussa.insertedId.toHexString(), date: joursAvant(5)  },
  { montant: 98500,  objet: "Licence logicielle annuelle",    idClient: awa.insertedId.toHexString(),    date: joursAvant(8)  },
  { montant: 27500,  objet: "Formation utilisateurs",         idClient: cheikh.insertedId.toHexString(), date: joursAvant(2)  }
]);

// =====================================================================
//  Verification
// =====================================================================
print("Gerants :", db.gerants.countDocuments());
print("Clients :", db.clients.countDocuments());
print("Factures:", db.factures.countDocuments());

// Equivalent d'une jointure SQL : factures avec le nom du client
db.factures.aggregate([
  { $addFields: { clientOid: { $toObjectId: "$idClient" } } },
  { $lookup: { from: "clients", localField: "clientOid", foreignField: "_id", as: "client" } },
  { $unwind: "$client" },
  { $project: { _id: 0, client: "$client.nom", objet: 1, montant: 1, date: 1 } }
]).forEach(printjson);
