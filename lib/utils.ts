import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to smartly merge Tailwind classes
 * Crucial for Shadcn UI and Framer Motion components
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
