import { sql } from "../../db.js"
export class CardsController {
    constructor(cardsRepository, validationService) {
        this.cardsRepository = cardsRepository
        this.validationService = validationService
    }
    create = async (request, reply) => {
        try{
            const cardCreate = await this.cardsRepository.createCards(request.body, request.userID)
            if (!cardCreate) {
                return reply.status(303).send({message:"Card could not be created"})
            }
            return reply.status(201).send({message:"Card created"})
        }catch(err){
            return reply.status(400).send({message:"Card not found"})
        }
    }
    list = async (request, reply) => {
        try{
            const cards = await this.validationService.validateAccessScope(request.access_scope, request.userID, request.query.search)
            if (!cards) {
                return reply.status(404).send({message:"Not Found"})
            }
            return reply.status(200).send({message:"List of cards"})
        }catch(err){
            console.log(err)
            return reply.status(400).send({message:"Card not found"})
        }
    }
    update = async (request, reply) => {
        try{
            const cardUpdate = await this.cardsRepository.updateCards(request.body, request.params.id)
            if (!cardUpdate) {
                return reply.status(404).send({message:"Not Found"})
            }
            return reply.status(200).send({message:"Updated successfully"})
        }catch(err){
            console.log(err)
            return reply.status(400).send({message:"Card not found"})
        }
    }
    delete = async (request, reply) => {
        try{
            const cardDelete = await this.cardsRepository.deleteCards(request.params.id)
            if (!cardDelete) {
                return reply.status(404).send({message:"Not Found"})
            }
            return reply.status(200).send({message:"Deleted successfully"})
        }catch(err){
            console.log(err)
            return reply.status(400).send({message:"Card not found"})
        }
    }
}