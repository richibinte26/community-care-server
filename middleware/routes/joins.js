import { ObjectId } from "mongodb";
import { getCollection } from "../../config/db.js";
import { verifyToken } from "../verifyToken.js";

export default function joinRoutes(app) {
  // Private: join an event
  app.post("/joins", verifyToken, async (req, res) => {
    const { eventId } = req.body;

    if (!eventId || !ObjectId.isValid(eventId)) {
      return res.status(400).send({ message: "That event link looks wrong." });
    }

    const events = getCollection("events");
    const joins = getCollection("joins");

    const event = await events.findOne({ _id: new ObjectId(eventId) });
    if (!event) {
      return res.status(404).send({ message: "Event not found." });
    }

    // Past events can't be joined
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (event.eventDate < today) {
      return res.status(400).send({ message: "This event has already passed." });
    }

    // One join per user per event
    const alreadyJoined = await joins.findOne({
      eventId,
      userEmail: req.user.email,
    });
    if (alreadyJoined) {
      return res
        .status(409)
        .send({ message: "You have already joined this event." });
    }

    await joins.insertOne({
      eventId,
      userEmail: req.user.email,
      userName: req.user.name,
      title: event.title,
      thumbnail: event.thumbnail,
      location: event.location,
      eventType: event.eventType,
      eventDate: event.eventDate,
      joinedAt: new Date(),
    });

    res.status(201).send({ message: "You have joined the event!" });
  });

  // Private: events joined by the logged-in user, sorted by event date
  app.get("/joins", verifyToken, async (req, res) => {
    const joins = getCollection("joins");
    const data = await joins
      .find({ userEmail: req.user.email })
      .sort({ eventDate: 1 })
      .toArray();
    res.send(data);
  });

  // Private: has this user already joined this event? (for the Join button state)
  app.get("/joins/check/:eventId", verifyToken, async (req, res) => {
    const joins = getCollection("joins");
    const joined = await joins.findOne({
      eventId: req.params.eventId,
      userEmail: req.user.email,
    });
    res.send({ joined: Boolean(joined) });
  });
}