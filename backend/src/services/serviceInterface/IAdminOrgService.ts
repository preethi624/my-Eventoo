import { EditOrg } from "src/interface/event";
import { GetOrganisers, GetOrgs, IOrganiser } from "src/interface/IOrgAuth";

export interface IAdminOrgService {
  getOrganiser(limit: number, page: number,searchTerm:string,filterStatus:string,sortBy:string): Promise<GetOrganisers>;
  organiserUpdate(id: string, formData: EditOrg): Promise<GetOrgs>;
  organiserBlock(organiser: IOrganiser): Promise<GetOrgs>;
}
