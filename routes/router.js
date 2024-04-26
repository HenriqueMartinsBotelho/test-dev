const express = require("express");
const router = express.Router();
const BrowserService = require("./../services/BrowserService");

router.get("/", (req, res) => {
  res.send("Hello Asksuite World!");
});

router.post("/search", async (req, res) => {
  const { checkin, checkout } = req.body;
  if (!checkin || !checkout) {
    return res
      .status(400)
      .json({ error: "Check-in and check-out dates are required." });
  }

  try {
    const browser = await BrowserService.getBrowser();
    const rooms = await BrowserService.fetchRoomDetails(
      browser,
      checkin,
      checkout
    );
    await BrowserService.closeBrowser(browser);
    res.json(rooms);
  } catch (error) {
    console.error("Error fetching room details:", error);
    res.status(500).json({ error: "Failed to fetch room details." });
  }
});

module.exports = router;
