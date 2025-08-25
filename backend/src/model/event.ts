import mongoose, { Document, Schema } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  time: string;
  venue: string;
  category: string;
  ticketPrice: number;
  capacity: number;
  images: string[];
  organiser: mongoose.Types.ObjectId;
  status: "draft" | "published" | "completed" | "cancelled";

  availableTickets: number;

  ticketsSold: number;
  createdAt: Date;
  latitude: number;
  longitude: number;
  isBlocked: boolean;
  embedding:number[];
  location:{
    type:"Point",
    coordinates:[number,number]
  }
}

const eventSchema: Schema<IEvent> = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: {
      type: Date,
      required: true,
      validate: {
        validator: function (value: Date) {
          return value >= new Date(new Date().setHours(0, 0, 0, 0));
        },
        message: "Event date must be today or in the future.",
      },
    },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    category: { type: String, required: true },
    ticketPrice: { type: Number, required: true },
    capacity: { type: Number, required: true },
    images: { type: [String], default: [] },
    organiser: { type: mongoose.Schema.Types.ObjectId, ref: "organiser" },
    status: {
      type: String,
      enum: ["draft", "published", "completed", "cancelled"],
      default: "draft",
    },

    availableTickets: { type: Number, default: 0 },
    ticketsSold: { type: Number, default: 0 },

    latitude: { type: Number, default: 9.9312 },
    longitude: { type: Number, default: 76.2673 },
    isBlocked: { type: Boolean, default: false },
    embedding:[Number],
    location: {
  type: {
    type: String,
    enum: ["Point"],
    default: "Point"
  },
  coordinates: {
    type: [Number],
    default: [0, 0]
  }
}
  },
  { timestamps: true }
);
eventSchema.pre<IEvent>("save", function (next) {
  if (this.isNew) {
    this.availableTickets = this.capacity;
  }
  next();
});
eventSchema.index({ location: "2dsphere" });



const EventModel = mongoose.model<IEvent>("Event", eventSchema);

export default EventModel;
