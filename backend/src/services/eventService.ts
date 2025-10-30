
import { IEventService } from "./serviceInterface/IEventService";
import { IEventRepository } from "../repositories/repositoryInterface/IEventRepository";


import {
  CreateEvent,
  DashboardEvents,
  EventByCat,
  EventById,
  EventCount,
  EventEdit,
  EventFind,
  EventGet,
  IEventFilter,
  Location,
  StatusCheck,
} from "../interface/event";
import { IEventDTO, IEventImage } from "src/interface/IEventDTO";
import { MESSAGES } from "../constants/messages";
import dotenv from 'dotenv';
dotenv.config()
import { InferenceClient  } from "@huggingface/inference";
import { Recommend } from "src/interface/IUser";
import { cosineSimilarity } from "../utils/cosine";
import axios from "axios";
import cloudinary from "../config/cloudinary";
import { IEvent } from "src/model/event";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const hf = new InferenceClient (process.env.HUGGING_API_KEY);
export class EventService implements IEventService {
  constructor(private _eventRepository: IEventRepository) {}
  async eventGet(filters: IEventFilter): Promise<EventGet> {
    try {
      const response = await this._eventRepository.getEvents(filters);
      

      if (response) {
        return {
          response,
          success: true,
          message: "Event fetched successfully",
        };
      } else {
        return { success: false, message: "No events found" };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "not getting events" };
    }
  }
  async completedGet(filters: IEventFilter): Promise<EventGet> {
    try {
      const response = await this._eventRepository.getCompleted(filters);
      

      if (response) {
        return {
          response,
          success: true,
          message: "Event fetched successfully",
        };
      } else {
        return { success: false, message: "No events found" };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "not getting events" };
    }
  }
  async eventGetById(id: string): Promise<EventById> {
    try {
      const result = await this._eventRepository.getEventById(id);
      if (result) {
        return {
          result,
          success: true,
          message: MESSAGES.EVENT.SUCCESS_TO_FETCH,
        };
      } else {
        return { success: false, message: MESSAGES.EVENT.FAILED_TO_FETCH };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: MESSAGES.EVENT.FAILED_TO_FETCH };
    }
  }
  



async eventCreate(data: IEventDTO): Promise<CreateEvent> {
  try {
    // Step 1: Create the text for embedding
    const text = `${data.category} ${data.description} ${data.venue}`;
    const output = await hf.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: text,
    });

    const embedding = Array.isArray(output[0])
      ? (output[0] as number[])
      : (output as number[]);

    // Step 2: Format the venue for geocoding
    const venueParts = [data.venue, "India"]
      .filter(Boolean)
      .map((p) => p.trim())
      .filter((v, i, self) => self.indexOf(v) === i);
    const formattedVenue = venueParts.join(", ");
    console.log("formatted venue", formattedVenue);

    
   const geoResponse = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
  params: {
    q: formattedVenue,
    key: process.env.OPENCAGE_API_KEY
  }
});

console.log("Geo response:", geoResponse.data);

// ✅ Step 4: Validate response properly
if (
  !geoResponse.data ||
  geoResponse.data.status.code !== 200 ||
  geoResponse.data.results.length === 0
) {
  return { success: false, message: "Could not geocode venue address." };
}

// ✅ Step 5: Extract correct coordinates
const locationData = geoResponse.data.results[0].geometry;
const latitude = locationData.lat;
const longitude = locationData.lng;
    // Step 5: Create event payload
    const eventPayload = {
      ...data,
      latitude,
      longitude,
      embedding,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    };
   
    

    // Step 6: Save to database
    const result = await this._eventRepository.createEvent(eventPayload);

    if (result) {
      return { success: true, message: MESSAGES.EVENT.SUCCESS_TO_CREATE };
    } else {
      return { success: false, message: MESSAGES.EVENT.FAILED_TO_CREATE };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: MESSAGES.EVENT.FAILED_TO_CREATE };
  }
}


  async eventDelete(id: string): Promise<CreateEvent> {
    try {
      const result = await this._eventRepository.eventDelete(id);
      if (result) {
        return { success: true, message: MESSAGES.EVENT.FAILED_TO_DELETE };
      } else {
        return { success: false, message: MESSAGES.EVENT.FAILED_TO_DELETE };
      }
    } catch (error) {
      console.log(error);

      return { success: false, message: "failed to delete event" };
    }
  }
  
async eventEdit(id: string, data: EventEdit, file?: Express.Multer.File): Promise<IEvent| null> {
  const existingEvent = await this._eventRepository.findById(id);
  if (!existingEvent) {
    throw new Error("Event not found");
  }

  let normalizedImages: IEventImage[] = [];

  if (file) {
    
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "events"
    });

   
    normalizedImages = [
      {
        url: result.secure_url,
        public_id: result.public_id || null,
      },
    ];
  } else {
   
    normalizedImages = existingEvent.images.map((img) => ({
      url: typeof img === "string" ? img : img.url,
      public_id: typeof img === "string" ? null : img.public_id ?? null,
    }));
  }

 
  data.images = normalizedImages;

  
  const updatedEvent = await this._eventRepository.editEvent(id, data);
  return updatedEvent;
}


  async statusCheck(email: object): Promise<StatusCheck> {
    try {
      const result = await this._eventRepository.statusCheck(email);
      if (result) {
        return { result: result, success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }
  async getEvent(
    id: string,
    limit: number,
    page: number,
    searchTerm: string,
    date: string,
    status:string
  ): Promise<EventGet> {
    try {
      const response = await this._eventRepository.eventGet(
        id,
        limit,
        page,
        searchTerm,
        date,status
      );

      if (response) {
        return {
          response,
          success: true,
          message: MESSAGES.EVENT.SUCCESS_TO_FETCH,
        };
      } else {
        return { success: false, message: "No event found" };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "not getting event" };
    }
  }
  async eventCountGet(organiserId: string): Promise<EventCount> {
    try {
      const result = await this._eventRepository.getEventCount(organiserId);
      if (result) {
        return { count: result, success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }
  async getDashboardEvents(
    organiserId: string,
    timeFrame: "7d" | "30d" | "90d"
  ): Promise<DashboardEvents> {
    try {
      const response = await this._eventRepository.dashboardEvents(
        organiserId,
        timeFrame
      );
      if (response) {
        return {
          success: true,
          events: response.events,
          message: "event fetched successfully",
          data: response.data,
          adminPercentage: response.adminCommissionPercentage,
          organiserEarning: response.organiserEarning,
          totalEvents: response.totalEvents,
          totalAttendees: response.totalAttendees,
          topEvents: response.topEvents,
          upcomingEvents: response.upcomingEvents,
        };
      } else {
        return { success: false, message: MESSAGES.EVENT.FAILED_TO_FETCH };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "failed" };
    }
  }
  async getEvents(organiserId: string): Promise<EventGet> {
    try {
      const response = await this._eventRepository.getOrgEvents(organiserId);
      if (response) {
        return {
          success: true,
          result: response,
          message: MESSAGES.EVENT.SUCCESS_TO_FETCH,
        };
      } else {
        return { success: false, message: "failed" };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "failed" };
    }
  }
  async eventFind(eventName: string): Promise<EventFind> {
    try {
      const response = await this._eventRepository.findEvent(eventName);
      if (response) {
        return { success: true, result: response };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }
  async eventsFindByCat(category: string): Promise<EventByCat> {
    try {
      const response = await this._eventRepository.findEventsByCat(category);
      if (response) {
        return { success: true, result: response };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }
  async getRecommended(userId:string,filters:IEventFilter):Promise<Recommend>{
    try {
      const response=await this._eventRepository.findRecommended(userId,filters);
      if(response.event&&response.events){
        const baseEmbedding=response.event.embedding;
        if(!baseEmbedding){
          throw new Error("embedding not present")
        }
        const events=response.events;

        const scoredEvents=events.map((event)=>{
          if (!event.embedding) return { ...event, score: -1 };
          const score=cosineSimilarity(baseEmbedding,event.embedding);
          console.log("scre",score);
          
          return {...event,score}
        })
        console.log("scored",scoredEvents);
        
        scoredEvents.sort((a,b)=>b.score-a.score);
        const filteredEvents = scoredEvents.filter(e => e.score >= 0.2);
        
        
        return {success:true,events:filteredEvents}

      }
      if(response.events){
        return {success:true,events:response.events}
      }else{
        return {success:false}
      }

      
    } catch (error) {
      console.error(error);
      return {success:false}
      
    }
  }
  async nearFind({lat,lng}:Location,filters:IEventFilter):Promise<Recommend>{
    const response=await this._eventRepository.findNear({lat,lng},filters);
    
    
    if(response){
      return {events:response,success:true}
    }else{
      return{success:false}
    }
  }
  async getEventsAll():Promise<{images:(string | IEventImage)[],title:string}[]>{
    try {
      const response=await this._eventRepository.getAllEvents();
    return response
    
      
    } catch (error) {
      
      console.error(error);
    return [];
    }
    
    
   
  }
  async trendingGet():Promise<{images:(string | IEventImage)[],title:string}[]>{
    try {
      const response=await this._eventRepository.getTrending();
    return response
    
      
    } catch (error) {
      
      console.error(error);
    return [];
    }
    
    
   
  }
  async eventReschedule(date: string, eventId: string, organiserId: string):Promise<{success:boolean,message:string}> {
  try {
    const orders = await this._eventRepository.findOrders(eventId);
    const organiser=await this._eventRepository.findOrg(organiserId)
   

    // Optional: update event date in database
    await this._eventRepository.updateEventDate(eventId, date);

    for (const order of orders) {
      const user = await this._eventRepository.findUser(order.userId);

      if (!user?.email) continue;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Event Rescheduled: ${order.eventTitle}`,
        html: `
          <h3>Hello ${user.name || ""},</h3>
          <p>We wanted to let you know that the event <strong>${order.eventTitle}</strong> 
          organized by <strong>${organiser?.name}</strong> has been rescheduled.</p>
          
          <p><b>New Date:</b> ${date}</p>
          <p>We apologize for any inconvenience. Thank you for your understanding!</p>
          <br/>
          <h3>Booking Details</h3>
          <p>Event: <b>${order.eventTitle}</b></p>
          <p>Tickets: <b>${order.ticketCount}</b></p>
          <p>Order ID: ${order.orderId}</p>
          <br/>
          <p>– Event Management Team</p>
        `,
      };
      await transporter.sendMail(mailOptions);

  
    }

    return { success: true, message: "Event rescheduled and users notified." };
  } catch (error) {
    console.error("Error in eventReschedule:", error);
    throw error;
  }
}

}