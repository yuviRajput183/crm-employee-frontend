import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateInput) {
  if (!dateInput) return "";

  // If the date is already formatted as "DD/MM/YYYY-HH:MM AM|PM", return it directly
  if (typeof dateInput === 'string' && /^\d{2}\/\d{2}\/\d{4}-\d{2}:\d{2} (AM|PM)$/i.test(dateInput.trim())) {
    return dateInput.trim();
  }
  
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "Invalid Date";

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const strHours = String(hours).padStart(2, '0');

  return `${day}/${month}/${year}-${strHours}:${minutes} ${ampm}`;
}
