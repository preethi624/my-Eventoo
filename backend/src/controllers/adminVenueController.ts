import { Request, Response } from "express";
import { StatusCode } from "../constants/statusCodeEnum";
import { IAdminVenueController } from "./controllerInterface/IAdminVenueController";
import { IAdminVenueService } from "src/services/serviceInterface/IAdminVenueService";
import { ParsedQs } from "qs";
import { VenueFilters } from "src/interface/IVenue";
export class AdminVenueController implements IAdminVenueController{
    constructor(private adminVenueService:IAdminVenueService){}
    async createVenue(req:Request,res:Response):Promise<void>{
        try {
             const files = req.files as Express.Multer.File[];
         const venueData = {
      ...req.body,
      images: files?.map((file: Express.Multer.File) => file.path) || []
    };
    console.log("venue",venueData);
    
    const response=await this.adminVenueService.venueCreate(venueData)
     if(response.success){
      res.json({success:true,message:"venue created successfully"})
    }else{
      res.json({success:false,message:"Failed to create event"})
    }
            
        } catch (error) {
            console.error(error);
                res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                  success: false,
                  message: "Failed to create event",
                });
            
        }
       
   

    }
    async fetchVenues(req:Request,res:Response):Promise<void>{
      try {
        const query=req.query as ParsedQs;
                const filters:VenueFilters={
                  searchTerm:typeof query.searchTerm==='string'?query.searchTerm:'',
                   
                page:query.page?Number(query.page):undefined,
                limit: query.limit && !isNaN(Number(query.limit)) ? Number(query.limit) : undefined
            
            
                }
        const response=await this.adminVenueService.venuesFetch(filters)
        if(response.success){
          res.json({successs:true,message:"venues fetched successfully",venues:response.venues,totalPages:response.totalPages,currentPage:response.currentPage})
        }else{
          res.json({successs:false,message:"failed to fetch"})

        }
        
      } catch (error) {
        console.error(error);
                res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                  success: false,
                  message: "Failed to fetch venues",
                });
            
        
      }

    }
    async editVenue(req:Request,res:Response):Promise<void>{
      try {
        const updateData=req.body
        const response=await this.adminVenueService.venueEdit(updateData)
        if(response.success){
          res.json({successs:true,message:"venues updated successfully"})
        }else{
          res.json({successs:false,message:"failed to update"})

        }
        
      } catch (error) {
        console.error(error);
                res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                  success: false,
                  message: "Failed to update",
                });
            
        
      }

    }
    async deleteVenue(req:Request,res:Response):Promise<void>{
      try {
      const venueId=req.params.venueId
      
      
        const response=await this.adminVenueService.venueDelete(venueId)
        if(response.success){
          res.json({successs:true,message:"venues deleted successfully"})
        }else{
          res.json({successs:false,message:"failed to delete"})

        }
        
      } catch (error) {
        console.error(error);
                res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                  success: false,
                  message: "Failed to delete",
                });
            
        
      }

    }



    
}


