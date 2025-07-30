import axios from "axios";

export async function getModelImageURLs(modelIds, inv) {
  // console.log("modelIds rec'd", modelIds);
  // console.log("inv rec'd", inv);

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
