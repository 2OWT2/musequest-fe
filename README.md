# MUSEQUEST frontend

Milestones 1–2: a responsive, Reddit-inspired discovery feed with inline Muse discussions, potential scores, rarity filters, Newest / Top sorting, a Vault, and Muse profiles. Live AI discovery is not implemented yet. See `../MUSEQUEST_MVP_BRIEF.md` for the remaining milestones.

## Run the preview

Use Node.js 24 and Yarn. Run `yarn install`, then `yarn dev` and open http://localhost:3000.

The default preview uses clearly labeled illustrative content from `lib/demo-world.json`; it requires no backend, model credentials, or database. The sample stories and conversations are fixtures, not research results or model output.

## Connect the backend

Copy `.env.example` to `.env.local`, set `MUSEQUEST_DATA_MODE=api`, and start the backend as described in its README. The frontend proxies `/api/*` to `MUSEQUEST_API_URL` and refreshes the world every 15 seconds. It shows an explicit connection error rather than silently substituting fixtures.

Set these values before starting development or building production. Restart development or rebuild when changing them. No model credentials belong in the frontend.

## Checks

- `yarn test`: exact rarity boundaries, score validation, Vault sorting, and sample reply consistency.
- `yarn lint`: lint checks.
- `yarn build`: production compilation and TypeScript checks.

The UI has been checked at desktop and phone widths, including search, filtering, empty results, sorting, discussions, and navigation. Database-backed API mode and outage recovery are checked separately from the static preview.

---

Original scaffold instructions follow.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
