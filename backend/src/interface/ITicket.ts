import { ITicket } from "src/model/ticket";

export  interface ITicketDetails{
    tickets?:ITicket[];
    totalPages?:number;
    totalItems?:number;
    currentPage?:number;
    success?:boolean
    
}