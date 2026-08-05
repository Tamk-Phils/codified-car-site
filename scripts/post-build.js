import fs from "fs";
import path from "path";

const clientDir = path.join(process.cwd(), "dist", "client");
const assetsDir = path.join(clientDir, "assets");

if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  const jsFile = files.find((f) => f.startsWith("index-") && f.endsWith(".js")) ||
    files.find((f) => f.endsWith(".js"));
  const cssFile = files.find((f) => f.startsWith("styles-") && f.endsWith(".css")) ||
    files.find((f) => f.endsWith(".css"));

  console.log("Found client bundles:", { jsFile, cssFile });

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bank Seized Cars | Repossessed Vehicles For Sale</title>
    <meta name="description" content="Bank repossessed cars, trucks and SUVs for sale below market value with nationwide US delivery." />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/logo.png" />
    ${cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}" />` : ""}
  </head>
  <body>
    <div id="root"></div>
    ${jsFile ? `<script type="module" src="/assets/${jsFile}"></script>` : ""}
  </body>
</html>
`;

  fs.writeFileSync(path.join(clientDir, "index.html"), htmlContent);
  console.log("Successfully generated production dist/client/index.html with JS and CSS bundles!");
} else {
  console.error("dist/client/assets directory not found!");
}

// Also remove the netlify functions directory if it exists (clean up old approach)
const fnDir = path.join(process.cwd(), "netlify", "functions");
if (fs.existsSync(fnDir)) {
  fs.readdirSync(fnDir).forEach((f) => fs.unlinkSync(path.join(fnDir, f)));
}
