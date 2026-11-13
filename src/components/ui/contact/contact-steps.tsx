"use client";

/* The four steps of the Contact form. Each step only renders its fields; the
   state, validation timing, and navigation stay in ContactExperience so every
   step follows the same rules (AGENTS.md: Interface copy). */

import type { Branch } from "../../../lib/brand.ts";
import { contactContextLimit } from "../../../lib/config/validation.ts";
import { ContactNameHelp } from "../contact-name-help.tsx";
import type { getContactConfiguration } from "./contact-config.ts";
import { ContactField, ContactOptionGroup } from "./contact-controls.tsx";
import { ContactDisclosure } from "./contact-disclosure.tsx";
import type {
  ContactDraft,
  ContactErrors,
  EnquiryBranch,
} from "./contact-model.ts";
import { ContactPhoneField } from "./contact-phone-field.tsx";
import { ContactReview } from "./contact-review.tsx";
import { ContactServices } from "./contact-services.tsx";
import styles from "./contact.module.css";

type Questions = ReturnType<typeof getContactConfiguration>["questions"];
type Update = <K extends keyof ContactDraft>(
  key: K,
  value: ContactDraft[K],
) => void;
type ValidateField = (field: keyof ContactDraft, atStep?: number) => void;

const enquiryLabels: Record<EnquiryBranch, string> = {
  websites: "Websites",
  consulting: "Consulting",
  products: "Products",
};

// Step 1: which part of Motchi, then the services within it.
export function ServicesStep({
  draft,
  activeBranch,
  errors,
  update,
  chooseBranch,
  validateField,
  announce,
  detailsOpen,
}: {
  draft: ContactDraft;
  activeBranch: Branch | "products";
  errors: ContactErrors;
  update: Update;
  chooseBranch: (next: EnquiryBranch) => void;
  validateField: ValidateField;
  announce: (message: string) => void;
  detailsOpen: boolean;
}) {
  return (
    <>
      <ContactOptionGroup
        id="enquiryType"
        label="Pick a service"
        options={Object.values(enquiryLabels)}
        descriptions={{
          Websites: "Design, development, and maintenance.",
          Consulting: "AI, data, and hands-on support.",
          Products: "Questions, ideas, and feedback.",
        }}
        value={draft.enquiryType ? [enquiryLabels[draft.enquiryType]] : []}
        onChange={(value) => {
          const next = (Object.keys(enquiryLabels) as EnquiryBranch[]).find(
            (key) => enquiryLabels[key] === value[0],
          );
          chooseBranch(next ?? "consulting");
        }}
        onBlur={() => validateField("enquiryType", 0)}
        required
        error={errors.enquiryType}
      />

      {/* Services appear once a branch is chosen; until then they are inert
          so keyboard users do not tab into hidden options. */}
      <section
        className={styles.conditional}
        data-open={!!draft.enquiryType}
        aria-hidden={!draft.enquiryType}
        inert={!draft.enquiryType}
        aria-label="Services for your enquiry"
      >
        <div className={styles.conditionalClip}>
          <ContactServices
            key={activeBranch}
            branch={activeBranch}
            draft={draft}
            update={update}
            error={errors.services}
            onBlur={() => validateField("services", 0)}
            announce={announce}
            detailsOpen={detailsOpen}
          />
        </div>
      </section>
    </>
  );
}

// Step 2: the project questions; budget is optional and tucked in a disclosure.
export function ProjectStep({
  draft,
  questions,
  errors,
  update,
  validateField,
  editTarget,
}: {
  draft: ContactDraft;
  questions: Questions;
  errors: ContactErrors;
  update: Update;
  validateField: ValidateField;
  editTarget: string | null;
}) {
  return (["business", "stage", "timeline", "budget"] as const).map((key) => {
    const question = (
      <ContactOptionGroup
        key={key}
        id={key}
        hideLabel={key === "budget"}
        onBlur={() => validateField(key, 1)}
        {...questions[key]}
        required={key !== "budget"}
        value={draft[key] ? [draft[key]] : []}
        error={errors[key]}
        onChange={(value) => update(key, value[0])}
        hint={
          key === "budget"
            ? "Amounts are in CAD. This helps us plan, not set a final price."
            : undefined
        }
      />
    );

    if (key !== "budget") return question;

    return (
      <ContactDisclosure
        key={key}
        title="Budget range"
        defaultOpen={!!draft.budget || editTarget === "budget"}
      >
        <div className={styles.serviceDetailGroup}>{question}</div>
      </ContactDisclosure>
    );
  });
}

// Step 3: how to reach the person. Product questions skip the business fields.
export function DetailsStep({
  draft,
  activeBranch,
  questions,
  errors,
  update,
  validateField,
  validatePhone,
  updatePhone,
  editTarget,
}: {
  draft: ContactDraft;
  activeBranch: Branch | "products";
  questions: Questions;
  errors: ContactErrors;
  update: Update;
  validateField: ValidateField;
  validatePhone: () => void;
  updatePhone: (value: { countryCode: string; number: string }) => void;
  editTarget: string | null;
}) {
  const products = activeBranch === "products";

  return (
    <>
      <div className={styles.fields}>
        <ContactField
          field="name"
          onBlur={() => validateField("name")}
          label="Name"
          placeholder="Alex Morgan"
          help={<ContactNameHelp />}
          value={draft.name}
          onChange={(value) => update("name", value)}
          autoComplete="name"
          required
          error={errors.name}
        />
        <ContactField
          field="email"
          placeholder="name@example.com"
          onBlur={() => validateField("email")}
          label="Email"
          value={draft.email}
          onChange={(value) => update("email", value)}
          type="email"
          autoComplete="email"
          required
          error={errors.email}
        />

        {!products && (
          <>
            <ContactField
              field="organization"
              label="Business / organization"
              placeholder="Example Studio"
              value={draft.organization}
              onChange={(value) => update("organization", value)}
              autoComplete="organization"
            />
            <ContactField
              field="website"
              help="A full website address looks like https://example.com. You can leave this blank if you don't have a website."
              placeholder="https://example.com"
              onBlur={() => validateField("website")}
              label="Website"
              value={draft.website}
              onChange={(value) => update("website", value)}
              type="url"
              autoComplete="url"
              error={errors.website}
            />
            <ContactPhoneField
              countryCode={draft.phoneCountryCode}
              number={draft.phone}
              error={errors.phone}
              countryCodeError={errors.phoneCountryCode}
              onBlur={validatePhone}
              onChange={updatePhone}
            />
          </>
        )}
      </div>

      {!products && (
        <div className={styles.group}>
          <ContactDisclosure
            title="How you found us"
            defaultOpen={!!draft.source || editTarget === "source"}
          >
            <div className={styles.serviceDetailGroup}>
              <ContactOptionGroup
                id="source"
                {...questions.source}
                hideLabel
                value={draft.source ? [draft.source] : []}
                onChange={(value) => update("source", value[0])}
              />
            </div>
          </ContactDisclosure>
        </div>
      )}

      <ContactField
        field="context"
        required={products}
        label={
          products
            ? "What would you like us to know?"
            : "Anything else you'd like to share?"
        }
        value={draft.context}
        onChange={(value) => update("context", value)}
        onBlur={() => validateField("context")}
        error={errors.context}
        multiline
        maxLength={contactContextLimit}
        help="Please use up to 2,000 characters. A few sentences about your idea or problem is enough."
      />
    </>
  );
}

// Step 4: everything at a glance, each answer editable in place.
export function ReviewStep({
  draft,
  edit,
  disabled,
}: {
  draft: ContactDraft;
  edit: (target: number, field: string) => void;
  disabled: boolean;
}) {
  return (
    <>
      <ContactReview draft={draft} edit={edit} disabled={disabled} />
      <p className={styles.hint}>
        We'll use the information you provide to respond to your enquiry. You
        can read our <a href="/privacy">privacy policy</a>.
      </p>
    </>
  );
}
