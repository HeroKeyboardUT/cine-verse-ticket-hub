import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Hàm chuyển đổi duration (phút sang định dạng "2h 15m")
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

export const parseDuration = (
  durationString: string | number | null | undefined
): number => {
  // Nếu là số, giả định đã ở dạng phút
  if (typeof durationString === "number") {
    return durationString;
  }

  // Nếu là null hoặc undefined, trả về 0
  if (durationString == null) {
    return 0;
  }

  // Chuyển thành chuỗi nếu chưa phải
  const durationStr = String(durationString);
  let minutes = 0;

  // Tìm giờ (nếu có)
  const hourMatch = durationStr.match(/(\d+)h/);
  if (hourMatch && hourMatch[1]) {
    minutes += parseInt(hourMatch[1], 10) * 60;
  }

  // Tìm phút (nếu có)
  const minuteMatch = durationStr.match(/(\d+)(?:m|p)/);
  if (minuteMatch && minuteMatch[1]) {
    minutes += parseInt(minuteMatch[1], 10);
  }

  return minutes;
};
