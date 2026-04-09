import "dotenv/config";
import ImageKit from "imagekit";

async function main() {
  const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT } =
    process.env;

  if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_URL_ENDPOINT) {
    throw new Error("Missing ImageKit credentials");
  }

  const imageKit = new ImageKit({
    publicKey: IMAGEKIT_PUBLIC_KEY,
    privateKey: IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: IMAGEKIT_URL_ENDPOINT,
  });

  console.log("Fetching files from ImageKit...");

  const response: any = await imageKit.listFiles({ path: "/leaderboard" });
  const files = Array.isArray(response) ? response : response.files;
  
  console.log(`Found ${files.length} files`);

  const fileIds = files.map((f: any) => f.fileId);
  
  if (fileIds.length > 0) {
    await imageKit.bulkDeleteFiles(fileIds);
    console.log(`Deleted ${fileIds.length} files`);
  }

  console.log("ImageKit reset complete.");
}

main().catch((error) => {
  console.error("Reset failed:", error);
  process.exitCode = 1;
});
