import { ObjectId } from "mongodb";
import { getCollection } from "../../config/db.js";
import { verifyToken } from "../verifyToken.js";

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export default function eventRoutes(app) {
  // Public: upcoming events only, soonest first
  app.get("/events", async (req, res) => {
    const events = getCollection("events");
    const limit = parseInt(req.query.limit) || 0;
    const { type, search } = req.query;

    const query = { eventDate: { $gte: startOfToday() } };
    if (type) query.eventType = type;
    if (search) query.title = { $regex: search, $options: "i" };

    const data = await events
      .find(query)
      .sort({ eventDate: 1 })
      .limit(limit)
      .toArray();
    res.send(data);
  });

  // Public: single event details
  app.get("/events/:id", async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).send({ message: "That event link looks wrong." });
    }
    const events = getCollection("events");
    const event = await events.findOne({ _id: new ObjectId(req.params.id) });
    if (!event) return res.status(404).send({ message: "Event not found." });
    res.send(event);
  });

  // Private: events created by the logged-in user
  app.get("/my-events", verifyToken, async (req, res) => {
    const events = getCollection("events");
    const data = await events
      .find({ creatorEmail: req.user.email })
      .sort({ eventDate: 1 })
      .toArray();
    res.send(data);
  });

    // Private: create an event (date must be in the future)
  app.post("/events", verifyToken, async (req, res) => {
    const { title, description, eventType, thumbnail, location, eventDate } =
      req.body;

    if (!title || !description || !eventType || !thumbnail || !location || !eventDate) {
      return res.status(400).send({ message: "Please fill in every field." });
    }

    const date = new Date(eventDate);
    if (isNaN(date) || date < startOfToday()) {
      return res.status(400).send({ message: "Event date must be in the future." });
    }

    const events = getCollection("events");
    const result = await events.insertOne({
      title: title.trim(),
      description: description.trim(),
      eventType,
      thumbnail: thumbnail.trim(),
      location: location.trim(),
      eventDate: date,
      creatorEmail: req.user.email,
      creatorName: req.user.name,
      createdAt: new Date(),
    });

    res.status(201).send({ insertedId: result.insertedId });
  });
}