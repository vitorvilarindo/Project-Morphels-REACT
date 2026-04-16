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

// Create table "churchs"
// await sql`
//     CREATE TABLE IF NOT EXISTS sectors (
//         id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//         sector VARCHAR(50) NOT NULL,
//         sectorial_cordenator VARCHAR(100) NOT NULL,
//         vice_sectorial_cordenator VARCHAR(100) NOT NULL
//     )
// `;
//
// await sql`
//     CREATE TABLE IF NOT EXISTS roles (
//         id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//         name            VARCHAR(200) NOT NULL,
//         description     VARCHAR(200) NOT NULL
//     )
// `;
//
// await sql`
//     CREATE TABLE IF NOT EXISTS permissions (
//         id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//         name            VARCHAR(200) NOT NULL,
//         description     VARCHAR(200) NOT NULL
//     )
// `;

// await sql`
//     CREATE TABLE IF NOT EXISTS cards (
//         id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//         code       VARCHAR(200) NOT NULL,
//         member     UUID REFERENCES members(id),
//         issue_date TIMESTAMP    NOT NULL,
//         due_date   DATE         NOT NULL,
//         status     DATE         NOT NULL
//         )
// `


// // Alterações nas tabelas
// await sql`
//     ALTER TABLE users
//     ALTER COLUMN designation TYPE UUID USING designation::uuid;
//
// `
// await sql`ALTER TABLE users
//     ADD CONSTRAINT fk_users_designation
//     FOREIGN KEY (designation) REFERENCES roles(id);
// `;
// await sql`ALTER TABLE companies DROP COLUMN IF EXISTS user_id`;
// await sql`ALTER TABLE expenses DROP COLUMN IF EXISTS user_id`;
// await sql`ALTER TABLE revenues DROP COLUMN IF EXISTS user_id`;

// await sql`
//     ALTER TABLE reports
//         DROP COLUMN IF EXISTS revenues,
//         DROP COLUMN IF EXISTS expenses
//
// `;
//
// await sql`
//     ALTER TABLE users
//         ADD COLUMN phone_number TIMESTAMP;
// `;

// await sql`
//     ALTER TABLE members
//         DROP COLUMN IF EXISTS sector,
//         DROP COLUMN IF EXISTS church_id
// `;
//
// await sql`
//     ALTER TABLE churchs
//         DROP COLUMN IF EXISTS members_number
// `;

