const { neon } = require('@neondatabase/serverless');

// O Render injeta a variável DATABASE_URL automaticamente 
// se você configurou o banco no painel deles ou adicionou em Environment Variables.
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ ERRO: A variável de ambiente DATABASE_URL não está definida!");
}

// Inicializa o cliente do Neon
const sql = neon(connectionString);

// Exporta o 'sql' diretamente para ser usado nos seus Services
module.exports = sql;
