import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoute from './routes/auth.js'; 
import usersRoute from './routes/users.js'; 
import hotelsRoute from './routes/hotels.js'; 
import bookingsRoute from './routes/bookings.js';
import roomsRoute from './routes/rooms.js'
import reviewsRoute from './routes/reviews.js'
import cors from 'cors';
import Hotel from './models/Hotel.js';
import Room from './models/Room.js';
import { seededHotels } from './seed.js';

const app = express(); 
dotenv.config();


const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('connected  ')
    } catch (error) {
        throw error
    }    
}

mongoose.connection.on('disconnected', () => {
    console.log("disconnected!!!")
})

// middlewares

var corsOptions = {
    origin: "https://hotelstays.onrender.com"
}
// uncomment the below code when in development mode, comment it out in production
// var corsOptions = {
//     origin: "http://localhost:3000"
// }
app.use(express.json());
app.use(cors(corsOptions));

app.use('/api/auth/', authRoute);
app.use('/api/users/', usersRoute);
app.use('/api/hotels/', hotelsRoute);
app.use('/api/users/', bookingsRoute);
app.use('/api/hotels/', roomsRoute);
app.use('/api/reviews/', reviewsRoute);

const PORT = process.env.PORT || 8800;

app.listen(PORT, () => {
    connect(); 
    // Hotel.insertMany(seededHotels);
})