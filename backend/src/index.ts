import express, { Application } from 'express';
import cors from 'cors';

import path from 'path';
import { config } from 'dotenv';


import userRoutes from './routes/userAuthRoutes';
import organiserRoutes from './routes/organiserAuthRoutes';
import authRoutes from './routes/authRoutes';
import eventRoutes from './routes/userRoutes/eventRoutes'
import eventOrgRoutes from './routes/organiserRoutes/eventOrgRoutes';
import orgRoutes from './routes/organiserRoutes/organiserRoutes';
import adminAuthRoutes from './routes/adminRoutes/adminAuthRoutes';
import adminUserRoutes from './routes/adminRoutes/adminUserRoutes';
import adminEventRoutes from './routes/adminRoutes/adminEventRoutes';
import adminOrgRoutes from './routes/adminRoutes/adminOrganiserRoutes';
import paymentRoutes from './routes/userRoutes/paymentRoutes';
import chatRoutes from './routes/chatRoutes';
import userProfileRoutes from './routes/userRoutes/profileRoutes'





import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { organiserSocketMap, userSocketMap } from './socketMap';




//import refreshRoutes from './routes/refreshRoutes';

// Load .env variables
config();

const app: Application = express();
const httpServer=createServer(app);
export const io=new Server(httpServer,{
  cors: {
    origin: 'http://localhost:5173', 
    credentials: true
  }
})

// Middleware
app.use(express.json());

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});


// Static Files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth',userRoutes );
app.use('/api/auth',organiserRoutes );
app.use('/api/auth',authRoutes)


app.use('/api/event',eventRoutes);
app.use('/api/event',eventOrgRoutes)
app.use('/api/organiser',orgRoutes);
app.use('/api/user',userProfileRoutes)


app.use('/api/admin', adminAuthRoutes);
app.use('/api/admin',adminUserRoutes);
app.use('/api/admin',adminEventRoutes);
app.use('/api/admin',adminOrgRoutes);
app.use('/api/payment',paymentRoutes);
app.use('/api/chat',chatRoutes);
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  
  socket.on('register-user', (userId: string) => {
    userSocketMap.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });
  socket.on('register-organiser', (organiserId: string) => {
    organiserSocketMap.set(organiserId, socket.id);
    console.log(`Organiser ${organiserId} registered with socket ${socket.id}`);
  });

  socket.on('disconnect', () => {
   
    for (const [userId, sId] of userSocketMap.entries()) {
      if (sId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
     for (const [orgId, sId] of organiserSocketMap.entries()) {
      if (sId === socket.id) {
        organiserSocketMap.delete(orgId);
        console.log(`Organiser ${orgId} disconnected and removed from map`);
        break;
      }
    }
    console.log('Client disconnected:', socket.id);
  });
});


// Start Server
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('DB connection failed:', err);
  });
