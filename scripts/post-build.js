import fs from "fs";
import path from "path";

const clientDir = path.join(process.cwd(), "dist", "client");
const assetsDir = path.join(clientDir, "assets");

// 1. Generate index.html with hashed bundles
if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  const jsFile = files.find((f) => f.startsWith("index-") && f.endsWith(".js"));
  const cssFile = files.find((f) => f.startsWith("styles-") && f.endsWith(".css"));
  console.log("Found client bundles:", { jsFile, cssFile });

  const html = `<!DOCTYPE html>
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
</html>`;

  fs.writeFileSync(path.join(clientDir, "index.html"), html);
  console.log("Generated dist/client/index.html");

  // 2. Patch the JS bundle: make xn() safe when window.$_TSR is undefined
  if (jsFile) {
    const jsBundlePath = path.join(assetsDir, jsFile);
    let js = fs.readFileSync(jsBundlePath, "utf8");

    // The exact pattern from the bundle - replace with a safe fallback
    const original = "async function xn(e){let t=window.$_TSR,";
    const patched =
      "async function xn(e){" +
      "if(!window.$_TSR){window.$_TSR={h(){},e(){},c(){},p(cb){cb()},initialized:false,buffer:[],router:{manifest:{routes:{__root__:{preloads:[],scripts:[]}},version:'1'},matches:[{i:'__root__\\0',s:'success',ssr:false}]}}}" +
      "let t=window.$_TSR,";

    if (js.includes(original)) {
      js = js.replace(original, patched);
      fs.writeFileSync(jsBundlePath, js);
      console.log(`Patched ${jsFile}: added $_TSR safe fallback in xn()`);
    } else {
      console.warn("WARNING: Could not find xn() pattern to patch in JS bundle!");
    }
  }
}

// 3. Also patch _shell.html to not self-delete $_TSR
const shellPath = path.join(clientDir, "_shell.html");
if (fs.existsSync(shellPath)) {
  let shell = fs.readFileSync(shellPath, "utf8");
  const before = shell.length;
  shell = shell.replace(
    /c\(\)\{this\.hydrated&&this\.streamEnded&&\(delete self\.\$_TSR,delete self\.\$R\.tsr\)\}/g,
    "c(){}"
  );
  if (shell.length !== before || shell.includes("c(){}")) {
    fs.writeFileSync(shellPath, shell);
    console.log("Patched _shell.html: removed $_TSR self-deletion");
  } else {
    console.warn("WARNING: _shell.html patch pattern not found");
  }
}
