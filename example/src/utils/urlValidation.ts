/**
 * URL validation and sanitization utilities
 */

export type ValidationResult = {
  isValid: boolean;
  errorMessage?: string;
};

/**
 * Basic URL format validation
 */
function isValidURLFormat(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize URL by trimming and ensuring it has a protocol
 */
export function sanitizeURL(url: string): string {
  let sanitized = url.trim();
  
  // If URL doesn't start with http:// or https://, add https://
  if (sanitized && !sanitized.match(/^https?:\/\//i)) {
    sanitized = `https://${sanitized}`;
  }
  
  return sanitized;
}

/**
 * Validate image URL
 */
export function validateImageURL(url: string): ValidationResult {
  const sanitized = sanitizeURL(url);
  
  if (!isValidURLFormat(sanitized)) {
    return {
      isValid: false,
      errorMessage: "Please enter a valid URL",
    };
  }

  // Check if URL points to an image file or common image hosting domains
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i;
  const imageHosts = /(imgur\.com|cloudinary\.com|unsplash\.com|pexels\.com)/i;
  
  const parsedURL = new URL(sanitized);
  if (!imageExtensions.test(parsedURL.pathname) && !imageHosts.test(parsedURL.hostname)) {
    return {
      isValid: false,
      errorMessage: "URL should point to an image (e.g., .jpg, .png) or be from a known image host",
    };
  }

  return { isValid: true };
}

/**
 * Validate YouTube URL
 */
export function validateYouTubeURL(url: string): ValidationResult {
  const patterns = [
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    if (pattern.test(url)) {
      return { isValid: true };
    }
  }

  // Check if it's already a video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return { isValid: true };
  }

  return {
    isValid: false,
    errorMessage: "Please enter a valid YouTube URL or video ID",
  };
}

/**
 * Validate Tweet URL
 */
export function validateTweetURL(url: string): ValidationResult {
  const pattern = /^(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)(?:[/?#].*)?$/;
  
  if (pattern.test(url)) {
    return { isValid: true };
  }

  // Check if it's already a tweet ID
  if (/^\d+$/.test(url)) {
    return { isValid: true };
  }

  return {
    isValid: false,
    errorMessage: "Please enter a valid Tweet URL (twitter.com or x.com) or tweet ID",
  };
}

/**
 * Validate Figma URL
 */
export function validateFigmaURL(url: string): ValidationResult {
  const pattern = /^(?:https?:\/\/)?(?:www\.)?figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)(?:[/?#].*)?$/;
  
  if (pattern.test(url)) {
    return { isValid: true };
  }

  return {
    isValid: false,
    errorMessage: "Please enter a valid Figma file or design URL",
  };
}
