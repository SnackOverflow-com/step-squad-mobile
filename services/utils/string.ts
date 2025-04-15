/**
 * Returns the correct ordinal suffix (st, nd, rd, th) for a given number
 * @param position - The number to get the suffix for
 * @returns The appropriate suffix string
 */
export const getOrdinalSuffix = (position: number): string => {
  const lastDigit = position % 10;
  const lastTwoDigits = position % 100;

  // Special case for 11, 12, 13
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return "th";
  }

  switch (lastDigit) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};
