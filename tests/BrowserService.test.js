const BrowserService = require("./../services/BrowserService");
const playwright = require("playwright");

describe("BrowserService", () => {
  let browser;
  let context;

  beforeAll(async () => {
    browser = await BrowserService.getBrowser();
    context = await browser.newContext();
  });

  afterAll(async () => {
    await BrowserService.closeBrowser(browser);
  });

  test("fetchRoomDetails retrieves room details successfully", async () => {
    const checkin = "2024-05-01";
    const checkout = "2024-05-05";
    const adultos = 2;
    const hotel = 12;
    const destino = "Pratagy Beach Resort All Inclusive";

    const rooms = await BrowserService.fetchRoomDetails(
      browser,
      checkin,
      checkout,
      adultos,
      hotel,
      destino
    );

    expect(rooms).toBeDefined();
    expect(rooms.length).toBeGreaterThan(0);
    rooms.forEach((room) => {
      expect(room.name).toBeDefined();
      expect(room.description).toBeDefined();
      expect(room.price).toBeDefined();
      expect(room.image).toBeDefined();
    });
  });

  test("fetchRoomDetails handles navigation errors gracefully", async () => {
    const checkin = "invalid-date";
    const checkout = "invalid-date";

    const rooms = await BrowserService.fetchRoomDetails(
      browser,
      checkin,
      checkout
    );

    expect(rooms).toBeNull();
  });
});
