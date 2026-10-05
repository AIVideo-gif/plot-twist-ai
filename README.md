# PLOT TWIST AI — Phone-First Starter App

This is a lightweight, phone-friendly web app starter. It provides a single-command story production dashboard and keeps provider credentials out of the browser.

## What this starter does
- Accepts one natural-language story command.
- Produces a structured fictional short-drama production plan locally in the browser.
- Includes a PLOT TWIST AI brand UI, production progress, preview fields, and approval state.
- Stores drafts locally in the browser.

## Important
This starter does NOT directly contain YouTube/API secrets and does not promise unlimited free AI video generation. Provider integrations should be added through a secure backend/serverless function so keys are never exposed in the iPhone browser.

## Run
1. Open `index.html` in a browser or deploy the folder to any static web host.
2. Enter a command such as:
   "Make a 60-second betrayal story about a husband who finds a second phone."
3. Tap CREATE STORY.
4. Review the generated production package.
5. The current starter uses a deterministic demo story generator so it works without an API key.

## Next integration layer
Connect a secure backend to:
- OpenAI for story/structured JSON generation
- an image provider for scene images
- a video provider for image-to-video
- ElevenLabs for narration
- a renderer/FFmpeg service for final MP4
- YouTube OAuth/API for upload and scheduling

Do not put API keys in `app.js` or browser JavaScript.
