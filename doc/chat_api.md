# DanaBot API

Mobile calls `POST /api/chat/` (the trailing slash is optional).
The backend must register this route; an Express `Cannot POST /api/chat/`
404 is a missing route, not a missing environment variable.

Add these settings to `Backend-SmartBus/.env`, then restart the backend:

```dotenv
GEMINI_API_KEY=your-key-from-google-ai-studio
GEMINI_MODEL=gemini-2.5-flash
```

Create a key in [Google AI Studio](https://aistudio.google.com/apikey).
Keep the key on the backend. No mobile environment change is needed.
The service uses the [Gemini generateContent REST API](https://ai.google.dev/api/generate-content).
Choose a model available to your Gemini project if overriding `GEMINI_MODEL`.

Request:

```json
{
  "messages": [{ "role": "user", "text": "Mua vé thế nào?" }],
  "locale": "vi",
  "conversationId": "c_example"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "reply": "Bạn có thể vào mục Vé để mua vé.",
    "actions": [{ "type": "open_tickets" }],
    "conversationId": "c_example"
  }
}
```

Supported locales: `vi` (default), `en`, `ja`. History uses `user`/`model` roles,
must start and end with `user`, and each message must contain 1–4000 characters.
Only the latest 20 messages are sent to Gemini. Conversations are stateless:
`conversationId` is echoed for the client, not used for server storage.
The assistant explains app usage and offers navigation actions. It does not query
live transit data or personal tickets and must direct users to app screens for those.

Errors use `{ "success": false, "message": "..." }`:

- `400`: invalid request.
- `503`: missing API key or rejected Gemini key/model configuration.
- `429`: Gemini quota/rate limit.
- `504`: Gemini took longer than 30 seconds (mobile timeout is 45 seconds).
- `502`: other upstream errors or invalid/empty Gemini output.

Regression checks: `node --test test/chat.test.js`.
