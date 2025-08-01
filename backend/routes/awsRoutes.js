const AWS = require("aws-sdk");
const { URL } = require("url");
const { ScanCommand } = require("@aws-sdk/client-dynamodb");

const s3 = new AWS.S3({
  region: "us-east-2",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const getKeyFromUrl = (url) => {
  const parsed = new URL(url);
  return decodeURIComponent(parsed.pathname.slice(1)); // removes initial "/" and decodes spaces etc.
};

const getSignedUrl = (key) => {
  return s3.getSignedUrl("getObject", {
    Bucket: "imgs-all",
    Key: key,
    Expires: 60 * 60, // Optional: URL valid for 1 hour (3600 seconds)
  });
};

const {
  DynamoDBClient,
  BatchGetItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { publicDecrypt } = require("crypto");

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
  // GET MODEL IMAGES ROUTE
  app.post("/api/batch", async (req, res) => {
    const { modelIds, inv } = req.body;

    if (!Array.isArray(modelIds)) {
      return res.status(400).json({ error: "modelIds must be an array" });
    }

    if (modelIds.length === 0) {
      return res.status(400).json({ error: "No model IDs provided." });
    }

    const chunks = chunkArray(modelIds, 100); // split into batches of 100
    const results = {};

    try {
      for (const chunk of chunks) {
        const keys = chunk.map((model_id) => ({
          model_id: { S: model_id },
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
          const imgArray = item.image_urls?.L;

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
                const objectKey = getKeyFromUrl(chosenImg.S);
                const signedUrl = getSignedUrl(objectKey);
                results[model_id] = signedUrl;
              }
            }
          }
        });
      }

      res.json(results);
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
};
