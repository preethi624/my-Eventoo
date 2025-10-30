
/*export interface IEventImage {
  url: string;
  public_id: string | null;
}

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  time: string;
  venue: string;
  category: string;
  ticketPrice: number;
  capacity: number;
  images: (string|IEventImage)[];
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
    images: {
      type: [Schema.Types.Mixed],  
      default: [],
    },
    organiser: { type: mongoose.Schema.Types.ObjectId, ref: "Organiser" },
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

export default EventModel;*/
import mongoose, { Document, Schema } from "mongoose";

export interface IEventImage {
  url: string;
  public_id: string | null;
}

export interface ITicketType {
  type?: string;     
  price: number;    
  capacity: number; 
  sold: number;     
}

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  time: string;
  venue:string;

  category: string;
  ticketPrice?: number;  
  capacity?: number;    
  ticketTypes: ITicketType[]; 
  images: (string | IEventImage)[];
  organiser: mongoose.Types.ObjectId;
  status: "draft" | "published" | "completed" | "cancelled";
  availableTickets: number;
  ticketsSold: number;
  createdAt: Date;
  latitude: number;
  longitude: number;
  isBlocked: boolean;
  embedding: number[];
  location: {
    type: "Point";
    coordinates: [number, number];
  };
}

const ticketTypeSchema = new Schema(
  {
    type: { type: String, required: true },
    price: { type: Number, required: true },
    capacity: { type: Number, required: true },
    sold: { type: Number, default: 0 },
  },
  { _id: false }
);

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

    ticketTypes: {
      type: [ticketTypeSchema],
      default: [],
    },

    ticketPrice: { type: Number },
    capacity: { type: Number },

    images: {
      type: [Schema.Types.Mixed],
      default: [],
    },
    organiser: { type: mongoose.Schema.Types.ObjectId, ref: "Organiser" },
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
    embedding: [Number],
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
  },
  { timestamps: true }
);

eventSchema.pre<IEvent>("save", function (next) {
  
  if (this.ticketTypes.length === 0 && this.ticketPrice && this.capacity) {
    this.ticketTypes = [
      {
        type: "General",
        price: this.ticketPrice,
        capacity: this.capacity,
        sold: this.ticketsSold || 0,
      },
    ];
  }

  
  this.availableTickets = this.ticketTypes.reduce(
    (acc, t) => acc + t.capacity,
    0
  );
  this.ticketsSold = this.ticketTypes.reduce((acc, t) => acc + t.sold, 0);

  next();
});

eventSchema.index({ location: "2dsphere" });

const EventModel = mongoose.model<IEvent>("Event", eventSchema);

export default EventModel;
