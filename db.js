import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import pg from "pg";

let sql;

// Verifica se a URL do banco aponta para a sua máquina local (Docker)
if (process.env.DATABASE_URL.includes("localhost") || process.env.DATABASE_URL.includes("127.0.0.1")) {
    // Cria uma conexão com o seu Postgres local
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

    // Essa função imita o comportamento do neon() para que suas rotas continuem funcionando idênticas
    sql = async (strings, ...values) => {
        let queryText = strings[0];
        for (let i = 1; i < strings.length; i++) {
            queryText += `$${i}${strings[i]}`;
        }
        const result = await pool.query(queryText, values);
        return result.rows; // Retorna os resultados no mesmo formato que o neon() retorna
    };
} else {
    // Se não for localhost (ou seja, se for o link do Neon em produção), usa o driver do Neon original
    sql = neon(process.env.DATABASE_URL);
}

export { sql };

