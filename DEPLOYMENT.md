# Deployment Configuration

## Netlify
Create a `_redirects` file in the public directory:
```
/*    /index.html   200
```

## Vercel
Create a `vercel.json` file:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Build Commands
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 18 or higher
