import serverHandler from "../../dist/server/server.js";

/**
 * Netlify serverless function wrapping the TanStack Start SSR handler.
 * TanStack Start's server exports a Fetch API-compatible handler
 * ({ fetch(request, env, ctx) => Response }).
 * Netlify's Node.js function receives event/context, so we bridge them.
 */
export default async (req, context) => {
  // `req` here is a standard Request (Netlify Edge compatibility)
  // or we convert from event if using regular functions
  try {
    const response = await serverHandler.fetch(req, {}, context);
    return response;
  } catch (err) {
    console.error("SSR handler error:", err);
    return new Response(
      `<html><body><h1>Server Error</h1><pre>${String(err)}</pre></body></html>`,
      { status: 500, headers: { "content-type": "text/html" } }
    );
  }
};

export const config = {
  path: "/*",
};
