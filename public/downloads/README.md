# Lead magnet PDF

Drop the real guide here as:

```
public/downloads/tiktok-starter-guide.pdf
```

That's the exact path the `/api/subscribe` function links to by default (see
`functions/api/subscribe.js`, `PDF_PATH`). No code changes needed once the
file is in place, just commit and push.

Want a different filename, or to host the PDF somewhere else entirely (e.g. a
Google Drive link)? Set the `PDF_PATH` environment variable in Cloudflare
Pages to either a different site-relative path or a full external URL, and
it'll override this default.
