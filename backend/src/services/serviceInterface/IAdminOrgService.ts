import { EditOrg } from "src/interface/event";
import { GetOrganisers, GetOrgs, IOrganiser } from "src/interface/IOrgAuth";

export interface IAdminOrgService {
<<<<<<< HEAD
  getOrganiser(limit: number, page: number,searchTerm:string,filterStatus:string,sortBy:string): Promise<GetOrganisers>;
=======
  getOrganiser(limit: number, page: number,searchTerm:string,filterStatus:string): Promise<GetOrganisers>;
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
  organiserUpdate(id: string, formData: EditOrg): Promise<GetOrgs>;
  organiserBlock(organiser: IOrganiser): Promise<GetOrgs>;
}
