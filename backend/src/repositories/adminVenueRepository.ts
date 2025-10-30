
import { VenueFetch, VenueFilters, VenueUpdate } from "src/interface/IVenue";
import Venue, { IVenue } from "../model/venue";
import { IAdminVenueRepository } from "./repositoryInterface/IAdminVenueRepository";
import { DeleteResult } from "mongoose";

export class AdminVenueRepository implements IAdminVenueRepository {
  async createVenue(venueData: IVenue): Promise<IVenue | null> {
    console.log("venueData", venueData);

    return await Venue.create(venueData);
  }
  async fetchVenues(filters: VenueFilters): Promise<VenueFetch> {
    const skip =
      filters.limit && filters.page ? (filters.page - 1) * filters.limit : 0;

    const query = {
      $or: [
        { name: { $regex: filters.searchTerm, $options: "i" } },
        { city: { $regex: filters.searchTerm, $options: "i" } },
        { state: { $regex: filters.searchTerm, $options: "i" } },
      ],
    };
    const venues = await Venue.find(query)
      .skip(skip)
      .limit(Number(filters.limit)).sort({createdAt:-1});
    const total = await Venue.countDocuments(query);
    return {
      venues,
      totalPages: filters.limit ? Math.ceil(total / filters.limit) : 0,
      currentPage: filters.page,
    };
  }
  async editVenue(updateData: VenueUpdate): Promise<IVenue | null> {
    return await Venue.findByIdAndUpdate(updateData._id, updateData, {
      new: true,
    });
  }
  async deleteVenue(venueId: string): Promise<DeleteResult> {
    return await Venue.deleteOne({ _id: venueId });
  }
}