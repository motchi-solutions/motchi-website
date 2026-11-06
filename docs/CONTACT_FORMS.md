# Shared contact forms

All three sites use `packages/ui/src/contact/` for the four-step contact experience. Do not copy the wizard into individual apps. Site-specific services, descriptions, optional follow-ups, budgets, topic aliases, and routing categories live in `contact-config.ts`.

## Interface contract

- The centered introduction and constrained form, progress navigation, optional details disclosure, review rows, spacing, type scale, selected states, focus, and motion share one implementation.
- Forward navigation opens the first incomplete step directly. New errors wait for blur or an attempt to continue; existing errors refresh during typing and autofill and disappear when valid.
- Errors follow the label and any visible helper text, before the field/options. On sufficiently wide and tall screens, the form slides left and a sticky linked reminder replaces the in-form summary. Resolved rows fade and collapse; the form returns to center when resolved. Smaller screens retain the inline summary. Respect reduced motion.
- `Anything else you'd like to share?` is optional and limited to 2,000 characters, defined by `contactContextLimit`. Its tooltip explains the limit. Users can type or paste longer messages and edit them down; validation runs on blur or navigation and existing errors clear during correction. Saved drafts retain the full message. The textarea resizes vertically, and the counter sits below it without overlapping text or the resize handle.
- Required semantics, Unicode name rules, field-specific filtering, split international phone handling, and accessible InfoTip interactions are shared.
- `contact-result.tsx` provides the shared result panel structure. A confirmed success uses a decorative animated checkmark, concise next steps, and a clear action; reduced motion shows the checkmark immediately. Future failure states can supply their own copy, icon, and appropriate status role using the same panel. Do not display a reference ID until the backend provides one.

## Drafts

Saving is unchecked by default. Each site saves one draft under `motchi:<branch>:contact-draft:v1`, with explicit branch metadata and three-day retention from the last save. A saved draft is offered for continuation before its answers are shown. Starting fresh warns about replacement. Unchecking saving removes the stored draft while preserving current in-memory answers.

Legacy Solutions drafts remain supported. Messages exceeding the 2,000-character limit are preserved in full for editing, and the form returns users to the contact step to shorten them before continuing. Site-specific choices and branch metadata are validated before restoration; one branch cannot restore another branch's record.

## Submission

Websites and Consulting retain their existing `/api/contact` endpoints, token validation, honeypot, rate limits, and mail handling. `contact-submission.ts` sends URL-encoded data with one supported routing category; all selected services, details, project answers, timing, budget, phone, source, and the optional message remain in the message body. Website/organization/contact fields are preserved. Failed requests keep answers in memory. The UI prevents duplicate clicks while sending and clears the local draft only after a confirmed sent/partial response. Partial delivery tells the user not to resubmit.

Solutions keeps its existing submission availability: its app does not pass a submission adapter, so the final sending button remains disabled. Changing that is a separate integration decision.

No real mail should be sent by UI QA. Intercept `/api/contact` in the isolated browser to exercise failed and successful outcomes. Existing submission tests mock the email provider.

## Verification

- `npm run lint`, `npm run typecheck`, and `npm test` cover the shared code and existing endpoints.
- `node --test apps/solutions/src/components/contact/contact-model.test.mjs` preserves the original Solutions model checks through compatibility exports.
- `tests/contact-wizard.test.mjs` covers targeted choices, navigation, branch-scoped drafts, preservation of over-limit messages, and complete API-compatible payloads.
- Browser QA covers all four pages on each site at 320, 375, 430, 768, 1024, 1200, 1280, 1366, 1440, 1920, and 2560px, active corrections, filtering, phone paste, the counter, consent, restoration, and mocked submission failure/success.
- Build each app independently and check the production previews after shared changes. Safari/VoiceOver and physical mobile devices remain manual checks.
