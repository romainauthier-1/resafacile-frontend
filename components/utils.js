export function capitalize(string) {
  if (typeof string !== "string" || string.length === 0) {
    return string;
  }

  return string[0].toUpperCase() + string.slice(1);
}

export const colors = {
  primary: "#B8958A", // Marron
  primaryLight: "#DFCEC8", // Marron clair
  secondary: "#8AADB8", // Bleu gris
  secondaryLight: "#C9D9DE", // Bleu gris clair
  white: "#FFFFFF",
  text: "#536176",
  muted: "#8692a7",
  lightGray: "#c4c9cd",
  background: "#958AB8", // Violet foncé
  backgroundLight: "#E2DEEB", // Violet clair
  destructive: "#ca0d0d",
};

// Transformer l'heure (format 12:30) en 'minutes depuis minuit' pour l'envoyer à la BDD
export const convertTimeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

// Transformer les 'minutes depuis minuit' de la BDD en heure lisible
export const convertMinutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
};
