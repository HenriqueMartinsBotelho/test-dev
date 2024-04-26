const puppeteer = require("puppeteer");

class BrowserService {
  static async getBrowser() {
    return puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
    });
  }

  static async closeBrowser(browser) {
    if (browser) {
      await browser.close();
    }
  }

  static async fetchRoomDetails(
    browser,
    checkin,
    checkout,
    adultos = 2,
    hotel = 12,
    destino = "Pratagy Beach Resort All Inclusive"
  ) {
    const page = await browser.newPage();
    const baseURL = "https://pratagy.letsbook.com.br/D/Reserva";
    const queryParams = new URLSearchParams({
      checkin: encodeURIComponent(checkin),
      checkout: encodeURIComponent(checkout),
      cidade: "",
      hotel: hotel,
      adultos: adultos,
      criancas: "",
      destino: destino,
      promocode: "",
      tarifa: "",
      mesCalendario: "7/14/2023",
    });

    const url = `${baseURL}?${queryParams.toString()}`;

    try {
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
      await page.waitForSelector(".room-infos", { timeout: 5000 });
    } catch (error) {
      console.error("Error navigating to or finding rooms on the page:", error);
      await page.close();
      return null;
    }

    const rooms = await page.evaluate(() => {
      const roomElements = document.querySelectorAll(".room-infos");
      const rooms = [];
      roomElements.forEach((roomElem) => {
        const name = roomElem.querySelector(
          ".room-option-title--title span"
        )?.innerText;
        const description = roomElem.querySelector(
          ".room-option-title--amenities"
        )?.innerText;
        const price = roomElem.querySelector(
          ".daily-price--total strong"
        )?.innerText;
        const image =
          roomElem.querySelector("img")?.src ?? "No image available";

        rooms.push({ name, description, price, image });
      });
      return rooms;
    });

    await page.close();
    return rooms;
  }
}

module.exports = BrowserService;
