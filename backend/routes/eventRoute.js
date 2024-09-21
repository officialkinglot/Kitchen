import express from "express";
import Event from "../models/eventModel.js"; // Import the Event model

const router = express.Router();

// API endpoint to book an event
router.post("/book", async (req, res) => {
  try {
    const { name, eventVenue, eventType, capacity, eventDate, eventTime, phoneNumber, foodTypes } = req.body;
    const newEvent = new Event({ name, eventVenue, eventType, capacity, eventDate, eventTime, phoneNumber, foodTypes });
    await newEvent.save();

    res.json({ success: true, data: newEvent });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// API endpoint to list all events
router.get("/list", async (req, res) => {
  try {
    const events = await Event.find();
    res.json({ success: true, data: events });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// API endpoint to remove an event
router.post("/remove", async (req, res) => {
  try {
    const { id } = req.body;
    await Event.findByIdAndDelete(id);
    res.json({ success: true, message: "Event removed successfully" });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// API endpoint to update event status
router.post("/updateStatus", async (req, res) => {
  try {
    const { eventId, status } = req.body;
    await Event.findByIdAndUpdate(eventId, { status });
    res.json({ success: true, message: "Event Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
});

export default router;
