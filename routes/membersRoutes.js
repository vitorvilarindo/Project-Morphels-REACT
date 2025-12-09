import {dataBasePostgresMembers} from "../controllers/membersController.js";

const database_members = new dataBasePostgresMembers()

export default async function membersRoutes(server, opts){
    server.post('/members', async (request, reply) => {
        const { name, cellphone, date_birth, pixkey, pixtype } = request.body
        await database_members.create_members({
            name,
            cellphone,
            date_birth,
            pixkey,
            pixtype,
            user_id: "422a0acd-0210-4723-9622-c2b554ee8d60"
        })
        reply.status(201).send()
        console.log("Deu bom")
    })

    server.get('/members', async (request, reply) => {
        const search = request.query.search
        const members = await database_members.list_members(search)
        return reply.status(200).send(members)
    })

    server.put('/members/:id', async (request, reply) => {
        const memberID = request.params.id
        const { name, user_id } = request.body
        await database_members.edit_members(memberID, {
            name,
            user_id
        })
        return reply.status(204).send()
    })

    server.delete('/members/:id', async (request, reply) => {
        const memberID = request.params.id
        await database_members.delete_members(memberID)
        return reply.status(204).send()
    })

    server.listen(
        { port: 3000}
    )

}