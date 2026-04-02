import { IVideo } from "@/models/Video";

/**
 * VideoFormData = IVideo minus _id
 * Jab hum naya video create karte hain, _id nahi bhejte — MongoDB khud generate karta hai
 */
export type VideoFormData = Omit<IVideo, "_id">;

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

/**
 * ApiClient class — Frontend se backend API routes call karne ka helper
 *
 * Kyun class use kiya?
 * → Saare API calls ek jagah organized rehte hain
 * → Common logic (headers, error handling) ek baar likho, har method mein reuse
 * → TypeScript generics se type-safe responses milte hain
 */
class ApiClient {
  /**
   * Private fetch method — sabhi API calls isse hoti hain
   * T = return type (TypeScript generic — batata hai ki response kis type ka hoga)
   */
  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  /**
   * GET /api/video — Sabhi videos fetch karo
   * FIX: Pehle "/videos" tha (plural), lekin actual route "/video" hai (singular)
   */
  async getVideos() {
    return this.fetch<IVideo[]>("/video");
  }

  /**
   * POST /api/video — Naya video create karo
   * FIX: Same endpoint fix as above
   */
  async createVideo(videoData: VideoFormData) {
    return this.fetch<IVideo>("/video", {
      method: "POST",
      body: videoData,
    });
  }

  /**
   * DELETE /api/video/[id] — Video delete karo
   */
  async deleteVideo(id: string) {
    return this.fetch<void>(`/video/${id}`, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();
