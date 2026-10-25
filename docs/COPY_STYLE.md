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

Ask a concrete, visitor-centred question, then show specific areas of support. Keep the instruction above the options in muted text with no arrow or link styling. The steady instruction explains the interaction whenever the overview is visible; it hides while an area is selected and returns with the overview. Selection adds a small, brief emphasis and reveals the relevant benefit and contact action. All animation respects reduced-motion preferences, following [W3C guidance on interaction animation](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions).

## Inner-page heroes

Make the page subject explicit in the main heading: Websites and Technology Support, Products We're Developing, About Motchi Solutions, Contact Motchi Solutions, and Privacy Notice. Follow with a short explanation of what visitors can find or do. Put useful details in the page body rather than making visitors interpret a slogan. This follows [GOV.UK guidance on clear titles](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/writing-guidelines/clear-titles/) and [NNGroup guidance on descriptive headings](https://www.nngroup.com/articles/microcontent-how-to-write-headlines-page-titles-and-subject-lines/).

Apply the same conventions to Websites and Consulting: name the page subject in its heading, describe a concrete business need before specialist terminology, and label optional detail “What This Includes.” Navigation uses Services and How We Work while preserving the app's existing routes. Shared controls, page entrances, reveal thresholds, active-step colours, crossfades, and reduced-motion handling apply across all three sites. Homepage compositions retain each branch's identity.

Use Contact Us for general contact buttons and Learn More About Motchi (or the relevant branch name) for About-page links. Keep topic-specific actions such as Discuss Your Website where the visitor has already chosen a service. Avoid phrases such as Meet Motchi or Talk to Motchi that can suggest Motchi is a person's name.

## Hero and geographic positioning

Marketing page heroes pair an explicit page label with a concise, descriptive benefit, a short explanation, and one useful next action. Homepages show a consistent MOTCHI parent name and branch label. Geography is company context rather than a service promise: use “Based in Toronto. Working with businesses globally.” in the footer and About content. Avoid location-led hero headlines or repeated local positioning. Privacy needs a clear document title; contact needs a direct invitation and form rather than a promotional hero.

Website affordability copy connects the scope to business needs and budget. The starter offer is a focused one-page website from CAD $149 using supplied text and images, responsive design, and a simple contact link. Revision allowance and final scope are agreed before work begins; additional pages, integrations, applicable taxes, domain, hosting, and ongoing care are separate. Pricing is defined once in `packages/config/src/sites.ts`. Maintenance is an agreed service, never a promise of unlimited changes or uninterrupted availability. The optional website budget appears on Websites enquiries and Solutions enquiries with the Websites interest; blank and undecided budgets are welcome.

The Solutions Services explorer connects four business goals to an illustrative path and a topic-specific contact action. Visuals represent possibilities, not client results or promised performance. Animation responds to selection, never loops for attention, and respects reduced motion.

## Heading review

Headings describe the content beneath them, use familiar words, and distinguish adjacent sections. Service sections name the services; process sections explain the stages; scope sections name responsibilities and support; final contact sections invite planning the next step. Repeating the same contact invitation across pages is intentional because it performs the same task. Avoid repeating broad questions in neighboring sections. About teasers use a concise statement of approach instead of repeating the brand name already shown in the eyebrow. Preserve real project and product names and direct Contact, Privacy, and error-page titles. Do not add unsupported success claims, urgency, certifications, or assurances of conversion uplift.

These choices follow [NN/g's descriptive microcontent guidance](https://www.nngroup.com/articles/microcontent-how-to-write-headlines-page-titles-and-subject-lines/) and [GOV.UK's guidance on writing for user interfaces](https://www.gov.uk/service-manual/design/writing-for-user-interfaces). They are editorial improvements; their effect on enquiries would need user testing or measurement.

## Friendly Solutions and Websites copy

Use short sentences and familiar verbs such as choose, build, check, and help. Explain technical terms when they matter; retain responsive design, data security, data governance, and data residency in the relevant service descriptions. Avoid em dashes in public copy. Use a comma, a full stop, or a semicolon when it makes the sentence easier to follow. The Services explorer keeps one paragraph per goal. An extra inline explanation appears from the large-screen breakpoint, while smaller screens retain the shorter description. Do not introduce extra headings or repeated reassurance.

The Products page uses a two-product spotlight with the approved Pop Tips artwork and a question-mark placeholder for Age Verification. Descriptions and availability come from the shared product data. Both remain coming soon, with no invented features or dates. Selecting a product triggers one lift-and-settle animation; pointer tilt is decorative, mouse-only, and disabled for reduced motion. Product enquiries preselect the Products interest. A no-JavaScript fallback includes the second product's description and contact action.
