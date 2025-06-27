import { DeleteResult } from "mongoose";
import { VenueFetch, VenueFilters, VenueUpdate } from "src/interface/IVenue";
import { IVenue } from "src/model/venue";


export interface IAdminVenueRepository {
    createVenue(venueData:IVenue):Promise<IVenue|null>;
    fetchVenues(filters:VenueFilters):Promise<VenueFetch>
     editVenue(updateData:VenueUpdate):Promise<IVenue|null>;
     deleteVenue(venueId:string):Promise<DeleteResult>
      
}