# Campus Connect - Vite + React + TS

## Supabase Setup
1. Create a Supabase project.
2. Copy the project URL and anon key.
3. Create a `.env` file in the project root with:

```
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Local Development
```
npm install
npm run dev
```

## Production Build
```
npm run build
npm run preview
```

## Deploy to Vercel
1. Push this repo to GitHub.
2. Import the project in Vercel.
3. Set Environment Variables in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Vercel detects Vite. Output dir: `dist`.
5. `vercel.json` ensures SPA routing to `index.html`.


