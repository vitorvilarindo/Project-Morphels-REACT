export class RolesController {
    constructor(rolesRepository) {
        this.repository = rolesRepository
    }
    create = async (request, reply) => {
        try{
            const createRole = await this.repository.createRole(request.body, request.userID)
            if(!createRole){
                return reply.status(303).send({error: "Role could not be created"})
            }
            return reply.status(201).send({error:"Role already exists"})
        }catch(err){
            console.log(err)
            return reply.status(500).send({error:"Something went wrong"})
        }
    }
    list = async (request, reply) => {
        try{
            const roles = await this.repository.listRoles(request.userID)
            if (!roles){
                return reply.status(404).send({error:"No role found"})
            }
            return reply.status(200).send({roles})
        }catch(err){
            console.log(err)
            return reply.status(500).send({error:"Something went wrong"})
        }
    }
    update = async (request, reply) => {
        try{
            const updateRole = await this.repository.updateRole(request.body, request.params.id)
            if(!updateRole){
                return reply.status(404).send({error:"No update role found"})
            }
            return reply.status(200).send({error:"Update role already exists"})
        }catch(err){
            console.log(err)
            return reply.status(500).send({error:"Something went wrong"})
        }
    }
    delete = async (request, reply) => {
        try{
            const deleteRole = await this.repository.deleteRole(request.params.id)
            if(!deleteRole){
                return reply.status(404).send({error:"No delete role found"})
            }
            return reply.status(200).send({error:"Delete role already exists"})
        }catch(err){
            console.log(err)
            return reply.status(500).send({error:"Something went wrong"})
        }
    }
}

