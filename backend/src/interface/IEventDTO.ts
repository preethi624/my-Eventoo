import mongoose, { ObjectId } from "mongoose";
import Types from 'mongoose'

export interface IEventDTO {
  
  title: string;
  description: string;
  date: Date;
  time: string;
  venue: string;
  category: string;
  ticketPrice: number;
  capacity: number;
  images: string[];
  organiser: string|Types.ObjectId;
  status: 'draft' | 'published' |'completed'| 'cancelled';
  ticketsSold: number;
  createdAt: Date;
  latitude: number;
  longitude: number;
  isBlocked:boolean;
  embedding?:number[];
}