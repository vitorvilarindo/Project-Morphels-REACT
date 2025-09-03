import { sql } from './db.js'

// sql`DROP TABLE IF EXISTS videos;`.then(() => {
//   console.log('tabela deletada com sucesso');
// })

sql`
CREATE TABLE IF NOT EXISTS videos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       VARCHAR(255) NOT NULL,
  descripition TEXT,
  duration    INTEGER NOT NULL
  );
`.then(() => {
  console.log('tabela criada com sucesso  ')
})