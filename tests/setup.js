import dotenv from "dotenv";
dotenv.config({ path: '.env.test', override: true });
if (process.env.ALLOW_TESTS_ON_THIS_DB !== 'yes') {
    throw new Error('Testes recusados: este banco não está marcado como banco de teste.');
}