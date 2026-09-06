// Utility functions for Showroom Management System

/**
 * Format a number as Pakistani Rupee (Rs. / PKR)
 * Example: 45000000 -> "Rs. 45,000,000"
 */
export function formatPKR(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(Number(val))) {
    return 'Rs. 0';
  }
  const num = Number(val);
  return `Rs. ${num.toLocaleString('en-PK')}`;
}

/**
 * Short luxury format in Lakhs and Crores for high values
 * Example: 145000000 -> "Rs. 14.50 Cr", 8500000 -> "Rs. 85.00 Lac"
 */
export function formatPKRShort(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(Number(val))) {
    return 'Rs. 0';
  }
  const num = Number(val);
  if (Math.abs(num) >= 10000000) {
    return `Rs. ${(num / 10000000).toFixed(2)} Cr`;
  }
  if (Math.abs(num) >= 100000) {
    return `Rs. ${(num / 100000).toFixed(2)} Lac`;
  }
  return `Rs. ${num.toLocaleString('en-PK')}`;
}

/**
 * Format phone number for WhatsApp link
 */
export function formatWhatsAppLink(phone: string, text?: string): string {
  const cleaned = phone.replace(/[^0-9]/g, '');
  const url = `https://wa.me/${cleaned}`;
  if (text) {
    return `${url}?text=${encodeURIComponent(text)}`;
  }
  return url;
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Format date and time for test drives and activity timestamps
 */
export function formatDateTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

/**
 * Relative time helper (e.g. "Just now", "5 mins ago", "2 hours ago")
 */
export function timeAgo(dateString: string): string {
  try {
    const d = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  } catch {
    return dateString;
  }
}
