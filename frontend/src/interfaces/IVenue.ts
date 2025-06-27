export interface IVenue{
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
export interface GetVenues{
  success:boolean;
  message:string;
  venues?:IVenue[]
}
export interface GetVenue{
  success:boolean;
  message:string;
  venue?:IVenue;

}