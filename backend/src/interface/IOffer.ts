import { IOffer, IOfferImage } from "src/model/offer";

export interface FormDataType {
  title: string;
  code: string;
  description: string;
  discountType: "percentage" | "flat";
  discountValue: string;
  minOrderAmount: string;
  maxDiscountAmount: string;
  startDate: string;
  endDate: string;
  usageLimit: string;
  images: FileList | IOfferImage[] | [];
}
export interface OfferFetch{
  totalPages?:number;
  currentPage?:number
  offers?:IOffer[];
  success?:boolean;
  message?:string;
}