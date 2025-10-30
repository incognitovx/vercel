import { IncomingMessage, ServerResponse } from 'http';

// Define the structured type for the data we want to return
interface MangaPage {
  page_id: string | null;
  image_url: string;
  page_number: number;
}

// Define the structured type for the full response object
type ScrapeResult = MangaPage[] | { error: string };

// --- MOCK Scrape Function (Simulates your original Puppeteer logic) ---
// Note: This function replaces your actual Puppeteer code for deployment safety.
async function mockScrape(url: string): Promise<ScrapeResult> {
  console.log(`[MOCK] Simulating heavy scraping task for URL: ${url}`);

  // Simulate success
  if (url.includes('mangago.zone')) {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
    return [
      {
        page_id: 'p1',
        image_url: 'https://mock.com/img/page-01.jpg',
        page_number: 1,
      },
      {
        page_id: 'p2',
        image_url: 'https://mock.com/img/page-02.jpg',
        page_number: 2,
      },
      {
        page_id: 'p3',
        image_url: 'https://mock.com/img/page-03.jpg',
        page_number: 3,
      },
    ];
  }

  // Simulate failure
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { error: 'Mock scraping failed for invalid URL.' };
}

/**
 * The Vercel Serverless Entry Point (HTTP Handler)
 * This function waits for the scraping to complete and sends the result as JSON.
 * * @param req The incoming HTTP request.
 * @param res The outgoing HTTP response.
 */
export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  // 1. Define the target URL (could also be pulled from req.query)
  const TARGET_URL: string = 'https://www.mangago.zone/chapter/34831/472531/';

  try {
    // 2. Await the result of the (mocked) asynchronous scrape function
    const data = await mockScrape(TARGET_URL);

    // 3. Check if the result is an error object
    if ('error' in data) {
      res.statusCode = 500;
    } else {
      res.statusCode = 200;
    }

    // 4. Set the header to indicate we are sending JSON
    res.setHeader('Content-Type', 'application/json');

    // 5. Convert the data to a JSON string and send the response
    res.end(JSON.stringify(data));
  } catch (error: any) {
    console.error('Handler Error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({ error: 'Internal server error during processing.' })
    );
  }
}
