import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  eventVenue: { type: String, required: true },
  eventType: { type: String, required: true },
  capacity: { type: String, required: true },
  eventDate: { type: String, required: true },
  status:{type:String,default:"Pending"},
  eventTime: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  foodTypes: { type: String, required: true}
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);

export default Event;
