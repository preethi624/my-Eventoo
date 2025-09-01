export interface IOrderDTO{
    _id: string;
    
      userId: string;
      eventId: string
      amount: number;
      currency: string;
      status: string;
      razorpayOrderId: string;
      razorpaySignature: string;
      razorpayPaymentId: string;
      eventTitle: string;
      ticketCount: number;
      createdAt: Date;
      orderId: string;
      bookingStatus: string;
    
      refundId: string;
      email: string;
      bookingNumber?:string;


}