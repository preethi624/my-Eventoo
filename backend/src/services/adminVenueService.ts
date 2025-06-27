import { createVenue, EditVenue, FetchVenues, VenueFetch, VenueFilters, VenueUpdate} from "src/interface/IVenue";
import { IVenue } from "src/model/venue";
import { IAdminVenueService } from "./serviceInterface/IAdminVenueService";
import { IAdminVenueRepository } from "src/repositories/repositoryInterface/IAdminVenueRepository";

export class AdminVenueService implements IAdminVenueService{
    constructor(private adminVenueRepository:IAdminVenueRepository){}
    async venueCreate(venueData:IVenue):Promise<createVenue>{
        try {
        
        
       
        
      
        
        
        const result=await this.adminVenueRepository.createVenue(venueData);
        
        
        if(result){
            return{success:true,message:"Venue created successfully"}
        }else{
            return{success:false,message:"Failed t create venue"}
        }
        
    } catch (error) {

        console.error(error);
        return { success: false, message: "not creating venue" };
    }

    }
    async venuesFetch(filters:VenueFilters):Promise<VenueFetch>{
        try {
            const response=await this.adminVenueRepository.fetchVenues(filters);
            if(response){
                return{success:true,message:"fetched successfully",venues:response.venues,totalPages:response.totalPages,currentPage:response.currentPage}
            }else{
                return{success:false,message:"failed to fetch"}
            }
            
        } catch (error) {
             console.error(error);
        return { success: false, message: "failed to fetch venues" };
            

        }


    }
     async venueEdit(updateData:VenueUpdate):Promise<EditVenue>{
        try {
            const response=await this.adminVenueRepository.editVenue(updateData);
            if(response){
                return{success:true,message:"updated successfully"}
            }else{
                return{success:false,message:"failed to update"}
            }
            
        } catch (error) {
             console.error(error);
        return { success: false, message: "failed to update" };
            

        }


    }
    async venueDelete(venueId:string):Promise<EditVenue>{
        try {
            const response=await this.adminVenueRepository.deleteVenue(venueId);
            if(response.acknowledged && response.deletedCount === 1){
                return{success:true,message:"deleted successfully"}
            }else{
                return{success:false,message:"failed to delete"}
            }
            
        } catch (error) {
             console.error(error);
        return { success: false, message: "failed to delete" };
            

        }


    }
}