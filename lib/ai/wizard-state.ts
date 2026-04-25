import { COUNTRIES } from "@/lib/data/countries";
import type { DataPersona, Plan, WizardIntent } from "@/lib/types/plans";

export type ChatRole = "assistant" | "user";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  /** Plans recommended alongside this assistant message */
  plans?: Plan[];
};

export const DATA_PERSONA_CHIPS: DataPersona[] = [
  "Budget",
  "Balanced",
  "Heavy",
  "Unlimited",
];

const durationRegex = /(\d+)\s*(day|days|week|weeks)/i;

const parseDuration = (text: string): number | undefined => {
  const match = text.match(durationRegex);
  if (!match) return undefined;
  const value = Number(match[1]);
  const unit = match[2].toLowerCase();
  if (Number.isNaN(value) || value <= 0) return undefined;
  return unit.startsWith("week") ? value * 7 : value;
};

const parsePersona = (text: string): DataPersona | undefined => {
  const lower = text.toLowerCase();
  if (lower.includes("unlimited")) return "Unlimited";
  if (lower.includes("heavy")) return "Heavy";
  if (lower.includes("balanced") || lower.includes("moderate")) return "Balanced";
  if (lower.includes("budget") || lower.includes("light")) return "Budget";
  return undefined;
};

const parseDestinationSlug = (text: string): string | undefined => {
  const lower = text.toLowerCase();
  return COUNTRIES.find((country) => lower.includes(country.name.toLowerCase()))?.slug;
};

export const deriveIntent = (current: WizardIntent, userInput: string): WizardIntent => {
  const destination = current.destination ?? parseDestinationSlug(userInput);
  const durationDays = current.durationDays ?? parseDuration(userInput);
  const dataPersona = current.dataPersona ?? parsePersona(userInput);
  return { destination, durationDays, dataPersona };
};

export const nextAssistantPrompt = (intent: WizardIntent): string => {
  if (!intent.destination) return "Where are you travelling to?";
  if (!intent.durationDays) return "How long is your trip?";
  if (!intent.dataPersona) {
    return "How much data do you expect to use? Choose Budget, Balanced, Heavy, or Unlimited.";
  }
  return "Here are your top matches based on your trip. I can refine these if you want.";
};

export const intentProgress = (intent: WizardIntent, destinationLabel?: string) => [
  {
    label: intent.destination ? (destinationLabel ?? intent.destination) : "Destination",
    done: Boolean(intent.destination),
  },
  { label: intent.durationDays ? `${intent.durationDays} days` : "Duration", done: Boolean(intent.durationDays) },
  { label: intent.dataPersona ? intent.dataPersona : "Data need", done: Boolean(intent.dataPersona) },
];
