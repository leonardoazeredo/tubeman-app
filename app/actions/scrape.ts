import { YtInitialData } from "@/types/scraper";
import { Result, Video } from "@/types/shared";
import { extractVideoDetails, mapZodErrors } from "@/utils/utilities";
import { scrapeSearchParamsSchema } from "@/utils/zodSchemas";

export async function scrapeVideos(
  _state: Result<Video[]>,
  formData: FormData
): Promise<Result<Video[]>> {
  try {
    const channelHandle = formData.get("channelHandle")?.toString();
    const keywords = formData.get("keywords")?.toString();

    if (!channelHandle || !keywords) {
      return {
        success: false,
        errors: [
          {
            field: "general",
            message: "Channel handle and keywords are required.",
          },
        ],
      };
    }

    const parsed = scrapeSearchParamsSchema.safeParse({
      channelHandle,
      keywords,
    });

    if (!parsed.success) {
      return { success: false, errors: mapZodErrors(parsed.error.errors) };
    }

    const { channelHandle: validHandle, keywords: validKeywords } = parsed.data;

    const url = "https://www.youtube.com/youtubei/v1/browse";
    const options = {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: `{"context":{"client":{"clientName":"WEB","clientVersion":"2.20250210.02.00","originalUrl":"https://www.youtube.com/@${encodeURIComponent(
        validHandle
      )}/search?query=${encodeURIComponent(
        validKeywords
      )}"},"request":{"useSsl":true}},"browseId":"UCsn6cjffsvyOZCZxvGoJxGg","params":"EgZzZWFyY2jyBgQKAloA","query":"${encodeURIComponent(
        validKeywords
      )}"}`,
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      let errorMessage = `Failed to fetch videos: ${response.status} ${response.statusText}`;
      if (response.status === 404) {
        errorMessage = "Channel not found.";
      } else if (response.status === 429) {
        errorMessage = "Too many requests. Please try again later.";
      }
      console.error(errorMessage, await response.text());
      return {
        success: false,
        errors: [{ field: "network", message: errorMessage }],
      };
    }

    let data: YtInitialData;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError);
      return {
        success: false,
        errors: [{ field: "json", message: "Failed to parse JSON response." }],
      };
    }

    const videoDetails = extractVideoDetails(data);
    return { success: true, data: videoDetails };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Caught exception in scrapeVideos:", error);
    let message = "An unexpected error occurred during scraping.";
    if (error instanceof Error) {
      message = error.message;
    }
    return { success: false, errors: [{ field: "general", message }] };
  }
}
