import type { VercelRequest, VercelResponse } from '@vercel/node';

// Google Apps Script URL from environment variable
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || '';

// Validation
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone: string): boolean => {
  // Allow international phone numbers with optional + and spaces/dashes
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,20}$/;
  return phoneRegex.test(phone.trim());
};

// Sanitization
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { name, email, phone, location } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !location) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPhone = sanitizeInput(phone);
    const sanitizedLocation = sanitizeInput(location);

    // Validate name
    if (sanitizedName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid name',
      });
    }

    // Validate email format
    if (!isValidEmail(sanitizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address',
      });
    }

    // Validate phone format
    if (!isValidPhone(sanitizedPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid phone number',
      });
    }

    // Check that Google Script URL is configured
    if (!GOOGLE_SCRIPT_URL) {
      console.error('GOOGLE_SCRIPT_URL environment variable is not set');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error. Please try again later.',
      });
    }

    // Prepare data for Google Apps Script
    const payload = {
      fullName: sanitizedName,
      email: sanitizedEmail,
      phone: sanitizedPhone,
      location: sanitizedLocation,
    };

    console.log('Sending to Google Apps Script:', payload);

    // Forward to Google Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('Google Apps Script response status:', response.status);

    const responseText = await response.text();
    console.log('Google Apps Script raw response:', responseText);

    if (!response.ok) {
      console.error('Google Apps Script error:', response.status, response.statusText);
      return res.status(500).json({
        success: false,
        message: 'Failed to submit to waitlist. Please try again.',
      });
    }

    // Try to parse response
    let result;
    try {
      result = JSON.parse(responseText);
      console.log('Parsed Google Apps Script response:', result);
    } catch {
      // If we can't parse but request was OK, assume success
      // (Google Apps Script sometimes returns HTML on redirects)
      return res.status(200).json({
        success: true,
        message: "You're on the list! We'll notify you when we launch.",
      });
    }

    // Handle Google Apps Script response
    if (result.success || result.status === 'success') {
      return res.status(200).json({
        success: true,
        message: result.message || "You're on the list! We'll notify you when we launch.",
      });
    } else {
      console.error('Google Apps Script returned error:', result);
      return res.status(500).json({
        success: false,
        message: result.message || result.error || 'Failed to submit data',
      });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again.',
    });
  }
}
