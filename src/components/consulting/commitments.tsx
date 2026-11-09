import Image from "next/image";
import {
  LuClipboardCheck,
  LuLifeBuoy,
  LuShieldCheck,
  LuUsers,
} from "react-icons/lu";
import { Container } from "../ui/index.ts";

const commitments = [
  {
    icon: LuClipboardCheck,
    title: "Clear scope before work starts",
    text: "Goals, responsibilities, and support are agreed for each engagement, so everyone knows what happens next.",
  },
  {
    icon: LuShieldCheck,
    title: "Your data stays in view",
    text: "We review data use, access, ownership, and where data is stored and processed as part of the plan.",
  },
  {
    icon: LuUsers,
    title: "People stay in control",
    text: "AI and automation plans include human review where it matters, and your team is involved in key decisions.",
  },
  {
    icon: LuLifeBuoy,
    title: "Support after delivery",
    text: "Handover, guidance, and an agreed support arrangement, with room to keep improving what matters.",
  },
] as const;

/* Trust: what every engagement includes, in place of claims we can't show. */
export function Commitments() {
  return (
    <section id="about" className="bg-secondary py-section text-inverse">
      <Container>
        <div className="grid gap-x-[clamp(3rem,6vw,7rem)] gap-y-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="min-w-0">
            <div className="mb-8 size-16 rounded-[0.25rem_0.25rem_1.25rem_0.25rem] bg-inverse p-2.5">
              <Image
                src="/brand/mc-logo.svg"
                alt=""
                width={1095}
                height={1095}
                className="size-full object-contain"
              />
            </div>
            <h2 className="text-h2 font-medium tracking-tight">
              What You Can Count On
            </h2>
            <p className="mt-5 max-w-136 text-body-lg leading-relaxed text-inverse/80">
              Good technical work starts with understanding your business.
              Recommendations matter most when they turn into something your
              team can use.
            </p>
            <p className="mt-6 text-small text-accent">
              Part of the Motchi family.
            </p>
          </div>
          <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {commitments.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.title}
                  className="border-t border-inverse/20 pt-6"
                >
                  <Icon aria-hidden="true" className="size-6 text-accent" />
                  <h3 className="mt-4 text-xl font-medium tracking-[-0.01em]">
                    {item.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-inverse/75">
                    {item.text}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
