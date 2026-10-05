export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    // Handle browser CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    const url = new URL(request.url);

    // AI generation endpoint
    if (
      url.pathname === "/api/generate" &&
      request.method === "POST"
    ) {
      try {
        const body = await request.json();
        const prompt = body.prompt;

        if (!prompt) {
          return Response.json(
            { error: "Prompt is required" },
            {
              status: 400,
              headers: corsHeaders
            }
          );
        }

        const response = await env.AI.run(
          "@cf/meta/llama-3.1-8b-instruct-fast",
          {
            messages: [
              {
                role: "system",
                content:
                  "You are Plot Twist AI. Create entertaining original fictional drama stories, viral hooks, scripts, scenes, titles, thumbnails, and social media content. When the user requests JSON, return only valid JSON with no markdown code fences."
              },
              {
                role: "user",
                content: prompt
              }
            ]
          }
        );

        return Response.json(response, {
          headers: corsHeaders
        });

      } catch (error) {
        return Response.json(
          {
            error: error.message || "AI generation failed"
          },
          {
            status: 500,
            headers: corsHeaders
          }
        );
      }
    }

    // Basic Worker test page
    return new Response(
      "Plot Twist AI API is running.",
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/plain"
        }
      }
    );
  }
};
