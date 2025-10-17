import  { useEffect, useState, type FC } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Users,
  Calendar,
  Activity,
  IndianRupee,
  Download,
  ChevronDown,
} from "lucide-react";
import { adminRepository } from "../../repositories/adminRepositories";
import AdminLayout from "../components/AdminLayout";
import type { IconType } from "react-icons/lib";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { categoryRepository } from "../../repositories/categoryRepository";
declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: IconType;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeEvents, setActiveEvents] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [userGrowth, setUserGrowth] = useState<
    { totalUsers: number; month: number }[]
  >([]);
  const [revenue, setRevenue] = useState(0);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [orders, setOrders] = useState([]);

  const [recentTransactions, setRecentTransactions] = useState<
    {
      amount: number;
      eventStatus: string;
      event: string;
      id: string;
      status: string;
      user: string;
      date: Date;
      organiserName: string;
      organiserEmail: string;
      eventDate: Date;
    }[]
  >([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<
    {
      month: number;
      revenue: number;
      events: number;
    }[]
  >([]);
  const [topEvents, setTopEvents] = useState<
    { title: string; revenue: number; ticketsSold: number }[]
  >([]);
  const [eventCategories, setEventCategories] = useState<
    { name: string; value: number; color: string }[]
  >([]);
  useEffect(() => {
    fetchEvents();
    fetchUsers();
    fetchOrders(selectedTimeframe, fromDate, toDate, selectedCategory);
    fetchCategories();
  }, [selectedTimeframe, selectedCategory, selectedMonth, selectedYear]);
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

  const fetchEvents = async () => {
    try {
      const response = await adminRepository.getDashboard();
      if (
        !response ||
        !response.monthlyRevenue ||
        !response.topEvents ||
        !response.eventCategories ||
        !response.totalRevenue ||
        !response.activeEvents
      ) {
        throw new Error("credentials missing");
      }

      setMonthlyRevenue(response.monthlyRevenue);
      setTopEvents(response.topEvents);
      setEventCategories(response.eventCategories);

      setActiveEvents(response.activeEvents);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Known error:", error.message);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };
  const fetchCategories = async () => {
    const response = await categoryRepository.getCategories();
    console.log("cat", response);

    if (response.cat && Array.isArray(response.cat)) {
      setAvailableCategories(response.cat);
    } else {
      setAvailableCategories([]);
    }
  };

  const fetchUsers = async () => {
    const response = await adminRepository.fetchUsers();

    setUserGrowth(response.data);
    setTotalUsers(response.totalUsers);
  };
  const fetchOrders = async (
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

    const response = await adminRepository.getDashboardOrders(params);
    console.log("resss", response);
    setRecentTransactions(response.result);
    setRevenue(response.totalAdminEarning);
    setOrders(response.salesReport);
  };
  const exportToCSV = (orders: any[], filename: string) => {
    if (!orders || orders.length === 0) {
      console.warn("No data to export");
      return;
    }

    const headers = [
      "Event Title",
      "Event Date",
      "Ticket Price",
      "User Name",
      "Organiser Name",
      "Organiser Email",
      "AdminEarning",
    ];

    const rows = orders.map((order) => [
      order.event,
      order.eventDate ? formatDate(order.eventDate) : "N/A",

      order.ticketPrice,
      order.user,
      order.organiserName,
      order.organiserEmail,

      order.adminEarning / 100,
    ]);

    const totalAdminEarning = orders.reduce(
      (sum, order) => sum + (order.adminEarning || 0),
      0
    );

    const totalRow = [
      "",
      "",
      "",
      "",
      "",
      "Total Admin Earnings",
      "",
      totalAdminEarning.toFixed(2) / 100,
    ];

    const csvContent = [headers, ...rows, totalRow]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = (orders: any[], filename: string) => {
    const doc = new jsPDF();

    const headers = [
      "Event Title",
      "Event Date",
      "Ticket Price",
      "User Name",
      "Organiser Name",
      "Organiser Email",

      "Admin Earning",
    ];

    const rows = orders.map((order) => [
      order.event,
      new Date(order.eventDate).toISOString().split("T")[0],
      order.ticketPrice,
      order.user,
      order.organiserName,
      order.organiserEmail,

      (order.adminEarning / 100).toFixed(2),
    ]);

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [33, 150, 243] },
      margin: { top: 20 },
    });

    doc.setFontSize(14);
    doc.text("Sales Report", 14, 15);

    const totalEarning = orders.reduce(
      (sum, item) => sum + (item.adminEarning || 0),
      0
    );
    doc.setFontSize(12);
    doc.text(
      `Total Admin Earnings: ₹${(totalEarning / 100).toFixed(2)}`,
      14,
      doc.lastAutoTable.finalY + 10
    );

    doc.save(`${filename}.pdf`);
  };

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const StatCard: FC<StatCardProps> = ({ title, value, icon: Icon }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl">
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
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
                fetchOrders(
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
            {availableCategories.map((cat: { _id: string; name: string }) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <button
            className="bg-blue-500 text-white px-6 py-1 rounded-xl hover:bg-blue-700 transition-colors flex items-center"
            onClick={() => exportToCSV(orders, "dashboard_report")}
          >
            <Download size={16} className="mr-2" />
            Export Sales Report
          </button>
          <button
            className="bg-blue-500 text-white px-6 py-.2 rounded-xl hover:bg-red-700 transition-colors flex items-center"
            onClick={() => exportToPDF(orders, "dashboard_report")}
          >
            <Download size={16} className="mr-2" />
            Export PDF Report
          </button>
        </div>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${revenue.toFixed(1)}`}
          icon={IndianRupee}
        />
        <StatCard
          title="Active Events"
          value={`${activeEvents}`}
          icon={Calendar}
        />
        <StatCard title="Total Users" value={totalUsers} icon={Users} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Monthly Revenue & Events
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Event Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Event Categories
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eventCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {eventCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* User Growth Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          User Growth Trend
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="totalUsers"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: "#10B981", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Recent Transactions
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CreatedAt
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                OrganiserName
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                EventDate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PaymentStatus
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{transaction.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {transaction.date.toString().split("T")[0]}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.user}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.organiserName}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.event}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.eventDate.toString().split("T")[0]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{transaction.amount / 100}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : transaction.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-6">
      {/* Top Events */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Top Performing Events
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {topEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        #{index + 1}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {event.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {event.ticketsSold} tickets sold
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ₹{event.revenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Performance Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Event Performance Comparison
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topEvents}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="title"
                stroke="#6b7280"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="ticketsSold" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50  ">
      <AdminLayout>
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">Event Management System</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-full">
                  <Activity className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    System Online
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200 bg-white rounded-t-xl mt-6">
            <nav className="-mb-px flex space-x-8 px-6">
              {["overview", "transactions", "events"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="bg-white rounded-b-xl shadow-sm border border-gray-100 border-t-0 p-6">
            {activeTab === "overview" && renderOverview()}
            {activeTab === "transactions" && renderTransactions()}
            {activeTab === "events" && renderEvents()}
          </div>
        </div>
      </AdminLayout>
    </div>
  );
};

export default AdminDashboard;
