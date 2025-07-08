import AsyncStorage from "@react-native-async-storage/async-storage";

export const getTodayDayIndex = () => {
  const baseDate = new Date("2025-07-04"); // Day 1
  const today = new Date();

  // Clear the time part (very important)
  baseDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffInDays = Math.floor((today - baseDate) / (1000 * 60 * 60 * 24));
  return diffInDays + 1; // So June 21 = Day 1
};
