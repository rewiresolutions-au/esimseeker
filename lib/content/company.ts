export const COMPANY = {
  legalName: "Rewires Solutions Pty Ltd",
  tradingName: "eSIMSeeker",
  abn: "61 665 946 001",
  registeredCountry: "Australia",
  registeredState: "NSW",
  contactEmail: "hello@esimseeker.app",
};

export const isCompanyAbnSet = () => COMPANY.abn.trim().length > 0;

export const isCompanyEmailSet = () => COMPANY.contactEmail.trim().length > 0;
