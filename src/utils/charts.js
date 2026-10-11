export const NOT_COUNTED = ["Cancelled", "Rejected"];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const monthKey = (date) => {
  const d = new Date(date);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
};

export const lastMonths = (count = 6) => {
  const now = new Date();
  const list = [];

  for (let i = count - 1; i >= 0; i -= 1) {
    const d = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1),
    );
    list.push({ key: monthKey(d), label: MONTHS[d.getUTCMonth()] });
  }

  return list;
};
