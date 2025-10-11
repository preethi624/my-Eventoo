import { useEffect, useState, type FC } from "react";
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
  Sparkles,
  FileText,
  Filter,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/stroe";
import type { CustomJwtPayload } from "../../interfaces/IUser";
import { organiserRepository } from "../../repositories/organiserRepositories";

import type { IEventDTO } from "../../interfaces/IEvent";
import OrganiserLayout from "../components/OrganiserLayout";
import type { IconType } from "react-icons/lib";
import { categoryRepository } from "../../repositories/categoryRepository";
import OrganiserFooter from "../components/OrganiserFooter";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: IconType;
  gradient: string;
  trend?: string;
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
    console.log("response", response);

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
    formattedOrders.push({
      OrderID: "",
      Buyer: "",
      Email: "",
      Event: "",
      EventDate: "",
      OrderDate: "",
      Quantity: "",
      totalAmount: "",
      AdminCommission: "",
      OrganiserEarning: "",
    });
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
      color: [
        "#3B82F6",
        "#10B981",
        "#F59E0B",
        "#EF4444",
        "#8B5CF6",
        "#EC4899",
        "#14B8A6",
      ][index % 7],
    })
  );

  const StatCard: FC<StatCardProps> = ({
    title,
    value,
    icon: Icon,
    gradient,
    trend,
  }) => (
    <div className="group relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-slate-700/50 hover:shadow-2xl hover:border-blue-500/50 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${gradient}`}></div>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">
              {title}
            </p>
            <h3 className="text-4xl font-bold text-white">
              {value}
            </h3>
            {trend && (
              <p className="text-emerald-400 text-sm font-semibold mt-2 flex items-center gap-1">
                <TrendingUp size={14} />
                {trend}
              </p>
            )}
          </div>
          <div className={`${gradient} p-4 rounded-2xl shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
            <Icon className="text-white" size={28} />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );

  return (
    <OrganiserLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 ">
        {/* Modern Dark Header */}
        <div className="relative overflow-hidden border-b border-slate-700/50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
          
          <div className="relative max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-50 animate-pulse"></div>
                  <img
                    src={
                      profileImage
                        ? `http://localhost:3000/uploads/${profileImage}`
                        : "https://dummyimage.com/128x128/cccccc/ffffff&text=Organiser"
                    }
                    alt={organiserData.name}
                    className="relative w-20 h-20 rounded-full border-4 border-slate-700 shadow-2xl object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-slate-800 shadow-lg"></div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-4xl font-bold text-white">
                      Dashboard
                    </h1>
                    <Sparkles className="text-yellow-400 animate-pulse" size={24} />
                  </div>
                  <p className="text-gray-400 text-lg">
                    Welcome back, <span className="font-semibold text-blue-400">{organiserData.name}</span>! 
                    <span className="ml-2">🚀</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {/* Dark Filters Section */}
          <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-700/50 hover:border-blue-500/30 transition-all duration-500">
            <div className="flex items-center gap-3 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur opacity-50"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Filter className="text-white" size={22} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Smart Filters</h3>
                <p className="text-gray-400 text-sm">Customize your data view</p>
              </div>
            </div>

            {/* Month & Year Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-300 tracking-wide uppercase flex items-center gap-2">
                  <Calendar size={16} className="text-blue-400" />
                  Select Month
                </label>
                <div className="relative group">
                  <select
                    className="w-full bg-slate-700/50 border-2 border-slate-600/50 rounded-2xl px-6 py-4 text-white font-medium focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 appearance-none cursor-pointer hover:border-blue-400 hover:bg-slate-700"
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
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <ChevronDown className="text-white" size={16} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-300 tracking-wide uppercase flex items-center gap-2">
                  <Calendar size={16} className="text-purple-400" />
                  Select Year
                </label>
                <div className="relative group">
                  <input
                    type="number"
                    className="w-full bg-slate-700/50 border-2 border-slate-600/50 rounded-2xl px-6 py-4 text-white font-medium focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-300 hover:border-purple-400 hover:bg-slate-700 placeholder-gray-500"
                    placeholder="e.g. 2025"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    min="2000"
                    max="2099"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                      <Calendar className="text-white" size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Date Range & Quick Filters */}
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px] space-y-2">
                <label className="text-sm font-semibold text-gray-300">From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full bg-slate-700/50 border-2 border-slate-600/50 rounded-xl px-4 py-3 text-white focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="flex-1 min-w-[200px] space-y-2">
                <label className="text-sm font-semibold text-gray-300">To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full bg-slate-700/50 border-2 border-slate-600/50 rounded-xl px-4 py-3 text-white focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
              </div>

              <select
                className="px-5 py-3 bg-slate-700/50 border-2 border-slate-600/50 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 font-medium hover:border-blue-400 transition-all text-white min-w-[150px]"
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
                className="px-5 py-3 bg-slate-700/50 border-2 border-slate-600/50 rounded-xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 font-medium hover:border-purple-400 transition-all text-white min-w-[180px]"
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
                onClick={() =>
                  fetchEvents(
                    selectedTimeframe,
                    fromDate,
                    toDate,
                    selectedCategory
                  )
                }
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Apply Filters
              </button>
            </div>

            {/* Export Buttons */}
            <div className="flex gap-4 mt-6 pt-6 border-t border-slate-700/50">
              <button
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-6 py-4 rounded-2xl hover:from-emerald-700 hover:to-teal-800 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
                onClick={() =>
                  exportToCSV(orders, "dashboard_report", adminPercentage)
                }
              >
                <FileText size={20} />
                Export CSV Report
              </button>
              <button
                className="flex-1 bg-gradient-to-r from-rose-600 to-pink-700 text-white px-6 py-4 rounded-2xl hover:from-rose-700 hover:to-pink-800 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
                onClick={() =>
                  exportToPDF(orders, "dashboard_report", adminPercentage)
                }
              >
                <Download size={20} />
                Export PDF Report
              </button>
            </div>

            <div className="mt-6 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-50"></div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Total Events"
              value={totalEvents.toString()}
              icon={Calendar}
              gradient="bg-gradient-to-br from-blue-500 to-blue-600"
              trend="+12% this month"
            />
            <StatCard
              title="Total Attendees"
              value={totalAttendees.toLocaleString()}
              icon={Users}
              gradient="bg-gradient-to-br from-purple-500 to-purple-600"
              trend="+8% this month"
            />
            <StatCard
              title="Revenue Earned"
              value={`₹${organiserEarning.toLocaleString()}`}
              icon={IndianRupee}
              gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
              trend="+23% this month"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-700/50 hover:border-blue-500/30 transition-all duration-500">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Revenue Analytics</h3>
                  <p className="text-gray-400 text-sm">Track your earnings over time</p>
                </div>
                <div className="flex items-center gap-3 bg-blue-500/20 px-4 py-2 rounded-full border border-blue-500/30">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-blue-400">Live Data</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={320}>
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
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#9CA3AF"
                    style={{ fontSize: '12px', fontWeight: 600 }}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    style={{ fontSize: '12px', fontWeight: 600 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "16px",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                      padding: "12px 16px",
                      color: "#fff"
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

            {/* Event Types Pie Chart */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-700/50 hover:border-purple-500/30 transition-all duration-500">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-1">Event Distribution</h3>
                <p className="text-gray-400 text-sm">By category</p>
              </div>
              {eventTypeData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={eventTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {eventTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #475569",
                          borderRadius: "12px",
                          color: "#fff"
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-6 space-y-3">
                    {eventTypeData.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-all border border-slate-600/30"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full shadow-md"
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-sm font-semibold text-gray-200">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-white bg-slate-700/50 px-3 py-1 rounded-full">
                          {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <Calendar size={48} className="mx-auto mb-4 opacity-30" />
                    <p className="font-semibold text-gray-400">No events yet</p>
                    <p className="text-sm text-gray-500">Create your first event</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Events & Top Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Events */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-700/50 hover:border-blue-500/30 transition-all duration-500">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Upcoming Events</h3>
                  <p className="text-gray-400 text-sm">Your scheduled events</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="text-white" size={20} />
                </div>
              </div>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <div
                      key={event._id}
                      className="group relative bg-slate-700/30 rounded-2xl p-5 hover:bg-slate-700/50 transition-all duration-300 border border-slate-600/30 hover:border-blue-500/50"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-white text-lg mb-3 group-hover:text-blue-400 transition-colors">
                            {event.title}
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-300">
                              <div className="w-8 h-8 bg-slate-600/50 rounded-lg flex items-center justify-center mr-2">
                                <Calendar size={14} className="text-blue-400" />
                              </div>
                              <span className="font-medium">{formatDate(event.date.toString())}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-300">
                              <div className="w-8 h-8 bg-slate-600/50 rounded-lg flex items-center justify-center mr-2">
                                <Clock size={14} className="text-purple-400" />
                              </div>
                              <span className="font-medium">{event.time}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-300">
                              <div className="w-8 h-8 bg-slate-600/50 rounded-lg flex items-center justify-center mr-2">
                                <MapPin size={14} className="text-pink-400" />
                              </div>
                              <span className="font-medium">{event.venue}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-emerald-400 mb-2">
                            ₹{(event.ticketPrice ?? event.ticketTypes[0]?.price ?? 0).toLocaleString()}
                          </div>
                          <div
                            className={`inline-block px-4 py-2 rounded-full text-xs font-bold shadow-md ${
                              event.status === "published"
                                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                                : "bg-gradient-to-r from-yellow-500 to-orange-600 text-white"
                            }`}
                          >
                            {event.status}
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 text-gray-500">
                    <div className="w-20 h-20 bg-slate-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar size={40} className="text-gray-600" />
                    </div>
                    <p className="font-semibold text-lg text-gray-400">No upcoming events</p>
                    <p className="text-sm mt-2 text-gray-500">Create your next event to see it here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Top Performing Events */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-700/50 hover:border-yellow-500/30 transition-all duration-500">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Top Performers</h3>
                  <p className="text-gray-400 text-sm">Best earning events</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="text-white" size={20} />
                </div>
              </div>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {topEvents.length > 0 ? (
                  topEvents.map((event, index) => (
                    <div
                      key={index}
                      className="group relative bg-slate-700/30 rounded-2xl p-5 hover:bg-slate-700/50 transition-all duration-300 border border-slate-600/30 hover:border-yellow-500/50"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="relative">
                            <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                              {index + 1}
                            </div>
                            {index === 0 && (
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-xs">👑</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-white text-base mb-1 group-hover:text-orange-400 transition-colors">
                              {event.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <Users size={12} />
                              <span>{event.ticketsSold} tickets sold</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-emerald-400">
                            ₹
                            {(
                              event.ticketPrice * event.ticketsSold -
                              (event.ticketPrice *
                                event.ticketsSold *
                                adminPercentage) /
                                100
                            ).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-400 font-medium mt-1">
                            Your earnings
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 text-gray-500">
                    <div className="w-20 h-20 bg-slate-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp size={40} className="text-gray-600" />
                    </div>
                    <p className="font-semibold text-lg text-gray-400">No performance data</p>
                    <p className="text-sm mt-2 text-gray-500">Host events to see top performers</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Custom Scrollbar Styles */}
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #1e293b;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #3b82f6, #8b5cf6);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #2563eb, #7c3aed);
          }
        `}</style>
      </div>
      <OrganiserFooter/>
    </OrganiserLayout>
  );
};

export default Dashboard;