import express from "express";
import prisma from "./lib/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const bookstores = await prisma.bookstore.findMany();
    if (!bookstores) {
      res.status(400).json({ message: "No bookstores were found" });
    }
    res.status(200).json({ message: bookstores });
  } catch (error) {
    console.error(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const bookstore = await prisma.bookstore.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!bookstore) {
      res
        .status(400)
        .json({ message: `Bookstore with id of ${id} were not found` });
    }
    res.status(200).json({ message: bookstore });
  } catch (error) {
    console.error(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, location } = req.body;
    const bookstore = await prisma.bookstore.create({
      data: {
        name,
        location,
      },
    });
    res.status(200).json({ message: bookstore });
  } catch (error) {
    console.log(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location } = req.body;
    const bookstore = await prisma.bookstore.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name,
        location: location,
      },
    });
    if (!bookstore) {
      return res
        .status(400)
        .json({ message: `Cannot update bookstore with id of ${id}` });
    }
    res.status(200).json({ message: bookstore });
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: "wtf" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const bookstore = await prisma.bookstore.findUnique({
      where: {
        id: Number(id),
      },
    })
    if (!bookstore) {
      return res.status(404).json({ message: "Bookstore was not found." });
    }
    await prisma.bookstore.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json({ message: "Bookstore deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong while deleting the bookstore. Please try again later." });
  }
});

export default router;
