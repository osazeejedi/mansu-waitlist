import type { VercelRequest, VercelResponse } from '@vercel/node';

// Google Apps Script URL from environment variable
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || '';

// Validation
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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
    const { email } = req.body;

    // Validate required field
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Sanitize input
    const sanitizedEmail = sanitizeInput(email);

    // Validate email format
    if (!isValidEmail(sanitizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address',
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
    // Sending email with empty name/phone to match the existing sheet structure
    const payload = {
      fullName: '',
      email: sanitizedEmail,
      phone: '',
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
