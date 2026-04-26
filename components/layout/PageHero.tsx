import type { ReactNode } from "react";

type PageHeroProps = {
  breadcrumb?: ReactNode;
  title: string;
  description: string;
  children?: ReactNode;
  /** Override spacing above optional children (default mt-6). Use e.g. mt-3 to sit closer to description. */
  childrenWrapperClassName?: string;
  titleClassName?: string;
};

export const PageHero = ({
  breadcrumb,
  title,
  description,
  children,
  childrenWrapperClassName = "mt-6",
  titleClassName = "text-3xl font-bold tracking-tight text-brand-navy md:text-4xl",
}: PageHeroProps) => {
  return (
    <section className="rounded-2xl border border-brand-navy/10 bg-white p-6 md:p-8">
      {breadcrumb ? (
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-teal normal-case">
          {breadcrumb}
        </p>
      ) : null}
      <h1 className={`mt-2 ${titleClassName}`}>{title}</h1>
      <p className="mt-3 max-w-3xl text-brand-navy/75">{description}</p>
      {children ? <div className={childrenWrapperClassName}>{children}</div> : null}
    </section>
  );
};
