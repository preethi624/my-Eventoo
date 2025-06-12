import { EditOrg } from "src/interface/event";
import { IOrganiser } from "../interface/IOrgAuth";
import Organiser from "../model/organiser";
import { IAdminOrgRepository } from "./repositoryInterface/IAdminOrgRepository";

export class AdminOrgRepository implements IAdminOrgRepository{
    async getOrganiserAll():Promise<IOrganiser[]>{
        return await Organiser.find()
    }
    async editOrganiser(id:string,formData:EditOrg):Promise<IOrganiser|null>{
        return await Organiser.findByIdAndUpdate(id,formData,{new:true})

    }
    async blockOrganiser(organiser:IOrganiser):Promise<IOrganiser|null>{
        const id=organiser._id
        if(!organiser.isBlocked){

            return await Organiser.findByIdAndUpdate(id,{isBlocked:true},{new:true})
        }else{
            return await Organiser.findByIdAndUpdate(id,{isBlocked:false},{new:true})

        }
        

    }

    
}