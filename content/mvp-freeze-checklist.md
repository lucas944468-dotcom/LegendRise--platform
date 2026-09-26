# MVP Freeze Checklist (PRD §6.1 entry gates)

## Entry gates (all required before Phase 3/8 build)

- [ ] One career selected and frozen → `content/career-definition.md` committed
- [ ] Success metric defined (in career definition)
- [ ] First 10 learning/practice items defined (content inventory above)
- [ ] Core screens specified (design phase output — on hold)
- [ ] Local Postgres running + `DATABASE_URL` in `.env`
- [ ] `npm run prisma:migrate` green (creates all PRD §15 tables)
- [ ] R2 bucket + token in `.env` (media + evidence round-trip)
- [ ] Resend key in `.env` (signup verification email sends)

## Exit gates (required before calling MVP done — PRD §6.1)

- [ ] New user completes the full core flow (observed end-to-end test)
- [ ] Assessment produces rubric-linked feedback (evaluation test)
- [ ] Evidence can be saved (portfolio test)
- [ ] Dashboard shows one clear next action (usability test)
- [ ] Real users have tested the product (validation log)
