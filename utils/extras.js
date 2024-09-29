export const calculateTotalProfit = (capital, monthlyInterest, timeline) => {
  const totalInterest = monthlyInterest * timeline; // Total interest over the timeline
  return capital * totalInterest; // Example calculation; adjust as per your formula
};
