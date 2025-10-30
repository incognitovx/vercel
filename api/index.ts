// The 'puppeteer' library is required to launch a headless browser.
import * as puppeteer from 'puppeteer';

// Define the target URL as a constant with explicit string type.
const TARGET_URL: string = 'https://www.mangago.zone/chapter/34831/472531/';

// Interface for the structured data returned by the scrape function
interface MangaPage {
  page_id: string | null;
  image_url: string;
  page_number: number;
}

/**
 * Launches a headless browser, navigates to the URL, and scrapes image data.
 * @param url The URL of the manga chapter page to scrape.
 * @returns A promise that resolves to an array of scraped image data (MangaPage[]).
 */
async function scrape(url: string): Promise<MangaPage[] | { error: string }> {
  let browser: puppeteer.Browser | undefined;

  try {
    // Launch the browser instance
    browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set necessary headers to mimic a regular browser visit
    await page.setExtraHTTPHeaders({
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    });

    // Navigate to the target page, waiting for network activity to settle
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000, // 30-second timeout
    });

    console.log(`Successfully fetched ${url}`);

    // Execute code within the browser's context (page.evaluate)
    const imageScrape: MangaPage[] = await page.evaluate(() => {
      const results: MangaPage[] = [];
      let pageCounter: number = 1;
      const selector: string = '#pic_container img';

      // Iterate over all image elements matching the selector
      document.querySelectorAll<HTMLImageElement>(selector).forEach((el) => {
        const imageUrl = el.getAttribute('src');
        const pageId = el.getAttribute('id');

        // Only process images that have a source and are not placeholder loaders
        if (imageUrl && !imageUrl.includes('ajax-loader2.gif')) {
          results.push({
            page_id: pageId,
            image_url: imageUrl,
            page_number: pageCounter,
          });
          pageCounter++;
        }
      });
      return results;
    });

    console.log(imageScrape);
    return imageScrape;
  } catch (error: any) {
    console.error(`Error while scraping: ${error.message}`);
    // Return an object containing the error message upon failure
    return {
      error: `Scraping failed: ${error.message}`,
    };
  } finally {
    // Ensure the browser is closed whether scraping succeeded or failed
    if (browser) {
      await browser.close();
    }
  }
}

// Execute the main function
scrape(TARGET_URL);
