// tests/helpers.js
import { sql } from '../db.js'

export async function criarDadosDeTeste() {
    // 1. Cria duas instituições (A e B)
    //    — usamos RETURNING id para pegar o id gerado
    const [instA] = await sql`
    INSERT INTO institutions (name, cnpj, email, phone, inscription_date)
    VALUES ('Instituição A', '00.000.000/0001-00', 'umemail@gmail.com', '(61)99999-9999', NOW())
    RETURNING id`

    const [instB] = await sql`
    INSERT INTO institutions (name, cnpj, email, phone, inscription_date)
    VALUES ('Instituição B', '11.111.111/0001-11', 'outroemail@gmail.com', '(61)99999-9999', NOW())
    RETURNING id`

    // 2. Cria um setor para cada instituição
    const [setorA] = await sql`
    INSERT INTO sectors (name, sectorial_cordenator, vice_sectorial_cordenator, institution)
    VALUES ('Setor A', 'Pr. Alguem', 'Pr. Alguem 2', ${instA.id})
    RETURNING id`

    const [setorB] = await sql`
    INSERT INTO sectors (name, sectorial_cordenator, vice_sectorial_cordenator, institution)
    VALUES ('Setor B', 'Pr. Alguem 3', 'Pr. Alguem 4', ${instA.id})
    RETURNING id`

    // 3. Cria uma filial para cada setor
    const [filialA] = await sql`
    INSERT INTO branches (name, owner, sector, institution)
    VALUES ('Filial A', 'Dono A', ${setorA.id}, ${instA.id})
    RETURNING id`

    const [filialB] = await sql`
    INSERT INTO branches (name, owner, sector, institution)
    VALUES ('Filial B', 'Dono B', ${setorB.id}, ${instB.id})
    RETURNING id`

    // 4. Cria as roles
    const [roleAdmin] = await sql`
    INSERT INTO roles (name, description, institution)
    VALUES ('Admin', 'Acesso total', ${instA.id})
    RETURNING id`

    const [roleViewer] = await sql`
    INSERT INTO roles (name, description, institution)
    VALUES ('Viewer', 'Somente leitura', ${instA.id})
    RETURNING id`

    // 5. Cria as páginas e permissões
    //    (se já existirem no banco, busca em vez de inserir)
    let [pagina] = await sql`SELECT id FROM pages WHERE name = 'revenues'`

    if (!pagina) {
        [pagina] = await sql`
        INSERT INTO pages (name) VALUES ('revenues')
        RETURNING id`
    }

    // const [pagina] = await sql`
    // INSERT INTO pages (name) VALUES ('revenues')
    // ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
    // RETURNING id`

    // role admin: tudo true, escopo local
    await sql`
    INSERT INTO permissions (role_id, page_id, can_view, can_add, can_edit, can_delete, access_scope)
    VALUES (${roleAdmin.id}, ${pagina.id}, true, true, true, true, 'local')`

    // role viewer: só can_view, escopo local
    await sql`
    INSERT INTO permissions (role_id, page_id, can_view, can_add, can_edit, can_delete, access_scope)
    VALUES (${roleViewer.id}, ${pagina.id}, true, false, false, false, 'local')`

    // 6. Cria dois usuários na instituição A
    const [userAdmin] = await sql`
    INSERT INTO users (name, email, password, branch, sector, designation)
    VALUES ('Admin A', 'admin@a.com', 'hash_qualquer', ${filialA.id}, ${setorA.id}, ${roleAdmin.id})
    RETURNING id`

    const [userViewer] = await sql`
    INSERT INTO users (name, email, password, branch, sector, designation)
    VALUES ('Viewer A', 'viewer@a.com', 'hash_qualquer', ${filialA.id}, ${setorA.id}, ${roleViewer.id})
    RETURNING id`

    // 7. Cria um usuário na instituição B
    const [userB] = await sql`
    INSERT INTO users (name, email, password, branch, sector, designation)
    VALUES ('User B', 'user@b.com', 'hash_qualquer', ${filialB.id}, ${setorB.id}, ${roleAdmin.id})
    RETURNING id`

    // 8. Cria uma receita em cada filial
    const [receitaA] = await sql`
    INSERT INTO revenues (member, type, value, payment, date, branch)
    VALUES ('Membro A', 'Dízimo', 100.00, 'PIX', NOW(), ${filialA.id})
    RETURNING id`

    const [receitaB] = await sql`
    INSERT INTO revenues (member, type, value, payment, date, branch)
    VALUES ('Membro B', 'Dízimo', 200.00, 'PIX', NOW(), ${filialB.id})
    RETURNING id`

    // retorna tudo que os testes vão precisar
    return {
        instA: instA.id,   instB: instB.id,
        setorA: setorA.id, setorB: setorB.id,
        filialA: filialA.id, filialB: filialB.id,
        roleAdmin: roleAdmin.id, roleViewer: roleViewer.id,
        userAdmin: userAdmin.id, userViewer: userViewer.id,
        userB: userB.id,
        receitaA: receitaA.id, receitaB: receitaB.id,
    }
}

export async function limparDadosDeTeste(ids) {
    // apaga na ordem inversa das FKs (filho antes do pai)
    await sql`DELETE FROM revenues  WHERE id IN (${ids.receitaA}, ${ids.receitaB})`
    await sql`DELETE FROM permissions WHERE role_id IN (${ids.roleAdmin}, ${ids.roleViewer})`
    await sql`DELETE FROM users     WHERE id IN (${ids.userAdmin}, ${ids.userViewer}, ${ids.userB})`
    await sql`DELETE FROM roles     WHERE id IN (${ids.roleAdmin}, ${ids.roleViewer})`
    await sql`DELETE FROM branches  WHERE id IN (${ids.filialA}, ${ids.filialB})`
    await sql`DELETE FROM sectors   WHERE id IN (${ids.setorA},  ${ids.setorB})`
    await sql`DELETE FROM institutions WHERE id IN (${ids.instA}, ${ids.instB})`
}