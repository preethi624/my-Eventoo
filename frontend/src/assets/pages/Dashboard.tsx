import React, { useEffect, useState, type FC } from "react";
import { unparse } from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Calendar,
  Users,
  TrendingUp,
  MapPin,
  Clock,
  Download,
  IndianRupee,
  ChevronDown,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/stroe";
import type { CustomJwtPayload } from "../../interfaces/IUser";
import { organiserRepository } from "../../repositories/organiserRepositories";

import type { IEventDTO } from "../../interfaces/IEvent";
import OrganiserLayout from "../components/OrganiserLayout";
import type { IconType } from "react-icons/lib";
import { categoryRepository } from "../../repositories/categoryRepository";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: IconType;
}

const Dashboard = () => {
  const organiser = useSelector(
    (state: RootState) => state.auth.user as CustomJwtPayload
  );
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");
  const [adminPercentage, setAdminPercentage] = useState(0);
  const [revenueData, setRevenueData] = useState<
    { month: string; revenue: number }[]
  >([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [organiserData, setOrganiserData] = useState({
    name: "",
    location: "",
    email: "",
    phone: 0,
    aboutMe: "",
  });
  const [organiserEarning, setOrganiserEarning] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalAttendees, setTotalAttendees] = useState(0);
  const [profileImage, setProfileImage] = useState(
    organiser?.profileImage || ""
  );
  const [events, setEvents] = useState<IEventDTO[]>([]);
  const [topEvents, setTopEvents] = useState<IEventDTO[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<IEventDTO[]>([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchOrganiser = async () => {
    const response = await organiserRepository.getOrganiserById(organiser.id);

    setOrganiserData(response.result.result);
    setProfileImage(response.result.result.profileImage);
  };
  const months = [
    { value: "", label: "All Months" },
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ];

  const fetchEvents = async (
    timeFrame: string,
    startDate?: string,
    endDate?: string,
    selectedCategory?: string
  ) => {
    const params: Record<string, string> = { timeframe: timeFrame };
    if (startDate && endDate) {
      params.startDate = startDate;
      params.endDate = endDate;
    }
    if (selectedCategory) {
      params.selectedCategory = selectedCategory;
    }
    if (selectedMonth) {
      params.selectedMonth = selectedMonth;
    }
    if (selectedYear) {
      params.selectedYear = selectedYear;
    }

    const response = await organiserRepository.getDashboardEvents(
      organiser.id,
      params
    );
    console.log("respoo", response);

    setEvents(response.data.events);
    setRevenueData(response.data.data);
    setOrganiserEarning(response.data.organiserEarning);
    setAdminPercentage(response.data.adminPercentage);
    setTotalEvents(response.data.totalEvents);
    setTotalAttendees(response.data.totalAttendees);
    setTopEvents(response.data.topEvents);
    setUpcomingEvents(response.data.upcomingEvents);
    setOrders(response.data.orderDetails);
  };

  useEffect(() => {
    fetchOrganiser();
    fetchEvents(selectedTimeframe, fromDate, toDate, selectedCategory);
    fetchCategories();
  }, [selectedTimeframe, selectedCategory, selectedMonth, selectedYear]);
  const fetchCategories = async () => {
    const response = await categoryRepository.getCategories();
    console.log("cat", response);

    if (response.cat && Array.isArray(response.cat)) {
      setAvailableCategories(response.cat);
    } else {
      setAvailableCategories([]);
    }
  };

  const exportToCSV = (
    orders: any[],
    filename: string,
    adminPercentage: number
  ) => {
    console.log("orders", orders);

    let totalEarnings = 0;
    const today = new Date();
    const formattedOrders = [...orders]
      .sort(
        (a, b) =>
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
      )

      .map((order) => {
        const rawAmount = Number(order.amount);
        const totalAmount = isNaN(rawAmount) ? 0 : rawAmount / 100;

        const commission = (totalAmount * adminPercentage) / 100;
        const organiserEarning = totalAmount - commission;
        if (new Date(order.eventDate) < today) {
          totalEarnings += organiserEarning;
        }

        return {
          OrderID: order._id,
          Buyer: order.username,
          Email: order.email,
          Event: order.eventTitle,
          EventDate: order.eventDate ? formatDate(order.eventDate) : "N/A",
          OrderDate: order.orderDate ? formatDate(order.orderDate) : "N/A",

          Quantity: order.ticketCount,
          totalAmount: `₹${order.amount / 100}`,
          AdminCommission: `₹${commission.toFixed(2)} (${adminPercentage}%)`,
          OrganiserEarning: `₹${organiserEarning.toFixed(2)}`,
        };
      });
    formattedOrders.push({});
    formattedOrders.push({
      OrderID: "",
      Buyer: "",
      Email: "",
      Event: "",
      EventDate: "",
      OrderDate: "",
      Quantity: "",
      totalAmount: "",
      AdminCommission: "Total Earnings:",
      OrganiserEarning: `₹${totalEarnings.toFixed(2)}`,
    });

    const csv = unparse(formattedOrders);

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.click();
  };
  const exportToPDF = (
    orders: any[],
    filename: string,
    adminPercentage: number
  ) => {
    const doc = new jsPDF();
    const today = new Date();

    let totalEarnings = 0;

    const tableRows = orders.map((order) => {
      const rawAmount = Number(order.amount);
      const totalAmount = isNaN(rawAmount) ? 0 : rawAmount / 100;

      const validAdminPercentage = isNaN(adminPercentage)
        ? 0
        : Number(adminPercentage);

      const commission = (totalAmount * validAdminPercentage) / 100;
      const organiserEarning = totalAmount - commission;
      const eventDate = new Date(order.eventDate);
      if (!isNaN(eventDate.getTime()) && eventDate < today) {
        totalEarnings += organiserEarning;
      }

      return [
        order._id || "",
        order.username || "",
        order.email || "",
        order.eventTitle || "",
        order.eventDate ? formatDate(order.eventDate) : "N/A",
        order.orderDate ? formatDate(order.orderDate) : "N/A",
        order.ticketCount ?? "",
        `₹${totalAmount.toFixed(2)}`,
        `₹${commission.toFixed(2)} (${validAdminPercentage}%)`,
        `₹${organiserEarning.toFixed(2)}`,
      ];
    });
    tableRows.push([]);
    tableRows.push([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Total Earnings:",
      `₹${totalEarnings.toFixed(2)}`,
    ]);

    const tableHeaders = [
      "Order ID",
      "Buyer",
      "Email",
      "Event",
      "Event Date",
      "Order Date",
      "Qty",
      "Total",
      "Admin Commission",
      "Earnings",
    ];

    doc.setFontSize(18);
    doc.text("Sales Report", 14, 22);
    doc.setFontSize(12);

    autoTable(doc, {
      startY: 30,
      head: [tableHeaders],
      body: tableRows,
      styles: { font: "helvetica", fontSize: 9 },
      headStyles: { fillColor: [33, 150, 243] },
    });

    doc.save(`${filename}.pdf`);
  };

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Event type distribution for organizer's events
  const eventTypeCounts = events.reduce(
    (acc: Record<string, number>, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    },
    {}
  );

  const eventTypeData = Object.entries(eventTypeCounts).map(
    ([type, count], index) => ({
      name: type,
      value: Math.round((count / totalEvents) * 100),
      color: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"][index % 5],
    })
  );

  const StatCard: FC<StatCardProps> = ({ title, value, icon: Icon }) => (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl">
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <OrganiserLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center">
            <img
              src={
                profileImage
                  ? `http://localhost:3000/uploads/${profileImage}`
                  : "https://dummyimage.com/128x128/cccccc/ffffff&text=Organiser"
              }
              alt={organiserData.name}
              className="w-16 h-16 rounded-full border-4 border-white shadow-lg mr-4"
            />
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-1">
                My Events Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back, {organiserData.name}! Here are your event
                insights.
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30 mb-12 hover:shadow-3xl transition-all duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="text-white" size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Time Period Filters
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Month Filter */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 tracking-wide uppercase">
                  Select Month
                </label>
                <div className="relative group">
                  <select
                    className="w-full bg-white/90 backdrop-blur-sm border-2 border-gray-200/60 rounded-2xl px-6 py-4 text-gray-800 font-medium focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 appearance-none cursor-pointer hover:border-blue-400 hover:shadow-lg group-hover:bg-white"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                      <ChevronDown className="text-white" size={14} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Year Filter */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 tracking-wide uppercase">
                  Select Year
                </label>
                <div className="relative group">
                  <input
                    type="number"
                    className="w-full bg-white/90 backdrop-blur-sm border-2 border-gray-200/60 rounded-2xl px-6 py-4 text-gray-800 font-medium focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 hover:border-blue-400 hover:shadow-lg group-hover:bg-white placeholder-gray-400"
                    placeholder="e.g. 2025"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    min="2000"
                    max="2099"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center shadow-md opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                      <Calendar className="text-white" size={12} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative gradient line */}
            <div className="mt-6 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-20"></div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 mt-10 ">
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <div className="flex gap-3 items-center">
                <label className="text-sm">From:</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border px-2 py-1 rounded"
                />

                <label className="text-sm ml-2">To:</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border px-2 py-1 rounded"
                />

                <button
                  onClick={() =>
                    fetchEvents(
                      selectedTimeframe,
                      fromDate,
                      toDate,
                      selectedCategory
                    )
                  }
                  className="bg-blue-500  text-white px-4 py-1 rounded hover:bg-blue-700 text-sm ml-2"
                >
                  Apply
                </button>
              </div>

              <select
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {availableCategories.map(
                  (cat: { _id: string; name: string }) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  )
                )}
              </select>
              <button
                className="bg-blue-500 text-white px-6 py-1 rounded-xl hover:bg-blue-700 transition-colors flex items-center"
                onClick={() =>
                  exportToCSV(orders, "dashboard_report", adminPercentage)
                }
              >
                <Download size={16} className="mr-2" />
                Export Sales Report
              </button>
              <button
                className="bg-blue-500 text-white px-6 py-.2 rounded-xl hover:bg-red-700 transition-colors flex items-center"
                onClick={() =>
                  exportToPDF(orders, "dashboard_report", adminPercentage)
                }
              >
                <Download size={16} className="mr-2" />
                Export PDF Report
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="My Total Events"
              value={totalEvents.toString()}
              icon={Calendar}
            />
            <StatCard
              title="Total Attendees"
              value={totalAttendees.toLocaleString()}
              icon={Users}
            />
            <StatCard
              title="My Revenue"
              value={`₹${organiserEarning.toFixed(1)}`}
              icon={IndianRupee}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  My Revenue Overview
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  <span className="text-sm text-gray-600">
                    Revenue from my events
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={revenueData.map((d) => ({
                    ...(d as { month: string; revenue: number }),
                    revenue: d.revenue / 100,
                  }))}
                >
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Event Types */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                My Event Types
              </h3>
              {eventTypeData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={eventTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {eventTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {eventTypeData.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full mr-3`}
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-sm text-gray-600">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-sm font-medium">
                          {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No events created yet</p>
                    <p className="text-sm">
                      Create your first event to see analytics
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Upcoming Events */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  My Upcoming Events
                </h3>
              </div>
              <div className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <div
                      key={event._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {event.title}
                        </h4>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Calendar size={14} className="mr-1" />
                          <span>{formatDate(event.date.toString())}</span>
                          <Clock size={14} className="ml-3 mr-1" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <MapPin size={14} className="mr-1" />
                          <span>{event.venue}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-green-600 font-medium">
                          ₹{event.ticketPrice.toLocaleString()}
                        </div>
                        <div
                          className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${
                            event.status === "published"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {event.status}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No upcoming events</p>
                    <p className="text-sm">
                      Create your next event to see it here
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Top Performing Events */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                My Top Performing Events
              </h3>
              <div className="space-y-4">
                {topEvents.length > 0 ? (
                  topEvents.map((event, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl w-10 h-10 flex items-center justify-center font-bold mr-4">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {event.title}
                          </h4>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">
                          ₹
                          {(
                            event.ticketPrice * event.ticketsSold -
                            (event.ticketPrice *
                              event.ticketsSold *
                              adminPercentage) /
                              100
                          ).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No performance data yet</p>
                    <p className="text-sm">
                      Host some events to see top performers
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </OrganiserLayout>
  );
};

export default Dashboard;
