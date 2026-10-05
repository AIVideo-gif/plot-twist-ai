export default {
  async fetch(request, env) {
    const allowedOrigin = "https://aivideo-gif.github.io";

    const corsHeaders = {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle browser CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    try {
      const body = await request.json();

      const command = body.command || "";
      const length = body.length || "medium";
      const style = body.style || "cinematic";

      if (!command.trim()) {
        return new Response(
          JSON.stringify({ error: "No story command provided." }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      const prompt = `
You are the AI story engine for Plot Twist AI.

Create an original dramatic story package based on the user's command.

USER COMMAND:
${command}

STORY LENGTH:
${length}

STYLE:
${style}

Return ONLY valid JSON using this exact structure:

{
  "title": "Story title",
  "hook": "A powerful opening hook",
  "story": "The complete story",
  "characters": [
    {
      "name": "Character name",
      "role": "Character role",
      "appearance": "Detailed physical appearance",
      "clothing": "Detailed clothing",
      "personality": "Personality description",
      "voice": "Voice description",
      "visualPrompt": "Detailed AI image generation prompt for this character"
    }
  ]
}

Do not use markdown.
Do not wrap the JSON in code fences.
`;

      const aiResponse = await env.AI.run(
        "@cf/meta/llama-3.1-8b-instruct",
        {
          messages: [
            {
              role: "system",
              content:
                "You are a professional cinematic story writer. Always return valid JSON only.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        }
      );

      let output = aiResponse.response || aiResponse;

      if (typeof output === "string") {
        output = output
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/i, "");

        try {
          output = JSON.parse(output);
        } catch {
          return new Response(
            JSON.stringify({
              error: "AI returned invalid JSON.",
              raw: output,
            }),
            {
              status: 500,
              headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
              },
            }
          );
        }
      }

      return new Response(JSON.stringify(output), {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "AI request failed.",
          details: error.message,
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
  },
};
