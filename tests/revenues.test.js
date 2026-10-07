// tests/revenues.test.js
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { buildApp } from '../app.js'
import { criarDadosDeTeste, limparDadosDeTeste } from './helpers.js'

let app
let ids      // ids criados pelo helper
let tokenAdmin, tokenViewer, tokenB

beforeAll(async () => {
    app = await buildApp()
    ids = await criarDadosDeTeste()

    // gera os tokens JWT para cada usuário
    // (sem bater no endpoint de login, direto pelo Fastify)
    tokenAdmin  = app.jwt.sign({ sub: ids.userAdmin,  branch: ids.filialA })
    tokenViewer = app.jwt.sign({ sub: ids.userViewer, branch: ids.filialA })
    tokenB      = app.jwt.sign({ sub: ids.userB,      branch: ids.filialB })
})

afterAll(async () => {
    await limparDadosDeTeste(ids)
    await app.close()
})

// ── testes ────────────────────────────────────────────────────────────────

describe('Viewer não pode escrever', () => {
    it('viewer não cria receita (deve retornar 403)', async () => {
        const res = await app.inject({
            method: 'POST',
            url: '/revenues',
            cookies: { token: tokenViewer },
            payload: {
                member: 'Teste', type: 'Dízimo',
                value: 50, payment: 'PIX',
                date: new Date(), branch: ids.filialA
            }
        })
        expect(res.statusCode).toBe(403)
    })

    it('viewer não edita receita (deve retornar 403)', async () => {
        const res = await app.inject({
            method: 'PUT',
            url: `/revenues/${ids.receitaA}`,
            cookies: { token: tokenViewer },
            payload: { member: 'Teste', type: 'Dízimo',
                value: 999, payment: 'PIX',
                date: new Date(), branch: ids.filialA }
        })
        expect(res.statusCode).toBe(403)
    })

    it('viewer não apaga receita (deve retornar 403)', async () => {
        const res = await app.inject({
            method: 'DELETE',
            url: `/revenues/${ids.receitaA}`,
            cookies: { token: tokenViewer },
        })
        expect(res.statusCode).toBe(403)
    })
})

describe('Isolamento entre instituições', () => {
    it('usuário da instituição B não edita receita da A (deve retornar 404)', async () => {
        const res = await app.inject({
            method: 'PUT',
            url: `/revenues/${ids.receitaA}`,  // receita da instituição A
            cookies: { token: tokenB },         // token do usuário B
            payload: { member: 'Teste', type: 'Dízimo',
                value: 999, payment: 'PIX',
                date: new Date(), branch: ids.filialA }
        })
        // 404 porque o scopeFilter filtra e não encontra o registro
        expect(res.statusCode).toBe(404)
    })

    it('usuário da instituição B não apaga receita da A (deve retornar 404)', async () => {
        const res = await app.inject({
            method: 'DELETE',
            url: `/revenues/${ids.receitaA}`,
            cookies: { token: tokenB },
        })
        expect(res.statusCode).toBe(404)
    })
})

describe('Admin pode ler', () => {
    it('admin lista as receitas da sua filial (deve retornar 200)', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/revenues',
            cookies: { token: tokenAdmin },
        })
        expect(res.statusCode).toBe(200)

        const body = JSON.parse(res.body)
        // deve ver a receita A, mas não a B
        const ids_retornados = body.map(r => r.id)
        expect(ids_retornados).toContain(ids.receitaA)
        expect(ids_retornados).not.toContain(ids.receitaB)
    })
})