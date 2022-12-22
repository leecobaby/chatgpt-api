/// <reference lib="dom" />

// Use `fetch` for node.js >= 18
// Use `fetch` for all other environments, including browsers
type Fetch = typeof globalThis.fetch

interface NewFetch extends Fetch {
  (input: RequestInfo, init: NewRequestInit): Promise<Response>
}

interface NewRequestInit extends RequestInit {
  /** Not the best way */
  dispatcher: any
}

const fetch: NewFetch = globalThis.fetch

if (typeof fetch !== 'function') {
  throw new Error(
    'Invalid environment: global fetch not defined; `chatgpt` requires Node.js >= 18 at the moment due to Cloudflare protections'
  )
}

export { fetch }
