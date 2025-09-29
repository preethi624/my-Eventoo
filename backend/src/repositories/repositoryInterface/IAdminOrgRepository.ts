import { EditOrg } from "src/interface/event";
import { GetOrganisers, IOrganiser } from "src/interface/IOrgAuth";

export interface IAdminOrgRepository{
<<<<<<< HEAD
     getOrganiserAll(limit:number,page:number,searchTerm:string,filterStatus:string,sortBy:string):Promise<GetOrganisers>;
=======
     getOrganiserAll(limit:number,page:number,searchTerm:string,filterStatus:string):Promise<GetOrganisers>;
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
     editOrganiser(id:string,formData:EditOrg):Promise<IOrganiser|null>;
      blockOrganiser(organiser:IOrganiser):Promise<IOrganiser|null>
}