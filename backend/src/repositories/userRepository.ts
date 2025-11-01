import { IUser } from "src/interface/IUserAuth";
import User from "../model/user";
import { IUserRepository } from "./repositoryInterface/IUserRepository";
import { ProfileEdit } from "src/interface/IUser";
import { IOrganiser } from "src/interface/IOrgAuth";

import bcrypt from "bcrypt";
import Venue, { IVenue } from "../model/venue";
import Offer, { IOffer } from "../model/offer";
import Order from "../model/order";
import mongoose from "mongoose";

export class UserRepository implements IUserRepository {
  async getUser(userId: string): Promise<IUser | null> {
    return await User.findById(userId);
  }
  async updateUser(data: ProfileEdit, userId: string): Promise<IUser | null> {
    const { name, phone, location, aboutMe, profileImage } = data;
    return await User.findByIdAndUpdate(
      userId,
      { name, phone, location, aboutMe: aboutMe, profileImage },
      { new: true }
    );
  }
  async getOrgs(userId:string): Promise<IOrganiser[]> {
    try {
      const organisers=await Order.aggregate([
        {$match:{userId:new mongoose.Types.ObjectId(userId)}},
        {$lookup:{
          from:"events",
          localField:"eventId",
          foreignField:"_id",
          as:"eventDetails"
        }},
        {$unwind:"$eventDetails"},
          { $sort: { "eventDetails.createdAt": -1 } },
        {$lookup:{
          from:"organisers",
          localField:"eventDetails.organiser",
          foreignField:"_id",
          as:"organiserDetails"
        }},
        {$unwind:"$organiserDetails"},
        {$group: {
        _id: "$organiserDetails._id",
        name: { $first: "$organiserDetails.name" },
        email: { $first: "$organiserDetails.email" },
        phone: { $first: "$organiserDetails.phone" },
        aboutMe: { $first: "$organiserDetails.aboutMe" },
        profileImage: { $first: "$organiserDetails.profileImage" },
        location: { $first: "$organiserDetails.location" },
         latestBookedEvent: {
            $first: {
              eventId: "$eventDetails._id",
              title: "$eventDetails.title",
              date: "$eventDetails.date",
              venue: "$eventDetails.venue",
             
              createdAt: "$eventDetails.createdAt",
            },
          },
      }}

      ])
      console.log("organisers",organisers);
      
      return organisers
    } catch (error) {
      console.log(error);
      throw error;
    }

  }
  async changePassword(userId:string,newPass:string,currentPass:string):Promise<{success:boolean}|undefined>{
    try {
      console.log("new",newPass);
      
      const user=await User.findById(userId)
      if(!user){
        throw new Error("user not found")
      }
      const isMatch = await bcrypt.compare(currentPass, user.password);
       if (!isMatch) {
      return { success: false }; 
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPass, saltRounds);
     user.password = hashedPassword;
    await user.save();
    return {success:true}


      
    } catch (error) {
      console.log(error);
    return { success: false };
    }
  }
  async fetchVenues():Promise<IVenue[]>{
    return await Venue.find()
  }
  async fetchOffer(code:string):Promise<IOffer|null>{
    return await Offer.findOne({code})
  }
}
