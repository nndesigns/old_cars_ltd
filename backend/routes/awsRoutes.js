const AWS = require("aws-sdk");
const { URL } = require("url");
const {
  DynamoDBClient,
  ScanCommand,
  BatchGetItemCommand,
} = require("@aws-sdk/client-dynamodb");

const { unmarshall } = require("@aws-sdk/util-dynamodb");
const { publicDecrypt } = require("crypto");

const s3 = new AWS.S3({
  region: "us-east-2",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const getKeyFromUrl = (url) => {
  const parsed = new URL(url);
  return decodeURIComponent(parsed.pathname.slice(1)); // removes initial "/" and decodes spaces etc.
};

//add arg here to conditionally
const getSignedUrl = (key) => {
  return s3.getSignedUrl("getObject", {
    Bucket: "imgs-all",
    Key: key,
    Expires: 60 * 60, // Optional: URL valid for 1 hour (3600 seconds)
  });
};

function dedupeByKey(arr, keyFn) {
  const seen = new Set();
  return arr.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function capitalizeWords(str) {
  return str.replace(/\b\w/g, (l) => l.toUpperCase());
}

module.exports = (app) => {
  // CONNECT TO DYNAMO (holds all s3 image urls, mapped there by Mapto_model_images_dynamo.py)
  const client = new DynamoDBClient({
    region: "us-east-2",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  /////////////////// BATCH ROUTE /////////////////
  // get image URLS (dynamo) for all models for PickerGrid
  const chunkArray = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );
  /////////// GET MODEL IMAGES ROUTE

  // app.post("/api/batch", async (req, res) => {
  //   const { modelIds, inv } = req.body;

  //   if (!Array.isArray(modelIds)) {
  //     return res.status(400).json({ error: "modelIds must be an array" });
  //   }

  //   if (modelIds.length === 0) {
  //     return res.status(400).json({ error: "No model IDs provided." });
  //   }

  //   const chunks = chunkArray(modelIds, 100); // split into batches of 100
  //   const results = {};

  //   try {
  //     //assign each received 'modelId' array value to formatted obj (after chunking)
  //     for (const chunk of chunks) {
  //       const keys = chunk.map((modelId) => ({
  //         model_id: { S: modelId },
  //       }));

  //       const params = {
  //         RequestItems: {
  //           model_images: {
  //             Keys: keys,
  //           },
  //         },
  //       };

  //       //call 'model_images' dynamo to retrieve objs
  //       const command = new BatchGetItemCommand(params);
  //       const response = await client.send(command);

  //       (response.Responses?.model_images || []).forEach((item) => {
  //         // for each 'model_images' array obj rec'd in response, save its .model_id & .img_urls to variables
  //         const model_id = item.model_id.S;
  //         const imgArray = item.image_urls?.L;

  //         if (imgArray && imgArray.length > 0) {
  //           //////  IF INV IS TRUE
  //           if (inv === true) {
  //             const filteredImgs = imgArray // get 'inventory' imgs array
  //               .filter((img) => !img.S.includes("model.webp")) // omit any 'model' image
  //               .map((img) => getSignedUrl(getKeyFromUrl(img.S)));

  //             //assign 'results'
  //             results[model_id] = filteredImgs;
  //             ///// IF INV IS FALSE
  //           } else {
  //             //get 'model' img only
  //             const modelImgObj = imgArray.find((img) =>
  //               img.S.includes("model.webp")
  //             );
  //             const fallbackImgObj = imgArray[0];
  //             const chosenImg = modelImgObj || fallbackImgObj;

  //             if (chosenImg) {
  //               const objectKey = getKeyFromUrl(chosenImg.S);
  //               const signedUrl = getSignedUrl(objectKey);
  //               //assign 'results'
  //               results[model_id] = signedUrl;
  //             }
  //           }
  //         }
  //       });
  //     }

  //     res.json(results);
  //   } catch (error) {
  //     console.error("DynamoDB error:", error);
  //     res.status(500).json({ error: "Internal server error" });
  //   }
  // });

  // app.post("/api/batch", async (req, res) => {
  //   const { modelIds, inv, mobile } = req.body; // <-- add 'mobile' argument

  //   if (!Array.isArray(modelIds)) {
  //     return res.status(400).json({ error: "modelIds must be an array" });
  //   }

  //   if (modelIds.length === 0) {
  //     return res.status(400).json({ error: "No model IDs provided." });
  //   }

  //   const chunks = chunkArray(modelIds, 100);
  //   const results = {};

  //   try {
  //     for (const chunk of chunks) {
  //       const keys = chunk.map((modelId) => ({
  //         model_id: { S: modelId },
  //       }));

  //       const params = {
  //         RequestItems: {
  //           model_images: {
  //             Keys: keys,
  //           },
  //         },
  //       };

  //       const command = new BatchGetItemCommand(params);
  //       const response = await client.send(command);

  //       (response.Responses?.model_images || []).forEach((item) => {
  //         const model_id = item.model_id.S;

  //         // ✅ pick correct image list based on 'mobile' flag
  //         const imgArray = mobile
  //           ? item.image_urls_mobile?.L
  //           : item.image_urls_large?.L;

  //         if (imgArray && imgArray.length > 0) {
  //           if (inv === true) {
  //             // inventory view: all images except "model.webp"
  //             const filteredImgs = imgArray
  //               .filter((img) => !img.S.includes("model.webp"))
  //               .map((img) => getSignedUrl(getKeyFromUrl(img.S)));

  //             results[model_id] = filteredImgs;
  //           } else {
  //             // single model image view
  //             const modelImgObj = imgArray.find((img) =>
  //               img.S.includes("model.webp")
  //             );
  //             const fallbackImgObj = imgArray[0];
  //             const chosenImg = modelImgObj || fallbackImgObj;

  //             if (chosenImg) {
  //               const objectKey = getKeyFromUrl(chosenImg.S);
  //               const signedUrl = getSignedUrl(objectKey);
  //               results[model_id] = signedUrl;
  //             }
  //           }
  //         }
  //       });
  //     }

  //     res.json(results);
  //   } catch (error) {
  //     console.error("DynamoDB error:", error);
  //     res.status(500).json({ error: "Internal server error" });
  //   }
  // });

  app.post("/api/batch", async (req, res) => {
    const { modelIds, inv, mobile } = req.body;

    // console.log("rec'd modelIds", modelIds);

    if (!Array.isArray(modelIds)) {
      return res.status(400).json({ error: "modelIds must be an array" });
    }

    if (modelIds.length === 0) {
      return res.status(400).json({ error: "No model IDs provided." });
    }

    // Remove duplicates but keep original order
    const uniqueModelIds = [...new Set(modelIds)];

    const chunks = chunkArray(uniqueModelIds, 100);
    const results = {};

    try {
      for (const chunk of chunks) {
        const keys = chunk.map((modelId) => ({
          model_id: { S: modelId },
        }));

        const params = {
          RequestItems: {
            model_images: {
              Keys: keys,
            },
          },
        };

        const command = new BatchGetItemCommand(params);
        const response = await client.send(command);

        (response.Responses?.model_images || []).forEach((item) => {
          const model_id = item.model_id.S;
          const imgArray = mobile
            ? item.image_urls_mobile?.L
            : item.image_urls_large?.L;

          if (imgArray && imgArray.length > 0) {
            if (inv === true) {
              const filteredImgs = imgArray
                .filter((img) => !img.S.includes("model.webp"))
                .map((img) => getSignedUrl(getKeyFromUrl(img.S)));

              results[model_id] = filteredImgs;
            } else {
              const modelImgObj = imgArray.find((img) =>
                img.S.includes("model.webp")
              );
              const fallbackImgObj = imgArray[0];
              const chosenImg = modelImgObj || fallbackImgObj;

              if (chosenImg) {
                results[model_id] = getSignedUrl(getKeyFromUrl(chosenImg.S));
              }
            }
          }
        });
      }

      // Map back results to original requested modelIds (including duplicates)
      const finalResults = {};
      modelIds.forEach((id) => {
        finalResults[id] = results[id] || null;
      });

      res.json(finalResults);
    } catch (error) {
      console.error("DynamoDB error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // GET INVENTORY ROUTE
  app.post("/api/inv", async (req, res) => {
    try {
      const command = new ScanCommand({
        TableName: "Inventory_OldCarsLtd",
      });

      const response = await client.send(command);

      // DynamoDB returns items in raw AttributeValue format (e.g., { S: "text" })
      // Convert them to plain JS objects using unmarshall:
      const { unmarshall } = require("@aws-sdk/util-dynamodb");

      const items = response.Items.map(unmarshall); // now it's clean JSON

      res.json(items); // returns array of objects
    } catch (err) {
      console.error("Error fetching inventory:", err);
      res.status(500).json({ error: "Failed to fetch inventory" });
    }
  });

  /// INVENTORY SEARCH ROUTE
  app.get("/api/inventory/search", async (req, res) => {
    const { query } = req.query;
    if (!query || query.trim() === "") {
      return res.status(400).json({ error: "Missing search query" });
    }

    const lower = query.toLowerCase().trim();

    try {
      // DynamoDB doesn't support complex "contains any field" searches directly,
      // so we scan (for simplicity) and filter in JS.
      // For large datasets, you'd eventually use DynamoDB full-text search (via OpenSearch).

      const command = new ScanCommand({
        TableName: "Inventory_OldCarsLtd",
        Limit: 1000, // safety limit, adjust if needed
      });

      const response = await client.send(command);
      const items = response.Items.map(unmarshall);

      // Filter locally — for now, this is still backend-side (not frontend)
      const filtered = items.filter((car) => {
        if (!car) return false;

        const { year, make, model, style, vin } = car;
        const lowerStyle = style?.toLowerCase();
        const lowerMake = make?.toLowerCase();
        const lowerModel = model?.toLowerCase();
        const lowerVin = vin?.toLowerCase();

        const isTruckAlias = lower === "truck" && lowerStyle === "pickup";

        const styleMatch =
          lowerStyle &&
          (lowerStyle.includes(lower) ||
            (lower === "truck" && lowerStyle.includes("pickup")));

        const makeMatch = lowerMake && lowerMake.includes(lower);

        let modelSearch = lower;
        if (lowerMake && lower.startsWith(lowerMake + " ")) {
          modelSearch = lower.replace(lowerMake + " ", "");
        }
        const modelMatch = lowerModel && lowerModel.includes(modelSearch);

        const yearMatch = year && String(year).includes(lower);
        const vinMatch = lowerVin && lowerVin.includes(lower);

        return (
          styleMatch ||
          makeMatch ||
          modelMatch ||
          yearMatch ||
          vinMatch ||
          isTruckAlias
        );
      });

      res.json(filtered);
    } catch (err) {
      console.error("Error searching inventory:", err);
      res.status(500).json({ error: "Failed to search inventory" });
    }
  });

  /// FOR INV SEARCH DROPDOWN OPTIONS
  app.get("/api/inventory/smartsearch", async (req, res) => {
    const { invSearch } = req.query;

    if (!invSearch || invSearch.trim() === "") {
      return res.status(400).json({ error: "Missing search query" });
    }

    const search = invSearch.toLowerCase().trim();

    try {
      // 1️⃣ Scan DynamoDB table
      const command = new ScanCommand({
        TableName: "Inventory_OldCarsLtd",
        Limit: 1000, // safety cap
      });

      const response = await client.send(command);
      const inv = response.Items.map(unmarshall);

      // 2️⃣ Define styles + structure
      const allStyles = [
        "convertible",
        "coupe",
        "hatchback",
        "luxury",
        "muscle car",
        "pickup",
        "sedan",
        "station wagon",
        "SUV / 4x4",
        "van",
      ];

      const invMatches = {
        Make: [],
        Model: [],
        Style: [],
        Year: [],
        Vin: [],
      };

      // ----------- MAKE MATCHES -----------
      let makeMatches = inv
        .filter((item) => item.make && item.make.toLowerCase().includes(search))
        .map((item) => item.make);
      makeMatches = [...new Set(makeMatches)];
      invMatches.Make = makeMatches;

      const uniqueMakesLower = [
        ...new Set(inv.map((item) => item.make?.toLowerCase()).filter(Boolean)),
      ];
      const isFullMakeWithSpace = uniqueMakesLower.some(
        (make) => search === `${make} `
      );

      let makeFromSearch = null;
      const isFullMakeWithExtra = uniqueMakesLower.some((make) => {
        if (search.startsWith(`${make} `) && search.length > make.length + 1) {
          makeFromSearch = make;
          return true;
        }
        return false;
      });

      let dedupedMakeModelMatches;
      if (isFullMakeWithSpace) {
        const makeModelMatches = inv
          .filter((item) => makeMatches.includes(item.make))
          .map((item) => ({
            display: `${item.make} ${item.model}`,
            make: item.make,
            model: item.model,
          }));

        dedupedMakeModelMatches = dedupeByKey(
          makeModelMatches,
          (item) => item.display
        );
      }

      let modelMatches;
      if (isFullMakeWithExtra && makeFromSearch) {
        const modelSearchTerm = search.slice(makeFromSearch.length + 1);
        modelMatches = inv
          .filter(
            (item) =>
              item.make?.toLowerCase() === makeFromSearch &&
              item.model &&
              item.model.toLowerCase().includes(modelSearchTerm)
          )
          .map((item) => ({
            display: `${item.make} ${item.model}`,
            make: item.make,
            model: item.model,
          }));

        invMatches.Make = [
          ...new Set([...invMatches.Make, capitalizeWords(makeFromSearch)]),
        ];
      } else {
        modelMatches = inv
          .filter(
            (item) => item.model && item.model.toLowerCase().includes(search)
          )
          .map((item) => ({
            display: `${item.make} ${item.model}`,
            make: item.make,
            model: item.model,
          }));
      }

      const dedupedModelMatches = dedupeByKey(
        modelMatches,
        (item) => item.display
      );
      invMatches.Model = dedupeByKey(
        [...(dedupedMakeModelMatches || []), ...dedupedModelMatches],
        (item) => item.display
      );

      // ----------- STYLE MATCHES -----------
      const styleMatches = allStyles.filter((item) =>
        item.toLowerCase().includes(search)
      );
      if (search.includes("truck") && !styleMatches.includes("pickup")) {
        styleMatches.push("pickup");
      }
      invMatches.Style = styleMatches.map((match) => capitalizeWords(match));

      // ----------- YEAR MATCHES -----------
      const yearMatches = inv
        .filter((item) => item.year && item.year.toString().includes(search))
        .sort((a, b) => a.year - b.year)
        .map((item) => ({
          display: `${item.year} ${item.make} ${item.model}`,
          make: item.make,
          model: item.model,
          year: item.year,
        }));

      invMatches.Year = dedupeByKey(yearMatches, (item) => item.display);

      // ----------- VIN MATCHES -----------
      const vinMatches = inv
        .filter((item) => item.vin && item.vin.toLowerCase().includes(search))
        .map((item) => ({
          display: `${item.vin} (${item.year} ${item.make} ${item.model})`,
          make: item.make,
          model: item.model,
          year: item.year,
          vin: item.vin,
        }));

      invMatches.Vin = vinMatches;

      // 3️⃣ Return structured object
      res.json(invMatches);
    } catch (err) {
      console.error("Error running smart inventory search:", err);
      res.status(500).json({ error: "Failed to perform smart search" });
    }
  });
};
