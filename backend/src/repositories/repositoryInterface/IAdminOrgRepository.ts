import { EditOrg } from "src/interface/event";
import { IOrganiser } from "src/interface/IOrgAuth";

export interface IAdminOrgRepository{
     getOrganiserAll():Promise<IOrganiser[]>;
     editOrganiser(id:string,formData:EditOrg):Promise<IOrganiser|null>;
      blockOrganiser(organiser:IOrganiser):Promise<IOrganiser|null>
}