import { createVenue, EditVenue,  VenueFetch, VenueFilters, VenueUpdate} from "src/interface/IVenue";
import { IVenue } from "src/model/venue";

export interface IAdminVenueService{
    venueCreate(venueData:IVenue):Promise<createVenue>;
    venuesFetch(filters:VenueFilters):Promise<VenueFetch>;
    venueEdit(updateData:VenueUpdate):Promise<EditVenue>;
    venueDelete(venueId:string):Promise<EditVenue>
}