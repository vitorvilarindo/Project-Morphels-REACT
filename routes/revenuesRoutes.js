import { dataBasePostgresRevenues } from "../controller/revenuesController.js";


const database_revenues = new dataBasePostgresRevenues()

export default async function revenuesRoutes (server, opts){
    server.post('/revenues', async (request, reply) => {
        const { member, type, value, payment, date } = request.body
        await database_revenues.create_revenue({
            member,
            type,
            value,
            payment,
            reference_mounth: "NOVEMBER",
            date,
            user_id: "422a0acd-0210-4723-9622-c2b554ee8d60"
        })
        reply.status(201).send()
        console.log("Deu bom")
    })

    server.get('/revenues', async (request, reply) => {
        const search = request.query.search
        const revenues = await database_revenues.list_revenues(search)
        return reply.status(200).send(revenues)
    })

    server.get('/revenues/filter', async (request, reply) => {
        let type = request.query.type
        let start_date = request.query.date1
        let end_date = request.query.date2


        if (type === "All"){
            type = ""
        }

        if(start_date === ""){
            const revenues_date = await database_revenues.list_revenues_date()
            const timestamps = revenues_date.map(d => new Date(d.date).getTime());

            start_date = new Date(Math.min(...timestamps));
        }
        if (end_date === ""){
            const revenues_date = await database_revenues.list_revenues_date()
            const timestamps = revenues_date.map(d => new Date(d.date).getTime());

            end_date = new Date(Math.max(...timestamps))
        }

        const revenues = await database_revenues.filter_revenues(type, start_date, end_date)

        return reply.status(200).send(revenues)
    })


    server.put('/revenues/:id', async (request, reply) => {
        const revenuesID = request.params.id
        const { member, type, value, payment, date} = request.body
        await database_revenues.edit_revenues(revenuesID, {
            member,
            type,
            value,
            payment,
            date,
            user_id: "422a0acd-0210-4723-9622-c2b554ee8d60"

        })
        return reply.status(204).send()
    })
    server.delete('/revenues/:id', async (request, reply) => {
        const revenuesID = request.params.id
        await database_revenues.delete_revenues(revenuesID)
        return reply.status(204).send()
    })
}