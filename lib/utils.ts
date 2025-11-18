import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Constructs a valid URL with proper fallback handling
 * @param baseUrl - The base URL from environment variables
 * @param path - The path to append to the base URL
 * @param fallback - Fallback URL if baseUrl is not provided (defaults to localhost:3000)
 * @returns A valid URL string
 */
export function constructValidUrl(
  baseUrl: string | undefined,
  path: string,
  fallback: string = "http://localhost:3000"
): string {
  // If baseUrl is not set, use fallback
  const base = baseUrl || fallback

  // Ensure the base URL has a protocol
  const urlWithProtocol = base.startsWith("http://") || base.startsWith("https://") ? base : `http://${base}`

  // Remove trailing slash from base and ensure path starts with /
  const cleanBase = urlWithProtocol.replace(/\/$/, "")
  const cleanPath = path.startsWith("/") ? path : `/${path}`

  return `${cleanBase}${cleanPath}`
}

/**
 * Validates if a string is a valid URL
 * @param url - The URL string to validate
 * @returns boolean indicating if the URL is valid
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
}
