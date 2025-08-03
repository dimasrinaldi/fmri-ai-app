import dayjs from "dayjs";

type TFormatOpt = "full" | "date" | "minute" | "term" | "year" | "human";
export function utilDtStr(format: TFormatOpt="full", dt?: any) {
  const dayJ = dayjs(dt);
  let dateStr = dayJ.format("YYYY-MM-DD HH:mm:ss");
  if (format == "date") {
    dateStr = dayJ.format("YYYY-MM-DD");
  } else if (format == "minute") {
    dateStr = dayJ.format("YYYY-MM-DD HH:mm");
  } else if (format == "term") {
    dateStr = dayJ.format("MMM-YY");
  } else if (format == "year") {
    dateStr = dayJ.format("YYYY");
  } else if (format == "human") {
    dateStr = `${dayJ.format("D MMMM YYYY")} at ${dayJ.format("HH:mm")}`;
  }
  return `${dateStr}`;
}
