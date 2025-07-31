import { EditOrg } from "src/interface/event";
import { GetOrganisers, IOrganiser } from "src/interface/IOrgAuth";

export interface IAdminOrgRepository{
     getOrganiserAll(limit:number,page:number):Promise<GetOrganisers>;
     editOrganiser(id:string,formData:EditOrg):Promise<IOrganiser|null>;
      blockOrganiser(organiser:IOrganiser):Promise<IOrganiser|null>
}