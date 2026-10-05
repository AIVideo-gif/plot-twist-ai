export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle AI requests from the website
    if (url.pathname === "/api/generate" && request.method === "POST") {
      try {
        const body = await request.json();
        const prompt = body.prompt;

        if (!prompt) {
          return Response.json(
            { error: "Prompt is required" },
            { status: 400 }
          );
        }

        const response = await env.AI.run(
          "@cf/meta/llama-3.1-8b-instruct",
          {
            messages: [
              {
                role: "system",
                content:
                  "You are Plot Twist AI, an AI assistant that creates entertaining fictional drama stories, plot twists, scripts, titles, and social media content."
              },
              {
                role: "user",
                content: prompt
              }
            ]
          }
        );

        return Response.json(response);
      } catch (error) {
        return Response.json(
          { error: error.message },
          { status: 500 }
        );
      }
    }

    return new Response("Plot Twist AI API is running.", {
      headers: { "content-type": "text/plain" }
    });
  }
};
