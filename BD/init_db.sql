-- BD/init_db.sql

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS vacantes;
DROP TABLE IF EXISTS hojas_vida;
DROP TABLE IF EXISTS candidatos;

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    user_type TEXT NOT NULL,
    representante_legal TEXT,
    direccion TEXT NOT NULL,
    telefono TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS vacantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    company_id INTEGER NOT NULL,
    estado TEXT NOT NULL,
    FOREIGN KEY (company_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS hojas_vida (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    id_number TEXT NOT NULL,
    address TEXT NOT NULL,
    email TEXT NOT NULL,
    profession TEXT NOT NULL,
    cv_file TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
);


CREATE TABLE IF NOT EXISTS candidatos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    profession TEXT NOT NULL,
    cv_file TEXT NOT NULL
);
