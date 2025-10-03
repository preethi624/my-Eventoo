import { EditOrg } from "src/interface/event";
import { GetOrganisers, IOrganiser } from "../interface/IOrgAuth";
import Organiser from "../model/organiser";
import { IAdminOrgRepository } from "./repositoryInterface/IAdminOrgRepository";
import { FilterQuery } from "mongoose";

export class AdminOrgRepository implements IAdminOrgRepository {
  async getOrganiserAll(limit: number, page: number,searchTerm:string,filterStatus:string,sortBy:string): Promise<GetOrganisers> {
    const query:FilterQuery<IOrganiser>={};
    if(searchTerm){
      query.$or=[
        {name:{$regex:searchTerm,$options:"i"}},
        {email:{$regex:searchTerm,$options:"i"}}
      ]
    }
    if(filterStatus==="blocked"){
      query.isBlocked=true
    }else if(filterStatus==="unblocked"){
      query.isBlocked=false
    }
    const skip = (page - 1) * limit;
    const organisers = await Organiser.find(query).skip(skip).sort(
      sortBy==="newest"?{createdAt:-1}:
      sortBy==="oldest"?{createdAt:1}:
      sortBy==="nameAsc"?{name:1}:{name:-1}
    
    ).limit(limit);
    const totalOrganisers = await Organiser.countDocuments();
    const total = totalOrganisers / limit;
    return { result: organisers, total };
  }
  async editOrganiser(
    id: string,
    formData: EditOrg
  ): Promise<IOrganiser | null> {
    return await Organiser.findByIdAndUpdate(id, formData, { new: true });
  }
  async blockOrganiser(organiser: IOrganiser): Promise<IOrganiser | null> {
    const id = organiser._id;
    if (!organiser.isBlocked) {
      return await Organiser.findByIdAndUpdate(
        id,
        { isBlocked: true },
        { new: true }
      );
    } else {
      return await Organiser.findByIdAndUpdate(
        id,
        { isBlocked: false },
        { new: true }
      );
    }
  }
}
