# worker-mailer-api

A small, fast email service API built with [Hono](https://hono.dev/) and designed to run on Cloudflare Workers. It exposes a single endpoint to send transactional emails through [Resend](https://resend.com/), wrapping the content in a neutral responsive HTML template and a plain-text fallback.

## 🚀 Features

- **Hono on Cloudflare Workers** — Web-Standard, edge-native, tiny cold start
- **Email via Resend** — sends both `html` and `text` versions
- **Neutral HTML template** — inlined as a TS module (Workers has no filesystem)
- **Attachments** — base64-encoded file attachments
- **CORS allowlist** — origin validation via the `DOMAINS` variable (403 if not allowed)
- **Auth detection** — Basic / JWT header parsing on protected routes
- **Workers-safe validation** — manual input validation (no `eval`/codegen)
- **TypeScript** — full type safety

## 📋 Prerequisites

- Node.js 20+
- A Cloudflare account (for deployment)
- A [Resend](https://resend.com/) account with a **verified domain**

## 🛠️ Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/IsmaellHV/hono-cf.git worker-mailer-api
   cd worker-mailer-api
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up local variables** — Workers uses `.dev.vars` (not `.env`):

   ```bash
   cp .dev.vars.example .dev.vars
   ```

   Then edit `.dev.vars`:

   ```ini
   PREFIX=v1
   DOMAINS=["ismaelhv.com","ihurtadov.com","localhost"]
   RESEND_API_TOKEN=re_xxxxxxxxxxxxxxxxxxxxxxxx
   RESEND_FROM=NOTIFICACIONES <no-reply@yourdomain.com>
   ```

## 🚀 Usage

### Development

```bash
npm run dev
```

The API runs at `http://localhost:8787`.

### Production Deployment

```bash
npm run deploy
```

Then upload the variables as secrets (the `.dev.vars` file is local only):

```bash
npx wrangler secret put PREFIX
npx wrangler secret put DOMAINS
npx wrangler secret put RESEND_API_TOKEN
npx wrangler secret put RESEND_FROM
```

> ⚠️ In production, `DOMAINS` must include the real origin(s) that call this API, or CORS will reject them with `403`.

## 📚 API

### Send Email

**POST** `/api/{PREFIX}/master/mail/sendMail`

With `PREFIX=v1`, the path is `/api/v1/master/mail/sendMail`.

Requires a request `Origin` (or `Host`) header included in `DOMAINS`.

#### Request body

```json
{
  "subject": "Email subject",
  "cuerpo": "Email body (HTML allowed)",
  "saludo": "Optional greeting",
  "name": "Optional sender display name",
  "to": ["recipient@example.com"],
  "cc": ["cc@example.com"],
  "bcc": ["bcc@example.com"],
  "attachment": [
    { "filename": "document.pdf", "base64": "base64_encoded_content" }
  ]
}
```

- `subject` and `cuerpo` are **required**.
- At least one of `to` / `cc` / `bcc` is **required** (string or array of emails).
- `saludo` and `cuerpo` are joined to build the email body; `name` (if set) becomes the sender display name.

#### Responses

```jsonc
// 200 OK
true

// 406 Not Acceptable (validation or Resend error)
{ "error": true, "errorDescription": "parámetros de ingreso no presenta la propiedad cuerpo" }

// 403 Forbidden (origin not in DOMAINS)
{ "error": true, "errorDescription": "Origen no permitido", "errorCode": 0, "message": "Origen no permitido" }
```

#### Example

```bash
curl -X POST https://worker-mailer-api.<account>.workers.dev/api/v1/master/mail/sendMail \
  -H "Content-Type: application/json" \
  -H "Origin: https://ismaelhv.com" \
  -d '{"subject":"Hello","saludo":"Hi:","cuerpo":"This is a <b>test</b>.","name":"System","to":["you@example.com"]}'
```

## 🏗️ Architecture

Clean / hexagonal (DDD) structure:

```
src/
├── index.ts                         # Worker entry (fetch handler)
├── env/                             # Bindings + getEnvironment()
├── rest/                            # Hono server, router, manager interface
├── types/                           # IError
└── context/
    ├── shared/Infraestructure/
    │   ├── AdapterAuthorization.ts  # Basic/JWT auth
    │   ├── AdapterMailClient.ts     # builds HTML/text + orchestrates send
    │   ├── AdapterMailResend.ts     # Resend SDK wrapper
    │   └── templates/generico.ts    # inlined HTML template
    └── Master/Mail/
        ├── Application/             # UseCaseSendMail
        ├── Domain/                  # EntityMain, RepositoryMain, ...
        └── Infraestructure/         # Router, Controller, RepositoryMainImpl
```

- **Domain** — entities and repository interfaces
- **Application** — use cases
- **Infrastructure** — Resend, validation, HTTP wiring

## 🔧 Configuration

`wrangler.jsonc`:

```jsonc
{
  "name": "worker-mailer-api",
  "main": "src/index.ts",
  "compatibility_date": "2025-03-06"
}
```

## 📦 Dependencies

- **hono** — web framework for Cloudflare Workers
- **resend** — email delivery
- **ua-parser-js** — user-agent parsing

Dev:

- **@types/node** — Node type definitions
- **wrangler** — Cloudflare Workers CLI

## 📄 License

MIT — see [LICENSE](LICENSE).

## 🔒 Security

To report security issues, see [SECURITY.md](SECURITY.md).

## 👨‍💻 Author

**Ismael Hurtado**

- Email: [ismaelhv@outlook.com](mailto:ismaelhv@outlook.com)
- LinkedIn: [ihurtadov](https://www.linkedin.com/in/ihurtadov/)
- GitHub: [IsmaellHV](https://github.com/IsmaellHV)
- Portfolio: [ismaelhv.com](https://ismaelhv.com)
