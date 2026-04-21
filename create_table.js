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
// CREATE TABLE IF NOT EXISTS resourses (
//   id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   name        VARCHAR(200) NOT NULL
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

// await sql `
// CREATE TABLE permissions (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
//     page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
//     can_view BOOLEAN DEFAULT false,
//     can_add BOOLEAN DEFAULT false,
//     can_edit BOOLEAN DEFAULT false,
//     can_delete BOOLEAN DEFAULT false,
//     UNIQUE(role_id, page_id) -- Garante que não haja duplicatas
// )`;


// // Alterações nas tabelas
// await sql`
//     ALTER TABLE resourses RENAME TO pages
// `
// await sql`ALTER TABLE users
//     ADD CONSTRAINT fk_users_designation
//     FOREIGN KEY (designation) REFERENCES roles(id);
// `;
// await sql`ALTER TABLE companies DROP COLUMN IF EXISTS user_id`;
// await sql`ALTER TABLE expenses DROP COLUMN IF EXISTS user_id`;
// await sql`CREATE type scope_level AS ENUM ('global', 'sector', 'local')`;
//
await sql`
    ALTER TABLE users
    ALTER COLUMN phone_number TYPE VARCHAR(50)

`;
//

// await sql`
//   DROP TABLE IF EXISTS permissions;
// `.then(() => {
//   console.log("tabela deletada")
// })

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

