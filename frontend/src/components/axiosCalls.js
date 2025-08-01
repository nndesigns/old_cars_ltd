import axios from "axios";

export async function getModelImageURLs(modelIds, inv) {
  try {
    const res = await axios.post("http://localhost:5001/api/batch", {
      modelIds,
      inv,
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching model image URLs:", err);
    throw err; // optionally rethrow for upstream handling
  }
}

export async function getInventory() {
  try {
    const res = await axios.post("http://localhost:5001/api/inv");
    return res.data;
  } catch (err) {
    console.error("Error fetching model image URLs:", err);
    throw err; // optionally rethrow for upstream handling
  }
}
