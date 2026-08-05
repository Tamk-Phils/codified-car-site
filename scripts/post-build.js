import fs from "fs";
import path from "path";

const clientDir = path.join(process.cwd(), "dist", "client");
const assetsDir = path.join(clientDir, "assets");

const tsrFallbackScript = `<script>
if(!window.$_TSR){
  window.$_TSR={
    h(){},e(){},c(){},p(cb){if(typeof cb==='function')cb();},
    initialized:false,buffer:[],
    router:{manifest:{routes:{__root__:{preloads:[],scripts:[]}},version:'1'},matches:[{i:'__root__\\0',s:'success',ssr:false}]}
  };
}
</script>`;

// 1. Generate index.html with hashed bundles and inline $_TSR fallback script
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
    <title>KJ Autos | Certified Bank Repossessed Vehicles in California</title>
    <meta name="description" content="KJ Autos - Bank repossessed cars, trucks and SUVs for sale in California below market value with nationwide delivery." />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/logo.png" />
    ${tsrFallbackScript}
    ${cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}" />` : ""}
  </head>
  <body>
    <div id="root"></div>
    ${jsFile ? `<script type="module" src="/assets/${jsFile}"></script>` : ""}
  </body>
</html>`;

  fs.writeFileSync(path.join(clientDir, "index.html"), html);
  console.log("Generated dist/client/index.html with inline $_TSR fallback");

  // 2. Patch ALL JS files in assets directory: make any 'let t=window.$_TSR,' safe
  const jsFiles = files.filter((f) => f.endsWith(".js"));
  let totalPatched = 0;
  const safeTsrCode = "if(!window.$_TSR){window.$_TSR={h(){},e(){},c(){},p(cb){if(typeof cb==='function')cb();},initialized:false,buffer:[],router:{manifest:{routes:{__root__:{preloads:[],scripts:[]}},version:'1'},matches:[{i:'__root__\\0',s:'success',ssr:false}]}}};let t=window.$_TSR,";

  for (const file of jsFiles) {
    const filePath = path.join(assetsDir, file);
    let js = fs.readFileSync(filePath, "utf8");
    if (js.includes("let t=window.$_TSR,")) {
      js = js.replaceAll("let t=window.$_TSR,", safeTsrCode);
      fs.writeFileSync(filePath, js);
      totalPatched++;
      console.log(`Patched ${file}: injected $_TSR safety guard`);
    }
  }
  if (totalPatched === 0) {
    console.warn("WARNING: No 'let t=window.$_TSR,' patterns found in JS files!");
  }
}

// 3. Patch _shell.html to inject inline $_TSR fallback and prevent self-deletion
const shellPath = path.join(clientDir, "_shell.html");
if (fs.existsSync(shellPath)) {
  let shell = fs.readFileSync(shellPath, "utf8");

  // Prevent self deletion
  shell = shell.replace(
    /c\(\)\{this\.hydrated&&this\.streamEnded&&\(delete self\.\$_TSR,delete self\.\$R\.tsr\)\}/g,
    "c(){}"
  );

  // Inject fallback script in head if not already present
  if (!shell.includes("if(!window.$_TSR)")) {
    shell = shell.replace("<head>", `<head>${tsrFallbackScript}`);
  }

  fs.writeFileSync(shellPath, shell);
  console.log("Patched _shell.html with $_TSR safety guard");
}
