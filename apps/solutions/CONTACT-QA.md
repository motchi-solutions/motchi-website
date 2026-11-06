# Contact form handoff

The Contact experience now lives in `packages/ui/src/contact/` and is shared by Solutions, Websites, and Consulting. See [the shared contact form documentation](../../docs/CONTACT_FORMS.md) for the current component, validation, counter, draft, responsive, and submission contracts.

Solutions retains its approved introduction, service choices, and submission availability. The old app-local model and phone imports are compatibility exports for its regression tests. Websites and Consulting configure their own service questions and retain their existing submission endpoints.

The optional message limit is 2,000 characters. The textarea has a reserved counter footer and an InfoTip describing the limit; reaching it turns the counter burgundy and blocks additional input without an error.

No commits, pushes, or real email submissions are part of this handoff.
