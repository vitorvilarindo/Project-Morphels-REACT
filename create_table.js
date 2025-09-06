import { sql } from './db.js'

// sql`DROP TABLE IF EXISTS videos;`.then(() => {
//   console.log('tabela deletada com sucesso');
// })

sql`
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(200) NOT NULL,
  email        VARCHAR(100) NOT NULL UNIQUE,
  password   INTEGER NOT NULL
  );
`.then(() => {
  console.log('tabela criada com sucesso  ')
})

sql`
CREATE TABLE IF NOT EXISTS revenues (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member            VARCHAR(200) NOT NULL,
  type              VARCHAR(50) NOT NULL,
  payment           VARCHAR(50) NOT NULL,
  reference_mounth  VARCHAR(7) NOT NULL,
  date              TIMESTAMP NOT NULL,
  user_id           UUID REFERENCES users(id)
  );
`.then(() => {
  console.log('tabela criada com sucesso  ')
})

sql`
CREATE TABLE IF NOT EXISTS expenses (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title                 VARCHAR(200) NOT NULL,
  category              VARCHAR(50) NOT NULL,
  payment               VARCHAR(50) NOT NULL,
  reference_mounth      VARCHAR(7) NOT NULL,
  date                  TIMESTAMP NOT NULL,
  beneficiary           VARCHAR(200) NOT NULL,
  user_id               UUID REFERENCES users(id)
  );
`.then(() => {
  console.log('tabela criada com sucesso  ')
})

sql`
CREATE TABLE IF NOT EXISTS members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(200) NOT NULL,
  user_id     UUID REFERENCES users(id)
  );
`.then(() => {
  console.log('tabela criada com sucesso  ')
})
