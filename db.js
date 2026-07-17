import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import pg from "pg";

const isLocal = process.env.DATABASE_URL.includes("localhost") || process.env.DATABASE_URL.includes("127.0.0.1");

// Inicializa os bancos correspondentes ao ambiente
const pool = isLocal ? new pg.Pool({ connectionString: process.env.DATABASE_URL }) : null;
const neonClient = isLocal ? null : neon(process.env.DATABASE_URL);

// Função central que executa a query final no banco correto
async function executeQuery(text, values) {
    if (isLocal) {
        const result = await pool.query(text, values);
        return result.rows;
    } else {
        return await neonClient(text, values);
    }
}

// Função recursiva mágica que junta e monta as queries aninhadas/condicionais
function buildQuery(strings, values, flatValues = []) {
    let text = "";
    for (let i = 0; i < strings.length; i++) {
        text += strings[i];
        if (i < values.length) {
            const val = values[i];

            // Se o valor for OUTRA query do sql``, ele desestrutura e junta as duas
            if (val && val.__isSqlQuery) {
                text += buildQuery(val.strings, val.values, flatValues);
            } else {
                // Se for um dado comum (id, search, etc), adiciona na lista de parâmetros ($1, $2...)
                flatValues.push(val);
                text += `$${flatValues.length}`;
            }
        }
    }
    return text;
}

// O export principal do seu app
export function sql(strings, ...values) {
    // Se foi usado como Template Literal: sql`SELECT...`
    if (Array.isArray(strings)) {
        return {
            __isSqlQuery: true,
            strings,
            values,
            // O "then" permite que o comando seja "awaitado" normalmente pelo Fastify
            then(resolve, reject) {
                const flatValues = [];
                const text = buildQuery(strings, values, flatValues);
                executeQuery(text, flatValues).then(resolve, reject);
            }
        };
    }
rosan
    // Se foi usado como função normal: sql("SELECT...", [params])
    return {
        then(resolve, reject) {
            executeQuery(strings, values[0] || []).then(resolve, reject);
        }
    };
}