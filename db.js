import "dotenv/config";
import postgres from "postgres";

// Captura a URL de conexão do Docker vinda do arquivo .env
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error("❌ ERRO: A variável DATABASE_URL não foi definida no .env");
}

// Inicializa a conexão com o PostgreSQL do Docker
// Esse 'sql' funciona exatamente igual ao do Neon para chamadas com crases
export const sql = postgres(connectionString, {
    /* Caso precise de configurações extras do Docker, entram aqui */
});