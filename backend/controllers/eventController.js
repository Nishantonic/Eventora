// controllers/eventController.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getEvents = async (req, res) => {
  const { search, location, date } = req.query;
  let where = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (location) {
    where.location = { equals: location, mode: "insensitive" };
  }
  if (date) {
    where.date = { gte: new Date(date) };
  }
  const events = await prisma.event.findMany({ where });
  res.json(events);
};

export const getEventById = async (req, res) => {
  const event = await prisma.event.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  if (!event) return res.status(404).json({ msg: "Event not found" });
  res.json(event);
};

export const createEvent = async (req, res) => {
  const { total_seats, ...rest } = req.body;
  if (!total_seats) return res.status(400).json({ msg: "Total seats required" });
  const event = await prisma.event.create({
    data: {
      ...rest,
      total_seats,
      available_seats: total_seats,
    },
  });
  res.json(event);
};

export const updateEvent = async (req, res) => {
  const event = await prisma.event.update({
    where: { id: parseInt(req.params.id) },
    data: req.body,
  });
  res.json(event);
};

export const deleteEvent = async (req, res) => {
  await prisma.event.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ msg: "Event deleted" });
};