// utils/dateUtils.js

export const getFormattedToday = () => {
  const today = new Date();
  return today.toLocaleDateString("en-US", {
    weekday: "short", // e.g., Monday
    month: "short", // e.g., July
    day: "numeric", // e.g., 8
    year: "numeric", // e.g., 2025
  });
};
