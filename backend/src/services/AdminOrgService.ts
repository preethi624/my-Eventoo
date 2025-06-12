
import { IAdminOrgService } from "./serviceInterface/IAdminOrgService";
import { IAdminOrgRepository } from "src/repositories/repositoryInterface/IAdminOrgRepository";
import { EditOrg } from "src/interface/event";
import { IMailService } from "./serviceInterface/IMailService";
import { GetOrganisers, GetOrgs, IOrganiser } from "src/interface/IOrgAuth";

export class AdminOrgService implements IAdminOrgService{
    constructor(private adminOrgRepository:IAdminOrgRepository,private mailService:IMailService){}
     async getOrganiser():Promise<GetOrganisers>{
      try {
        const result:IOrganiser[]=await this.adminOrgRepository.getOrganiserAll();
        if(result){
          return {result:result,success:true,message:"Users fetched successfully"}
        }else{
          return{success:false,message:"failed to fetch users"}
        }
        
      } catch (error) {
        console.error('Login error:', error);
        return {
          success: false,
          message: 'Internal server error',
        };
        
      }
    
    }
    async organiserUpdate(id:string,formData:EditOrg):Promise<GetOrgs>{
  try {
    const response=await this.adminOrgRepository.editOrganiser(id,formData);
    console.log("resee",formData);
    
    if(response){
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: formData.email,
        subject: 'Eventoo account status updated by admin',
        text: ` Your Eventoo account ${formData.status} by admin`
    };
     this.mailService.sendMail(mailOptions)
    //await transporter.sendMail(mailOptions);
      return{success:true,message:"Organiser edit successfully"}


    }else{
      return {success:false,message:"failed to edit organiser"}
    }
    
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Internal server error',
    };
    
  }


}
async organiserBlock(organiser:IOrganiser):Promise<GetOrgs>{
  try {
    const response=await this.adminOrgRepository.blockOrganiser(organiser);
    
    
    if(response){
      return {organiser:response,success:true,message:"Organiser blocked successfully"}

    }else{
      return {success:false,message:"failed to block"}
    }
  } catch (error) {

    console.error('Login error:', error);
    return {
      success: false,
      message: 'Internal server error',
    };
  }


}

}