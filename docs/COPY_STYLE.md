# Motchi Copy Style

Write for a visitor deciding what to do next. Lead with the business need or useful outcome, explain the support in plain language, then offer a specific action. Keep Motchi approachable and technically credible without unsupported claims, jargon, or generic agency slogans.

## Practical conventions

- Headings communicate a benefit or answer a real question. Labels such as Services and Products describe their destination clearly.
- Body copy uses short, active sentences and sentence case. Use familiar verbs: build, connect, choose, support.
- Buttons describe the next conversation: Discuss Your Website, Talk About AI, Discuss Your Data. Avoid repeating vague calls to action where a specific topic is known.
- Reveal useful detail after a deliberate action. Keep the purpose and next step visible, with comfortable reading sizes.
- Preserve confirmed facts. Do not invent product capabilities, availability, results, clients, prices, or guarantees.

The capability headings, explanations, and contact actions share `packages/ui/src/capability-content.ts`. Contact topic parameters are matched to that allowlist; unknown topics do not change the form. The visitor may change the preselected area of interest. Server validation remains authoritative.

## References

These conventions adapt [Nielsen Norman Group's guidance on concise, scannable, objective web writing](https://www.nngroup.com/articles/concise-scannable-and-objective-how-to-write-for-the-web/) and [GOV.UK's task-based user-needs guidance](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/plan-manage-content/identify-user-needs/). Use their principles, not copied marketing language.

## Interactive hero

Ask a concrete, visitor-centred question, then show specific areas of support. Keep the instruction below the options in muted text with no arrow or link styling. A slow opacity pulse draws attention whenever the overview is visible; it hides while an area is selected and returns with the overview. Selection adds a small, brief emphasis and reveals the relevant benefit and contact action. All animation respects reduced-motion preferences, following [W3C guidance on interaction animation](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions).

## Inner-page heroes

Make the page subject explicit in the main heading: Websites and Technology Support, Products We're Developing, About Motchi Solutions, Contact Motchi Solutions, and Privacy Notice. Follow with a short explanation of what visitors can find or do. Put useful details in the page body rather than making visitors interpret a slogan. This follows [GOV.UK guidance on clear titles](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/writing-guidelines/clear-titles/) and [NNGroup guidance on descriptive headings](https://www.nngroup.com/articles/microcontent-how-to-write-headlines-page-titles-and-subject-lines/).

Apply the same conventions to Websites and Consulting: name the page subject in its heading, describe a concrete business need before specialist terminology, and label optional detail “What This Includes.” Navigation uses Services and How We Work while preserving the app's existing routes. Shared controls, page entrances, reveal thresholds, active-step colours, crossfades, and reduced-motion handling apply across all three sites. Homepage compositions retain each branch's identity.

Use Contact Us for general contact buttons and Learn More About Motchi (or the relevant branch name) for About-page links. Keep topic-specific actions such as Discuss Your Website where the visitor has already chosen a service. Avoid phrases such as Meet Motchi or Talk to Motchi that can suggest Motchi is a person's name.
