import fs from "fs";
import path from "path";

const clientDir = path.join(process.cwd(), "dist", "client");
const assetsDir = path.join(clientDir, "assets");

// 1. Generate custom index.html with hashed bundles
if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  const jsFile =
    files.find((f) => f.startsWith("index-") && f.endsWith(".js")) ||
    files.find((f) => f.endsWith(".js"));
  const cssFile =
    files.find((f) => f.startsWith("styles-") && f.endsWith(".css")) ||
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
  console.log(
    "Generated dist/client/index.html with JS and CSS bundles!"
  );
}

// 2. Patch _shell.html to prevent window.$_TSR from self-deleting before JS hydration runs
const shellPath = path.join(clientDir, "_shell.html");
if (fs.existsSync(shellPath)) {
  let shell = fs.readFileSync(shellPath, "utf8");

  // Replace the self-deletion logic in the stream barrier:
  // Original: c(){this.hydrated&&this.streamEnded&&(delete self.$_TSR,delete self.$R.tsr)}
  // Patched:  c(){} -- never self-delete, JS hydration will handle cleanup
  const originalCleanup =
    "c(){this.hydrated&&this.streamEnded&&(delete self.$_TSR,delete self.$R.tsr)}";
  const patchedCleanup = "c(){}";

  if (shell.includes(originalCleanup)) {
    shell = shell.replace(originalCleanup, patchedCleanup);
    fs.writeFileSync(shellPath, shell);
    console.log(
      "Patched _shell.html: disabled $_TSR self-deletion to fix hydration crash."
    );
  } else {
    console.warn(
      "WARNING: Could not find cleanup pattern in _shell.html. The bundle format may have changed."
    );
    // Try a regex approach as fallback
    const patched = shell.replace(
      /c\(\)\{this\.hydrated&&this\.streamEnded&&\(delete self\.\$_TSR,delete self\.\$R\.tsr\)\}/,
      "c(){}"
    );
    if (patched !== shell) {
      fs.writeFileSync(shellPath, patched);
      console.log("Patched _shell.html via regex fallback.");
    }
  }
}
