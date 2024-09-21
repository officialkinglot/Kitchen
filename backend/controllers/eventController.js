 import Event from "../models/eventModel.js"; // Import the Event model
import { sendAdminNotification } from "../controllers/orderController.js"; // Import the function to send admin notifications

// API endpoint to book an event
const bookEvent = async (req, res) => {
  try {
    const { name, eventVenue, eventType, capacity, eventDate, eventTime, phoneNumber, foodTypes } = req.body;
    const newEvent = new Event({ name, eventVenue, eventType, capacity, eventDate, eventTime, phoneNumber, foodTypes });
    await newEvent.save();

    // Send SSE to admin
    sendAdminNotification(`New event booked: ${eventVenue} on ${eventDate} by ${name}`);

    res.status(201).json({ success: true, data: newEvent });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// API endpoint to list all events
const listEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// API endpoint to remove an event
const removeEvent = async (req, res) => {
  try {
    const { id } = req.body;
    await Event.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Event removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// API endpoint to update event status
const updateEventStatus = async (req, res) => {
  try {
    const { eventId, status } = req.body;
    await Event.findByIdAndUpdate(eventId, { status });
    res.json({ success: true, message: "Event Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { bookEvent, listEvents, removeEvent, updateEventStatus };
