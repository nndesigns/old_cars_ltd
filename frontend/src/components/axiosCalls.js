import axios from "axios";

export async function getModelImageURLs(modelIds, inv, mobile) {
  // console.log("rec'd modelIds arg", modelIds);

  // console.log("rec'd 'inv arg", inv);

  try {
    const res = await axios.post("http://localhost:5001/api/batch", {
      modelIds,
      inv, //boolean (true = inv imgs (VehiclePage), false/null = model imgs (InventoryCard))
      mobile,
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

//Inventory Search
export async function searchInventory(query) {
  if (!query) return [];

  try {
    const res = await axios.get(`http://localhost:5001/api/inventory/search`, {
      params: { query },
    });

    return res.data; // array of matching car objects
  } catch (err) {
    console.error("Error searching inventory:", err);
    return [];
  }
}

export async function smartSearch(invSearch) {
  if (!invSearch) return [];

  try {
    const res = await axios.get(
      `http://localhost:5001/api/inventory/smartsearch`,
      {
        params: { invSearch },
      }
    );

    return res.data; // array of matching car objects
  } catch (err) {
    console.error("Error searching inventory:", err);
    return [];
  }
}
