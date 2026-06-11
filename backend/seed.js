
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Charity from './models/Charity.js';

dotenv.config();

const dummyCharities = [
  {
    name: "Global Green Canopy Fund",
    description: "Fighting deforestation by planting verified biodiverse native woodlands.",
    imageUrl: "https:
    upcomingEvents: [{ title: "Annual Charity Golf Day", date: new Date("2026-08-24") }],
    isFeatured: true
  },
  {
    name: "Ocean Cleanse Initiative",
    description: "Deploying localized passive tactical retrieval arrays to clear plastics from marine sanctuaries.",
    imageUrl: "https:
    upcomingEvents: [{ title: "Sanctuary Clean Up Drive", date: new Date("2026-09-12") }],
    isFeatured: false
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");
    
    
    await Charity.deleteMany({});
    
    
    await Charity.insertMany(dummyCharities);
    console.log("Charities collection seeded successfully! 🎉");
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();