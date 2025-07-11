// api/convert.js
import axios from "axios";

const BASE_URL = "https://youtube-mp36.p.rapidapi.com/dl";
const API_KEY = "a8fbcfa433msh7bbb4f7c2509480p186f56jsna70182c698bf"; // Replace with your actual key

export const convertToMp3 = async (videoId) => {
  try {
    const { data } = await axios.get(BASE_URL, {
      params: { id: videoId },
      headers: {
        "x-rapidapi-key": API_KEY,
        "x-rapidapi-host": "youtube-mp36.p.rapidapi.com",
      },
      timeout: 45000,
    });

    if (data?.status !== "ok" || !data?.link) {
      throw new Error("Conversion failed: " + (data.msg || "No link found"));
    }

    return data.link;
  } catch (error) {
    console.error("YT→MP3 conversion error:", error.message);
    throw error;
  }
};
