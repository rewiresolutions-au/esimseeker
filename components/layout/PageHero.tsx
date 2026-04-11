type PageHeroProps = {
  breadcrumb?: string;
  title: string;
  description: string;
  children?: React.ReactNode;
  /** Override spacing above optional children (default mt-6). Use e.g. mt-3 to sit closer to description. */
  childrenWrapperClassName?: string;
};

export const PageHero = ({
  breadcrumb,
  title,
  description,
  children,
  childrenWrapperClassName = "mt-6",
}: PageHeroProps) => {
  return (
    <section className="rounded-2xl border border-brand-navy/10 bg-white p-6 md:p-8">
      {breadcrumb ? (
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-teal">
          {breadcrumb}
        </p>
      ) : null}
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-brand-navy md:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-3xl text-brand-navy/75">{description}</p>
      {children ? <div className={childrenWrapperClassName}>{children}</div> : null}
    </section>
  );
};
