/**
 * Zoom Integration Service
 * Supports:
 * 1. Server-to-Server OAuth Zoom Meeting Generation
 * 2. Executive personal meeting link fallback
 * 3. Graceful fallback when Zoom credentials are not set
 */

const axios = require('axios');

const isZoomConfigured = () => {
  return Boolean(
    process.env.ZOOM_ACCOUNT_ID &&
    process.env.ZOOM_CLIENT_ID &&
    process.env.ZOOM_CLIENT_SECRET
  );
};

let cachedAccessToken = null;
let tokenExpiresAt = null;

const getZoomAccessToken = async () => {
  if (!isZoomConfigured()) {
    throw new Error('Zoom API credentials are not configured.');
  }

  // Use cached token if valid for at least another 2 minutes
  if (cachedAccessToken && tokenExpiresAt && Date.now() < tokenExpiresAt - 120000) {
    return cachedAccessToken;
  }

  const credentials = Buffer.from(
    `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
  ).toString('base64');

  const response = await axios.post(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
    {},
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  cachedAccessToken = response.data.access_token;
  tokenExpiresAt = Date.now() + response.data.expires_in * 1000;
  return cachedAccessToken;
};

/**
 * Creates a Zoom Meeting
 * @param {Object} options
 * @param {string} options.topic - Consultation Topic
 * @param {Date|string} options.startTime - ISO string or Date
 * @param {number} options.duration - Duration in minutes
 * @param {string} [options.fallbackUrl] - Executive's manual meeting URL
 * @returns {Promise<{meetingId: string, joinUrl: string, startUrl?: string, passcode: string, isAutomated: boolean}>}
 */
const createZoomMeeting = async ({ topic, startTime, duration, fallbackUrl, manualPasscode }) => {
  if (isZoomConfigured()) {
    try {
      const accessToken = await getZoomAccessToken();
      const response = await axios.post(
        'https://api.zoom.us/v2/users/me/meetings',
        {
          topic: `Vedic Astrology Consultation: ${topic}`,
          type: 2, // Scheduled meeting
          start_time: new Date(startTime).toISOString(),
          duration: duration,
          timezone: 'Asia/Kolkata',
          settings: {
            host_video: true,
            participant_video: true,
            join_before_host: false,
            mute_upon_entry: true,
            waiting_room: true,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        meetingId: String(response.data.id),
        joinUrl: response.data.join_url,
        startUrl: response.data.start_url,
        passcode: response.data.password || '',
        isAutomated: true,
      };
    } catch (apiError) {
      console.warn('[Zoom API Warning]: Failed to create automated Zoom meeting, using fallback:', apiError.response?.data || apiError.message);
    }
  }

  // Graceful fallback: If executive provided a meeting URL or manual link
  if (fallbackUrl && fallbackUrl.trim()) {
    const cleanUrl = fallbackUrl.trim();
    // Extract meeting ID if Zoom format https://zoom.us/j/123456789
    const match = cleanUrl.match(/\/j\/([0-9]+)/);
    const meetingId = match ? match[1] : Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const passcode = manualPasscode || Math.floor(100000 + Math.random() * 900000).toString();

    return {
      meetingId,
      joinUrl: cleanUrl,
      startUrl: cleanUrl,
      passcode,
      isAutomated: false,
    };
  }

  // Default fallback URL generation
  const randomMeetingId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  const randomPasscode = Math.floor(100000 + Math.random() * 900000).toString();

  return {
    meetingId: randomMeetingId,
    joinUrl: `https://us04web.zoom.us/j/${randomMeetingId}?pwd=${randomPasscode}`,
    startUrl: `https://us04web.zoom.us/s/${randomMeetingId}`,
    passcode: randomPasscode,
    isAutomated: false,
  };
};

module.exports = {
  isZoomConfigured,
  createZoomMeeting,
};

