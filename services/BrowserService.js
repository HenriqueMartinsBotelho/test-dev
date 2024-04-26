const puppeteer = require("puppeteer");
const { TEST_TIMEOUT } = require("../config/constants");

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
    await this.navigateToRoomPage(page, checkin, checkout, adultos, hotel, destino);
    const rooms = await this.extractRoomDetails(page);
    await page.close();
    return rooms;
  }

  static async navigateToRoomPage(page, checkin, checkout, adultos, hotel, destino) {
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
      await page.goto(url, {
        waitUntil: "networkidle2",
        timeout: TEST_TIMEOUT,
      });
      await page.waitForSelector(".room-infos", { timeout: TEST_TIMEOUT });
    } catch (error) {
      console.error("Error navigating to or finding rooms on the page:", error);
      throw error;
    }
  }

  static async extractRoomDetails(page) {
    return page.evaluate(() => {
      const roomElements = document.querySelectorAll(".room-infos");
      return Array.from(roomElements).map((roomElem) => {
        return {
          name: roomElem.querySelector(".room-option-title--title span")?.innerText || "No name",
          description: roomElem.querySelector(".room-option-title--amenities")?.innerText || "No description",
          price: roomElem.querySelector(".daily-price--total strong")?.innerText || "No price",
          image: (() => {
            const carouselContainer = roomElem.closest(".room-option-wrapper").querySelector(".q-carousel__slide");
            const backgroundImage = carouselContainer ? carouselContainer.style.backgroundImage : "";
            const imageUrlMatch = backgroundImage.match(/url\("?(.+?)"?\)/);
            return imageUrlMatch ? imageUrlMatch[1] : "No image available";
          })(),
        };
      });
    });
  }
}

module.exports = BrowserService;
