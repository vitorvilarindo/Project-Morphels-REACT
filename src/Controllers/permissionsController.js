export class PermissionsController {
    constructor(permissionsRepository) {
        this.permissionsRepository = permissionsRepository
    }
    listViewPermissions = async (request, reply)=> {
       try{
           const permissions = await this.permissionsRepository.listPagesViewPermissions(request.userID)
           if(permissions.length < 0){
               return reply.status(400).send({message:'No permissions found.'})
           }
           return reply.status(200).send(permissions)
       } catch (error) {
           console.log(error)
           return reply.status(500).send({message:error.message})
       }
}
}