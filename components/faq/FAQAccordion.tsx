"use client";

import { useMemo, useState } from "react";

type FAQItem = {
  question: string;
  answer: string;
  category: "eSIM Basics" | "Compatibility" | "Activation" | "Billing";
};

const FAQS: FAQItem[] = [
  {
    question: "What is an eSIM and how does it work?",
    answer:
      "An eSIM is a digital SIM profile built into your phone. You can activate a data plan by installing a profile instead of inserting a physical SIM card.",
    category: "eSIM Basics",
  },
  {
    question: "Is my device compatible with eSIM?",
    answer:
      "Most modern iPhones and many Android phones support eSIM. Check your device settings for Add eSIM.",
    category: "Compatibility",
  },
  {
    question: "How do I activate my eSIM?",
    answer:
      "Usually 1 day before travel or on arrival, depending on provider validity rules.",
    category: "Activation",
  },
  {
    question: "Can I keep my existing number?",
    answer:
      "Yes. Most travelers keep their primary line for calls and use eSIM for data.",
    category: "eSIM Basics",
  },
  {
    question: "How does billing and data usage work?",
    answer:
      "Plans are prepaid and have fixed data and validity. Track your usage in the provider app, and top up when available.",
    category: "Billing",
  },
  {
    question: "What if I need help during my trip?",
    answer:
      "Most providers offer 24/7 support through in-app chat or email. We also list support information on every comparison page.",
    category: "Billing",
  },
];

const categories = ["All", "eSIM Basics", "Compatibility", "Activation", "Billing"] as const;

export const FAQAccordion = () => {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("All");
  const [openIndex, setOpenIndex] = useState(0);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return FAQS.filter((item) => {
      const categoryMatch = activeCategory === "All" || item.category === activeCategory;
      const queryMatch =
        item.question.toLowerCase().includes(query.toLowerCase()) ||
        item.answer.toLowerCase().includes(query.toLowerCase());
      return categoryMatch && queryMatch;
    });
  }, [activeCategory, query]);

  return (
    <section className="space-y-4">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search questions"
        className="h-11 w-full rounded-lg border border-brand-navy/20 bg-white px-4 text-sm"
      />
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              activeCategory === category
                ? "bg-brand-navy text-white"
                : "border border-brand-navy/20 bg-white text-brand-navy"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map((item, index) => (
          <article key={item.question} className="rounded-xl border border-brand-navy/25 bg-white">
            <button
              onClick={() => setOpenIndex(index === openIndex ? -1 : index)}
              className="flex w-full items-center justify-between px-5 py-4 text-left text-2xl font-semibold leading-tight text-brand-navy"
            >
              {item.question}
              <span className="text-2xl">{index === openIndex ? "⌃" : "⌄"}</span>
            </button>
            {index === openIndex ? (
              <p className="border-t border-brand-navy/10 px-5 py-4 text-base text-brand-navy/75">
                {item.answer}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
};
