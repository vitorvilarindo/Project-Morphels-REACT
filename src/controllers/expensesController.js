export class ExpensesController {
    constructor(scopeValidationService, filterService, expensesRepository) {
        this._scopeValidationService = scopeValidationService;
        this._filterService = filterService;
        this._expensesRepository = expensesRepository;
    }
    create = async (request, reply) => {
        try {
            const createdExpense = await this._expensesRepository.createExpenses(request.body);

            if (!createdExpense){
                return reply.status(300).send({message: 'There can not create any expense'});
            }
            return reply.status(201).send({message: 'Successfully created expense'});
        }catch(err){
            return reply.status(400).send({message: 'Something went wrong'});

        }
    }
    list = async (request, reply) => {
        try{
            const expenses = await this._scopeValidationService.validateAccessScope(request.access_scope, request.userID, request.query.search)
            if (!expenses){
                return reply.status(400).send({message: 'There can not list expenses'});
            }
            return reply.status(200).send({message: 'Successfully list expenses'});
        } catch (err){
            console.log(err)
            return reply.status(400).send({message: 'Something went wrong'});
        }
    }
    filter = async (request, reply) => {
        try{
            const {type, start_date, end_date} = request.body;
            const expenses = await this._filterService.filter(request.access_scope, request.userID, request.query.search, type, start_date, end_date);
            if (!expenses){
                return reply.status(400).send({message: 'There are no expenses'});
            }
            return reply.status(200).send({message: 'Successfully filtered expense'});
        }catch(err){
            console.log(err)
            return reply.status(500).send({message: 'Something went wrong'});
        }
    }
    update = async (request, reply) => {
        try{
            const updateExpense = await this._expensesRepository.updateExpenses(request.body);
            if (!updateExpense){
                return reply.status(400).send({message: 'Expenses not found'});
            }
            return reply.status(200).send({message: 'Successfully updated expense'});
        }catch(err){
            console.log(err)
            return reply.status(500).send({message: 'Something went wrong'});
        }
    }
    delete = async (request, reply) => {
        try{
            const deleteExpense = await this._expensesRepository.deleteExpenses(request.query.id, request.userID);
            if (!deleteExpense){
                return reply.status(400).send({message: 'Expenses not found'});
            }
            return reply.status(200).send({message: 'Successfully deleted expense'});
        }catch(err){
            console.log(err)
            return reply.status(500).send({message: 'Something went wrong'});
        }
    }
}

// Criar despesa
export async function createExpense(request, reply) {
    try {
        const { title, type, value, payment, date, beneficiary, church } = request.body
        const newExpense = await sql`
      INSERT INTO expenses (title, type, value, payment, date, beneficiary, church)
      VALUES (${title}, ${type}, ${value}, ${payment}, ${date}, ${beneficiary}, ${church})
      RETURNING *
    `
        return reply.status(201).send(newExpense[0])
    } catch (error) {
        console.error("Erro ao criar despesa:", error)
        return reply.status(500).send({ error: "Erro ao criar despesa" })
    }
}

// Listar despesas (com busca opcional)
export async function listExpenses(request, reply) {
    try {
        const { search } = request.query
        let expenses
        let indice
        const viewPermissions = ["general_preview", "sectorial_preview", "local_preview"];
        for (let i = 0; i < viewPermissions.length; i++) {
            const permissions = await getPermissionByName(viewPermissions[i]);
            console.log(permissions)
            if (permissions.length > 0 && request.permissions.includes(permissions[0].id)) {
                indice = i; // posição dentro de viewPermissions
                console.log("Permissão encontrada:", permissions[0].id);
                break
            }
        }


        switch (indice) {
            case 0:
                if (search) {
                    expenses = await sql`
                SELECT * FROM revenues WHERE member ILIKE ${"%" + search + "%"}
            `
                } else {
                    expenses = await sql`SELECT * FROM expenses`
                }
                break
            case 1:
                if(search) {
                    expenses = await sql`
                    SELECT r.* FROM churchs c JOIN expenses r ON r.church = c.id JOIN users u ON c.sector = u.sector WHERE u.id = ${request.userID} AND r.title ILIKE ${"%" + search + "%"}
                    `
                }else {
                    expenses = await sql`
                    SELECT r.* FROM churchs c JOIN expenses r ON r.church = c.id JOIN users u ON c.sector = u.sector WHERE u.id = ${request.userID}
                    `
                }
                break
            case 2:
                if(search) {
                    expenses = await sql`SELECT r.* FROM churchs c JOIN expenses r ON r.church = c.id JOIN users u ON c.id = u.church WHERE u.id = ${request.userID} AND r.title ILIKE ${"%" + search + "%"}`
                }else{
                    expenses = await sql`SELECT r.* FROM churchs c JOIN expenses r ON r.church = c.id JOIN users u ON c.id = u.church WHERE u.id = ${request.userID}`
                }
        }


        return reply.status(200).send(expenses)
    } catch (error) {
        console.error("Erro ao listar receitas:", error)
        return reply.status(500).send({ error: "Erro ao listar receitas" })
    }
}

// Filtrar despesas por tipo e intervalo de datas
export async function filterExpenses(request, reply) {
    try {
        let { type, date1: start_date, date2: end_date } = request.query

        if (type === "All") type = ""

        if (start_date === "") {
            const expenses_date = await sql`SELECT date FROM expenses`
            const timestamps = expenses_date.map(d => new Date(d.date).getTime())
            start_date = new Date(Math.min(...timestamps))
        }

        if (end_date === "") {
            const expenses_date = await sql`SELECT date FROM expenses`
            const timestamps = expenses_date.map(d => new Date(d.date).getTime())
            end_date = new Date(Math.max(...timestamps))
        }

        const expenses = await sql`
      SELECT *
      FROM expenses
      WHERE type ILIKE '%' || ${type} || '%'
        AND date BETWEEN ${start_date}::date AND ${end_date}::date
    `
        return reply.status(200).send(expenses)
    } catch (error) {
        console.error("Erro ao filtrar despesas:", error)
        return reply.status(500).send({ error: "Erro ao filtrar despesas" })
    }
}

// Editar despesa
export async function editExpense(request, reply) {
    try {
        const { id } = request.params
        const { title, type, value, payment, date, beneficiary, church} = request.body

        const updated = await sql`
      UPDATE expenses
      SET title = ${title}, type = ${type}, value = ${value}, payment = ${payment},
          date = ${date}, beneficiary = ${beneficiary}, church = ${church}
      WHERE id = ${id}
      RETURNING *
    `
        if (updated.length === 0) {
            return reply.status(404).send({ error: "Despesa não encontrada" })
        }
        return reply.status(204).send()
    } catch (error) {
        console.error("Erro ao editar despesa:", error)
        return reply.status(500).send({ error: "Erro ao editar despesa" })
    }
}

// Deletar despesa
export async function deleteExpense(request, reply) {
    try {
        const { id } = request.params
        const deleted = await sql`DELETE FROM expenses WHERE id = ${id} RETURNING *`

        if (deleted.length === 0) {
            return reply.status(404).send({ error: "Despesa não encontrada" })
        }
        return reply.status(204).send()
    } catch (error) {
        console.error("Erro ao remover despesa:", error)
        return reply.status(500).send({ error: "Erro ao remover despesa" })
    }
}