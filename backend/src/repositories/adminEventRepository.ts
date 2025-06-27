import { EditEvent, GetEvent, IEventFilter } from "src/interface/event";
import EventModel, { IEvent } from "../model/event";
import { IAdminEventRepository } from "./repositoryInterface/IAdminEventRepository";
import { FilterQuery, PipelineStage } from "mongoose";
import { AdminDashboard } from "src/interface/IAdmin";
import PlatformSettings from "../model/platformSettings";

export class AdminEventRepository implements IAdminEventRepository{
    async getEventsAll(filters:IEventFilter):Promise<GetEvent|null>{

        const {searchLocation,selectedCategory,maxPrice,selectedDate,searchTitle,page=1,limit=6,orgName}=filters;
        
              const skip=(page-1)*limit

        
      
        const  query:FilterQuery<IEvent>={}
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
         const pipeline: PipelineStage[] = [
      { $match: query },
      {
        $lookup: {
          from: "organisers",
          localField: "organiser",
          foreignField: "_id",
          as: "organiserDetails",
        },
      },
      { $unwind: "$organiserDetails" },
    ];
    if (filters.orgName) {
      pipeline.push({
        $match: {
          "organiserDetails.name": {
            $regex: filters.orgName,
            $options: "i",
          },
        },
      });
    }
     pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    );
    const events = await EventModel.aggregate(pipeline);
    const countPipeline = pipeline.filter(
      (stage) =>
        !("$skip" in stage) && !("$limit" in stage) && !("$sort" in stage)
    );
    countPipeline.push({ $count: "total" });
    const countData = await EventModel.aggregate(countPipeline);
    const total = countData[0]?.total || 0;
        
       // const totalCount=await EventModel.countDocuments(query)
        //const events=await EventModel.find(query).skip(skip).limit(limit).sort({createdAt:-1});
        
        
       

        
     
        return{
            totalPages:Math.ceil(total/limit),
            events,
            currentPage:page
        }  

    }
     async eventEdit(id:string,formData:EditEvent):Promise<IEvent|null>{
        return await EventModel.findByIdAndUpdate(id,formData,{new:true})

    }
    async blockEvent(event:IEvent):Promise<IEvent|null>{
        const id=event._id
        if(!event.isBlocked){

            return await EventModel.findByIdAndUpdate(id,{isBlocked:true},{new:true})
        }else{
            return await EventModel.findByIdAndUpdate(id,{isBlocked:false},{new:true})

        }


}
async getDashboard():Promise<AdminDashboard>{
  const settings=await PlatformSettings.findOne();
  const commissionRate=(settings?.adminCommissionPercentage??10)/100
  const monthlyRevenue = await EventModel.aggregate([
  {
    $match: {
      status: 'completed'  
    }
  },
  {
    $group: {
      _id: { $month: '$date' },
      revenue: { $sum:{$multiply:[{ $multiply: ['$ticketPrice', '$ticketsSold'] } ,commissionRate]}},
      events: { $sum: 1 }
    }
  },
  {
    $project: {
      month: '$_id',
      revenue: 1,
      events: 1,
      _id: 0
    }
  },
  {
    $sort: { month: 1 }
  }
]);
const topEvents=await EventModel.aggregate([
  
   {$project:{title:1,ticketsSold:1,revenue:{$multiply:["$ticketsSold","$ticketPrice"]}}},
   {$sort:{revenue:-1}},
  {$limit:5}

   
])




return {
    monthlyRevenue,
    message: 'Dashboard data fetched successfully',
    success: true,
    topEvents
  };



}
    
    
}