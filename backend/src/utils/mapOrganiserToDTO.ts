import { IOrganiser, IOrganiserDTO} from "src/interface/IOrgAuth";



export const mapOrganiserToDTO=(organiser:IOrganiser):IOrganiserDTO=>({
    _id:organiser._id,
 
   name: organiser.name,
  email: organiser.email,
 
 

 
  isBlocked: organiser.isBlocked,
  status:organiser.status
  
 

})