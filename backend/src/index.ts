import express, { Application } from "express";
import cors from "cors";

import path from "path";
import { config } from "dotenv";
import cron from "node-cron";

import userRoutes from "./routes/userAuthRoutes";
import organiserRoutes from "./routes/organiserAuthRoutes";
import authRoutes from "./routes/authRoutes";
import eventRoutes from "./routes/userRoutes/eventRoutes";
import eventOrgRoutes from "./routes/organiserRoutes/eventOrgRoutes";
import orgRoutes from "./routes/organiserRoutes/organiserRoutes";
import adminAuthRoutes from "./routes/adminRoutes/adminAuthRoutes";
import adminUserRoutes from "./routes/adminRoutes/adminUserRoutes";
import adminEventRoutes from "./routes/adminRoutes/adminEventRoutes";
import adminOrgRoutes from "./routes/adminRoutes/adminOrganiserRoutes";
import paymentRoutes from "./routes/userRoutes/paymentRoutes";
import chatRoutes from "./routes/chatRoutes";
import userProfileRoutes from "./routes/userRoutes/profileRoutes";
import adminOrderRoutes from "./routes/adminRoutes/adminOrderRoutes";
import adminVenueRoutes from "./routes/adminRoutes/adminVenueRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import messageRoutes from "./routes/messageRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import notificationRoutes from "./routes/notificationRoutes"
import fileRoutes from './routes/fileRoutes'
import adminOfferRoutes from './routes/adminRoutes/adminOfferRoutes'
import offerRoutes from './routes/userRoutes/offerRoutes'

import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import { createServer } from "http";
import { Server } from "socket.io";
import { organiserSocketMap, userSocketMap } from "./socketMap";
import { updateCompletedEvents } from "./job/updateCompletedEvents";
import { messageService } from "./container/messagedi";
import logger from "./utils/logger";
import morgan from 'morgan'

function broadcastOnlineUsers() {
  const onlineUsers = Array.from(userSocketMap.keys());
  io.emit("online-users", onlineUsers);
}


config();
const allowedOrigins = [
  'http://65.0.108.51',     // your EC2 frontend
  'http://localhost:5173',  // optional for local development
  'https://www.eventoo.co.in',      // Your domain (non-www)
  'https://eventoo.co.in',  // Your domain (with www)
  'http://www.eventoo.co.in',
  'http://eventoo.co.in',


];

export const app: Application = express();
const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Socket.IO blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS (Socket.IO)"));
      }
    },
    credentials: true,
  },
});


// Middlewares
app.use(
  morgan('combined', {
    stream: {
      write: (message:string) => logger.http(message.trim()),
    },
  })
);
app.use(express.json());

app.use(cookieParser());
/*app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);*/
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., mobile apps, curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// Static Files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/auth", organiserRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);

app.use("/api/v1/event", eventRoutes);
app.use("/api/v1/event", eventOrgRoutes);
app.use("/api/v1/organiser", orgRoutes);
app.use("/api/v1/user", userProfileRoutes);

app.use("/api/v1/admin", adminAuthRoutes);
app.use("/api/v1/admin", adminUserRoutes);
app.use("/api/v1/admin", adminEventRoutes);
app.use("/api/v1/admin", adminOrgRoutes);
app.use("/api/v1/admin", adminOrderRoutes);
app.use("/api/v1/admin", adminVenueRoutes);
app.use('/api/v1/admin',adminOfferRoutes)
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/message", messageRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/review",reviewRoutes);
app.use("/api/v1/notification",notificationRoutes)
app.use('/',fileRoutes)
app.use('/api/v1/offer',offerRoutes);
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("register-user", (userId: string) => {
    userSocketMap.set(userId, socket.id);
    logger.info(`User ${userId} registered with socket ${socket.id}`);
    broadcastOnlineUsers();
  });
  socket.on("register-organiser", (organiserId: string) => {
    organiserSocketMap.set(organiserId, socket.id);
    logger.info(`Organiser ${organiserId} registered with socket ${socket.id}`);
    broadcastOnlineUsers();
  });
  socket.on("send-message", async (data) => {
    const { senderId, receiverId, message, isOrganiser } = data;
    const savedMessage = await messageService.handleIncomingMessage(
      senderId,
      receiverId,
      message,
      isOrganiser
    );
    const receiverSocketId = isOrganiser
      ? userSocketMap.get(receiverId)
      : organiserSocketMap.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive-message", savedMessage);
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, sId] of userSocketMap.entries()) {
      if (sId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
    for (const [orgId, sId] of organiserSocketMap.entries()) {
      if (sId === socket.id) {
        organiserSocketMap.delete(orgId);
        logger.info(`Organiser ${orgId} disconnected and removed from map`);
        break;
      }
    }
    logger.info("Client disconnected:", socket.id);
    broadcastOnlineUsers();
  });
});

// start server
const PORT = process.env.PORT || 3000;

connectDB()
  .then(async () => {
    await updateCompletedEvents();
    cron.schedule("0 0 * * *", updateCompletedEvents);
    httpServer.listen(Number(PORT), "0.0.0.0", () => {
      logger.info(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("DB connection failed:", err);
  });
