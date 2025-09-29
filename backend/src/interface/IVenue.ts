import { IVenue } from "src/model/venue";

export interface createVenue{
    success:boolean;
  message:string


}
export interface FetchVenues{
  success:boolean;
  message:string;
  venues?:IVenue[];
  

}
export interface VenueUpdate{
    _id:string
    name: string;
  address:string;
  city:string;
  state:string;
  pincode:string;
  description: string;
  capacity: number;
  contactPerson:string
  phone:number;
  email:string;
  images: string[];
  website:string;
  facilities:string[];
  status:string;

}
export interface EditVenue{
  success:boolean;
  message:string
}
export interface GetVenues{
  success:boolean;
  message:string;
  venues?:IVenue[]
}
export interface GetVenue{
  success:boolean;
  message:string;
  venue?:IVenue
}
export interface VenueFilters{
 
  searchTerm?: string;
  
  page?:number;
  limit?:number;

  

}
export interface VenueFetch{
  totalPages?:number;
  currentPage?:number
  venues?:IVenue[];
  success?:boolean;
  message?:string;
}
export interface OrgVenueFilter{
<<<<<<< HEAD
 searchTerm?:string
=======
  nameSearch?:string;
  locationSearch?:string;
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
  page?:number;
  limit?:number
}