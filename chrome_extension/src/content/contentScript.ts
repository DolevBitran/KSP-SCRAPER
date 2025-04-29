// Define message types
export interface Product {
  productId: string | undefined;
  title: string;
  sku: string | null | undefined;
}
interface ScrapedDataMessage {
  type: "SCRAPED_DATA";
  payload: Product[] | null;
}

interface ManualScrapeMessage {
  type: "MANUAL_SCRAPE";
}

const SELECTORS = {
  PRODUCTS: '[class*="product-"]',
  TITLE: 'a[class*="productTitle"]',
  SKU: '[class*=skuWrapper]'
}

function scrapePage(): void {
  let products = null

  try {
    const productElements = Array.from(document.querySelectorAll(SELECTORS.PRODUCTS))
    if (productElements.length) {
      products = productElements.map(el => {
        const link = el.querySelector(SELECTORS.TITLE);
        const productId = link?.getAttribute('href')?.match(/\d+/)?.[0];
        const title = link?.textContent as string;
        const sku = el.querySelector(SELECTORS.SKU)?.textContent?.match(/\d+/)?.[0];

        return { productId, title, sku }
      })
    }
  } catch {
    console.log('products not found.')
  }

  const message: ScrapedDataMessage = { type: "SCRAPED_DATA", payload: products };
  chrome.runtime.sendMessage(message);
}

// Listen for manual scrape trigger
chrome.runtime.onMessage.addListener(
  (message: ManualScrapeMessage, _sender, sendResponse) => {
    if (message.type === "MANUAL_SCRAPE") {
      scrapePage();
      sendResponse({ status: "Scraping triggered" });
    }
  }
);