export class RevenuesController {
    constructor(authService, filterService, validationService, revenuesRepository) {
        this._authService = authService;
        this._filterService = filterService;
        this._validationService = validationService;
        this._revenuesRepository = revenuesRepository;
    }

    create = async (request, reply) => {
        try{
            const createdRevenue = await this._revenuesRepository.create(request.body);
            if (!createdRevenue) {
                return reply.status(300).send({message: 'Revenue can not be crated'});
            }

            return reply.status(200).send({message: 'Revenue created successfully'});
        }catch(err){
            console.error(err);
            return reply.status(400).send({message: 'Revenue creation failed'});

        }

    }
    list = async (request, reply) => {
        try{
            const revenues = await this._authService._validationService(request.access_scope, request.userID, request.query.search)

            if (!revenues) {
                return reply.status(200).send({message: 'Revenue does not exist'});
            }
            return reply.status(200).send(revenues)
        }catch(err){
            console.error(err);
            return reply.status(500).send({message: 'There is no revenues'});
        }

    }
    filter = async (request, reply) => {
        try {
            const {type, start_date, end_date} = request.body;

            const revenues = await this._filterService.filter(request.accessScope, request.userID, request.query.search, type, start_date, end_date);

            return reply.status(200).send(revenues)
        }catch(err){
            console.error(err);
            return reply.status(500).send({message: 'There is no revenue'});
        }
    }
    update = async (request, reply) => {
        try{
            const updateRevenue = await this._revenuesRepository.update(request.body);
            if (!updateRevenue) {
                return reply.status(400).send({message: 'Revenue does not exist'});
            }
            return reply.status(200).send({message: 'Revenue updated successfully'});
        }catch(err){
            console.error(err);
            return reply.status(500).send({message: 'There is no revenues'});
        }
    }
    delete = async (request, reply) => {
        try {
            const deleteRevenue = await this._revenuesRepository.delete(request.params.id, request.userID);
            if (!deleteRevenue) {
                return reply.status(400).send({message: 'Revenue does not exist'});
            }
            return reply.status(200).send({message: 'Revenue deleted successfully'});
        }catch(err){
            console.error(err);
            return reply.status(500).send({message: 'There is no revenues'});
        }
    }

}

// Criar receita
export async function createRevenue(request, reply) {
    try {
        const { member, type, value, payment, date, church } = request.body
        const churchID = await sql`SELECT id FROM churchs WHERE name = ${church}`
        console.log(church)
        const newRevenue = await sql`
      INSERT INTO revenues (member, type, value, payment, date, church)
      VALUES (${member}, ${type}, ${value}, ${payment}, ${date}, ${churchID[0].id})
      RETURNING *
    `
        return reply.status(201).send(newRevenue[0])
    } catch (error) {
        console.error("Erro ao criar receita:", error)
        return reply.status(500).send({ error: "Erro ao criar receita" })
    }
}

// Listar receitas (com busca opcional)
export async function listRevenues(request, reply) {
    try {
        console.log("Trigre triste")

        // const revenues = await new Listing(request.userID, "revenues", request.query.search, request.access_scope).OnGetAndList()
        //
        // return reply.status(200).send(revenues)
    } catch (error) {
        console.error("Erro ao listar receitas:", error)
        return reply.status(500).send({ error: "Erro ao listar receitas" })
    }
}

// Filtrar receitas por tipo e intervalo de datas
export async function filterRevenues(request, reply) {
    try {
        console.log("Pinguin molhado")

        // const {type, start_date, end_date} = request.body
        // const revenues = await new Filter(request.userID, "revenues", "", request.access_scope, type, start_date, end_date).OnFilterItems()
        //
        // return reply.status(200).send(revenues)
    } catch (error) {
        console.error("Erro ao filtrar receitas:", error)
        return reply.status(500).send({ error: "Erro ao filtrar receitas" })
    }
}

// Editar receita
export async function editRevenue(request, reply) {
    try {
        const { id } = request.params
        const { member, type, value, payment, date } = request.body

        const updated = await sql`
            UPDATE revenues
            SET member = ${member}, type = ${type}, value = ${value}, payment = ${payment}, date = ${date}
            WHERE id = ${id}
            RETURNING *
        `
        if (updated.length === 0) {
            return reply.status(404).send({ error: "Receita não encontrada" })
        }
        return reply.status(204).send()
    } catch (error) {
        console.error("Erro ao editar receita:", error)
        return reply.status(500).send({ error: "Erro ao editar receita" })
    }
}

// Deletar receita
export async function deleteRevenue(request, reply) {
    try {

        const deleted = await new Delete(request.params.id, request.userID, "revenues", request.access_scope).OnDeleteItem()

        if (deleted.length === 0) {
            return reply.status(404).send({ error: "Receita não encontrada" })
        }
        return reply.status(204).send()
    } catch (error) {
        console.error("Erro ao remover receita:", error)
        return reply.status(500).send({ error: "Erro ao remover receita" })
    }
}
