import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// 여러 className을 합치고 Tailwind 충돌을 정리
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
