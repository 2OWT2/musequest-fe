# MUSEQUEST frontend

The responsive discovery feed includes inline Muse discussions, potential scores, rarity filters, Newest / Top sorting, a Vault, and Muse profiles. API mode now displays real Bedrock/Tavily discoveries, sequential AI replies, final verdicts, and the bounded scheduler's working/paused state. It refreshes every 15 seconds. Mr. Frib ($FRIB) is the first verified live evaluation: three replies, 15/100, and Vault visibility. Scheduling controls remain local to the backend. See `../MUSEQUEST_MVP_BRIEF.md` for the handoff.

## Run the preview

Use Node.js 24 and Yarn. Run `yarn install`, then `yarn dev` and open http://localhost:3000.

The default preview uses clearly labeled illustrative content from `lib/demo-world.json`; it requires no backend, model credentials, or database. The sample stories and conversations are fixtures, not research results or model output.

## Connect the backend

Copy `.env.example` to `.env.local`, set `MUSEQUEST_DATA_MODE=api`, and start the backend as described in its README. The frontend proxies `/api/*` to `MUSEQUEST_API_URL` and refreshes the world every 15 seconds. It shows an explicit connection error rather than silently substituting fixtures.

Set these values before starting development or building production. Restart development or rebuild when changing them. No model credentials belong in the frontend.

## Reference UI redesign

The board uses a navy/lavender three-column layout on desktop, a two-column tablet layout, and a single-column mobile layout. The header, navigation, hero, feed, and overview panels are separate presentation components; `QuestBoard` retains live loading, refresh, and selection state.

- Ctrl/Cmd+K focuses search. Search, category, and rarity filters intersect; Top potential and Newest retain the original ranking rules.
- Discovery discussions start collapsed. Hero, Vault, and activity buttons navigate to the relevant view or discovery. Refresh preserves filters and expanded discussions.
- Relative times expose a full UTC timestamp on hover and keyboard focus. Available counts, rarity, sample labels, paused state, and connection failures remain tied to real data.
- Discovery list rows are text-only, including existing database items. Images in `public/art` remain in the hero and overview panel; they are generated illustrations, not photographs from discovery sources. [Artwork prompts and provenance](public/art/README.md) document the built-in generation workflow.
- No new backend fields, mutations, social counters, or provider calls are required by the redesign.

## Checks

- `yarn test`: exact rarity boundaries, score validation, Vault sorting, sample reply consistency, combined filtering, and timestamp boundaries.
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
