import { IEventDTO } from "src/interface/IEventDTO";
import EventModel, { IEvent } from "../model/event";
import { IEventRepository } from "./repositoryInterface/IEventRepository";
import  { DeleteResult, FilterQuery } from 'mongoose';
import { EventEdit, GetEvent, IEventFilter } from "src/interface/event";
import { IUser } from "src/interface/IUserAuth";
import User from "../model/user";
import { BaseRepository } from "./baseRepository";


export class EventRepository extends BaseRepository<IEvent> implements IEventRepository{
    constructor(){
        super(EventModel)
    }
      async getEvents(filters:IEventFilter):Promise<GetEvent|null>{
        const {searchLocation,selectedCategory,maxPrice,selectedDate,searchTitle,page=1,limit=6}=filters;
        
              const skip=(page-1)*limit

        
      
        const  query:FilterQuery<IEvent>={isBlocked:false}
        if(searchLocation){
            
            query.venue={$regex:searchLocation,$options:'i'}


        }
        if(searchTitle){
            query.title={$regex:searchTitle,$options:'i'}
        }
        if(selectedCategory){
            query.category=selectedCategory
        }
        if(maxPrice!=undefined&&maxPrice!=null){
            query.ticketPrice={$lte:maxPrice}
        }
        if(selectedDate){
            const date=new Date(selectedDate);
            date.setHours(0,0,0,0);
            const nextDay=new Date(date);
            nextDay.setDate(date.getDate()+1);
            query.date={$gte:date,$lt:nextDay}
        }
        const totalCount=await EventModel.countDocuments(query)
        const events=await EventModel.find(query).skip(skip).limit(limit);
     
        return{
            totalPages:Math.ceil(totalCount/limit),
            events,
            currentPage:page
        }
    }
    async getEventById(id:string):Promise<IEvent|null>{
        return await this.findById(id);
        
    }
    async createEvent(data:IEventDTO):Promise<IEvent>{
        console.log("repdata",data);
        
      
        
        
       
       
        
        return await EventModel.create(data)

    }
 async eventDelete(id:string):Promise<DeleteResult>{
        
        
    return this.deleteById(id);
        
    }   
    async editEvent(id:string,data:EventEdit):Promise<IEvent|null>{
        const updatedData:Partial<IEvent>={
            ...data,
            date:new Date(data.date),
           status: data.status as 'draft' | 'published' | 'completed' | 'cancelled', 
            
        }
        return this.updateById(id,updatedData)

    }
    async statusCheck(emailObj:{email:string}):Promise<IUser|null>{
;
        const {email}=emailObj
        
     
        
        
        return await User.findOne({email})
        

    }
    async decrementAvailableTickets(eventId:string,ticketCount:number):Promise<void>{
        await EventModel.findByIdAndUpdate(eventId,{$inc:{availableTickets:-ticketCount}})
    }
    async eventGet(id:string,limit:number,page:number):Promise<GetEvent|null>{
        const skip=(page-1)*limit
        const events=await EventModel.find({organiser:id}).skip(skip).limit(limit);
        const totalEvents=await EventModel.countDocuments({organiser:id})
        return {
            events,
            totalPages: Math.ceil(totalEvents / limit),
            currentPage:page
        }
        
    }
    async getEventCount(organiserId:string):Promise<number|null>{
        return await EventModel.countDocuments({organiser:organiserId})
        
    }
    
}