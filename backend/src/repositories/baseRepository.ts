import mongoose,{ Model, Document, DeleteResult, FilterQuery } from "mongoose";



export class BaseRepository<T extends Document>{
constructor(private model:Model<T>){}
async findAll():Promise<T[]>{
    return await  this.model.find()
}
async findById(id:string):Promise<T|null>{
    return await  this.model.findById(id)
}
async updateById(id:string,data:Partial<T>):Promise<T|null>{
    return await this.model.findByIdAndUpdate(id,data,{new:true})
}
async deleteById(id:string):Promise<DeleteResult>{
     const objectId = new mongoose.Types.ObjectId(id);
    return await this.model.deleteOne({_id:objectId})
}
async findOne(filter:FilterQuery<T>):Promise<T|null>{
    return this.model.findOne(filter).exec()
}

   
}






