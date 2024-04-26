const BrowserService = require("./../services/BrowserService");

describe("BrowserService", () => {
  let browser;

  beforeAll(async () => {
    browser = await BrowserService.getBrowser();
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
});
