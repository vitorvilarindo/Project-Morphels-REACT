import { sql } from './db.js'

// sql`DROP TABLE IF EXISTS members;`.then(() => {
//   console.log('tabela deletada com sucesso');
// })
// sql`DROP TABLE IF EXISTS expenses;`.then(() => {
//   console.log('tabela deletada com sucesso');
// })
// sql`DROP TABLE IF EXISTS revenues;`.then(() => {
//   console.log('tabela deletada com sucesso');
// })
// sql`DROP TABLE IF EXISTS users;`.then(() => {
//   console.log('tabela deletada com sucesso');
// })

// sql`
// CREATE TABLE IF NOT EXISTS users (
//   id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   name        VARCHAR(200) NOT NULL,
//   email       VARCHAR(100) NOT NULL UNIQUE,
//   password    VARCHAR(50) NOT NULL
//   );
// `.then(() => {
//   console.log('tabela criada com sucesso  ')
// })

// sql`
// CREATE TABLE IF NOT EXISTS revenues (
//   id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   member            VARCHAR(200) NOT NULL,
//   type              VARCHAR(50) NOT NULL,
//   value             NUMERIC(12,2) NOT NULL,
//   payment           VARCHAR(25) NOT NULL,
//   date              TIMESTAMP NOT NULL,
//   user_id           UUID REFERENCES users(id)
//   );
// `.then(() => {
//   console.log('tabela criada com sucesso  ')
// })

// sql`
// CREATE TABLE IF NOT EXISTS expenses (
//   id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   title                 VARCHAR(200) NOT NULL,
//   type                  VARCHAR(50) NOT NULL,
//   value                 NUMERIC(12,2) NOT NULL,
//   payment               VARCHAR(25) NOT NULL,
//   date                  TIMESTAMP NOT NULL,
//   beneficiary           VARCHAR(200) NOT NULL,
//   user_id               UUID REFERENCES users(id)
//   );
// `.then(() => {
//   console.log('tabela criada com sucesso  ')
// })

//sql`
//CREATE TABLE IF NOT EXISTS members (
//  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//  name        VARCHAR(200) NOT NULL,
//  cellphone  VARCHAR(20) NOT NULL,
//  date_birth  DATE NOT NULL,
//  pixkey      VARCHAR(100) NOT NULL,
//  pixtype     VARCHAR(20) NOT NULL,
//  user_id     UUID REFERENCES users(id)
//  );
//`.then(() => {
//  console.log('tabela criada com sucesso  ')
//})

// sql`
// CREATE TABLE IF NOT EXISTS companies (
//   id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   CNPJ        VARCHAR(200) NOT NULL,
//   company_name  VARCHAR(200) NOT NULL,
//   fantasy_name  VARCHAR(200),
//   estate_registration  VARCHAR(100),
//   municipal_registration  VARCHAR(100),
//   open_date      VARCHAR(100) NOT NULL,
//   situation   VARCHAR(50) NOT NULL,
//   cep        VARCHAR(20) NOT NULL,
//   street      VARCHAR(200) NOT NULL,
//   number      VARCHAR(20) NOT NULL,
//   complement  VARCHAR(100),
//   neighborhood VARCHAR(100) NOT NULL,
//   city        VARCHAR(100) NOT NULL,
//   UF       VARCHAR(50) NOT NULL,
//   cellphone     VARCHAR(300) NOT NULL,
//   email       VARCHAR(100) NOT NULL,
//   CNAE        VARCHAR(100),
//   activity_description  VARCHAR(300),
//   pixkey      VARCHAR(100) NOT NULL,
//   pixtype     VARCHAR(20) NOT NULL,
//   user_id     UUID REFERENCES users(id)
//   );
// `.then(() => {
//   console.log('tabela criada com sucesso  ')
// })

// sql`
//     ALTER TABLE users ALTER COLUMN password TYPE VARCHAR(200)
// `.then(() => {console.log('tabela criada com sucesso  ')})
