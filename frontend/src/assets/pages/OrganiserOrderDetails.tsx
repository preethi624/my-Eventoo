import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  CreditCard,
  AlertCircle,
  User,
  Mail,
  Phone,
} from "lucide-react";

import type { IOrder } from "../../interfaces/IOrder";

import { organiserRepository } from "../../repositories/organiserRepositories";
import OrganiserLayout from "../components/OrganiserLayout";

const OrgOrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      if (!orderId) throw new Error("Invalid order or user ID");
      const response = await organiserRepository.getOrderDetails(orderId);
      console.log("respooo", response);

      if (!response.success) throw new Error("Failed to fetch order details");
      setOrder(response.order);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch order details"
      );
    } finally {
      setLoading(false);
    }
  };

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{error || "Order not found"}</p>
          <button
            onClick={() => navigate("/my-bookings")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <OrganiserLayout>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-start">
                <img
                  src={getEventImage(order)}
                  alt={
                    typeof order.eventId !== "string" ? order.eventId.title : ""
                  }
                  className="w-60 h-60 object-cover rounded-lg"
                />
                <div className="ml-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {typeof order.eventId !== "string"
                      ? order.eventId.title
                      : ""}
                  </h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-10 h-10 mr-2" />
                      <span>
                        {formatDate(
                          typeof order.eventId !== "string"
                            ? order.eventId.date.toString()
                            : ""
                        )}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-10 h-10 mr-2" />
                      <span>
                        {typeof order.eventId !== "string"
                          ? order.eventId.venue
                          : ""}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-10 h-10 mr-2" />
                      <span>{order.ticketCount} tickets</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <CreditCard className="w-10 h-10 mr-2" />
                      <span>Amount:{order.amount / 100} </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-start">
                  <div className="ml-6">
                    <div className="ml-6">
                      <h3 className="text-2xl font-bold text-gray-900">
                        Purchased By...
                      </h3>

                      <div className="flex items-center text-gray-600">
                        <User className="w-10 h-10 mr-2" />
                        <p className="text-gray-900">
                          {typeof order.userId !== "string"
                            ? order.userId.name
                            : ""}
                        </p>
                      </div>

                      <div className="mt-2 space-y-2">
                        <div className="flex items-center text-gray-600">
                          <Mail className="w-10 h-10 mr-2" />
                          <p>
                            {typeof order.userId !== "string"
                              ? order.userId.email
                              : ""}
                          </p>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-10 h-10 mr-2" />
                          <span>
                            {typeof order.userId !== "string"
                              ? order.userId.location
                              : ""}
                          </span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <Phone className="w-10 h-10 mr-2" />
                          <span>
                            {typeof order.userId !== "string"
                              ? order.userId.phone
                              : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OrganiserLayout>
  );
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getEventImage = (order: IOrder) => {
  if (order.eventId) {
    const imagePath =
      typeof order.eventId != "string"
        ? order.eventId.images[0].replace(/\\/g, "/")
        : "";
    return `http://localhost:3000/${imagePath}`;
  }
  return "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop&auto=format";
};

export default OrgOrderDetailsPage;
