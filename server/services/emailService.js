import nodemailer from 'nodemailer';
import { config } from '../config.js';
import { sendResendEmail } from './resendService.js';

let transporter;

function createTransport() {
  if (config.emailProvider === 'gmail') {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      pool: true,
      maxConnections: 3,
      auth: {
        user: config.gmailUser,
        pass: config.gmailAppPassword,
      },
    });
  }

  if (config.emailProvider === 'brevo') {
    return nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 465,
      secure: true,
      pool: true,
      maxConnections: 5,
      auth: {
        user: config.brevoUser,
        pass: config.brevoKey,
      },
    });
  }

  return nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure,
    pool: true,
    maxConnections: 5,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  });
}

export async function getMailer() {
  if (config.emailProvider === 'resend') {
    return {
      sendMail: async (options) => {
        return sendResendEmail({
          to: options.to,
          subject: options.subject,
          html: options.html,
          replyTo: options.replyTo,
          from: options.from,
        });
      },
      verify: async () => true,
    };
  }

  if (config.emailProvider === 'console') {
    return {
      sendMail: async (options) => {
        console.log('\n============================================================');
        console.log('📬 [DEVELOPMENT EMAIL LOG - BioLink System]');
        console.log(`From:    ${options.from}`);
        console.log(`To:      ${options.to}`);
        console.log(`Subject: ${options.subject}`);
        console.log('------------------------------------------------------------');
        const cleanText = (options.html || '')
          .replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        console.log(cleanText.slice(0, 300) + (cleanText.length > 300 ? '...' : ''));
        console.log('============================================================\n');
        return { messageId: 'console-stub-id' };
      },
      verify: async () => true,
    };
  }

  if (!transporter) {
    transporter = createTransport();
    transporter.verify().catch((err) => {
      console.error('❌ Mailer verification failed:', err.message);
    });
  }

  return transporter;
}

function safeHeader(value) {
  return String(value || '').replace(/[\r\n]+/g, ' ').trim();
}

export async function sendSystemEmail({ to, subject, html, replyTo, from }) {
  if (config.emailProvider === 'resend') {
    return sendResendEmail({
      to,
      subject,
      html,
      replyTo,
      from: from || `BioLink Agritech <${config.emailFromAddress || 'info@biolinkagri.in'}>`,
    });
  }

  const mailer = await getMailer();

  await mailer.sendMail({
    from: from || `"${safeHeader(config.emailFromName || 'BioLink Agritech')}" <${safeHeader(config.emailFromAddress || 'info@biolinkagri.in')}>`,
    to: safeHeader(to),
    subject: safeHeader(subject),
    html,
    ...(replyTo ? { replyTo: safeHeader(replyTo) } : {}),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTOR BRAND PALETTES & MASTER TEMPLATE WRAPPER
// ─────────────────────────────────────────────────────────────────────────────

export const SECTOR_PALETTES = {
  corporate: {
    name: 'Corporate Sourcing Hub',
    subdomain: 'biolinkagri.in',
    primary: '#0f2744',
    accent: '#2563eb',
    accentLight: '#eff6ff',
    border: '#bfdbfe',
    badgeText: '#1e40af',
    tagline: "India's Precision Agricultural Infrastructure Corridor",
  },
  manure: {
    name: 'Bio-Organic Manure Sector',
    subdomain: 'manure.biolinkagri.in',
    primary: '#064e3b',
    accent: '#059669',
    accentLight: '#ecfdf5',
    border: '#a7f3d0',
    badgeText: '#047857',
    tagline: '100% Heat-Sterilized Government-Certified FOM Dispatches',
  },
  feed: {
    name: 'Industrial Feed & Distilleries',
    subdomain: 'feed.biolinkagri.in',
    primary: '#78350f',
    accent: '#d97706',
    accentLight: '#fffbeb',
    border: '#fde68a',
    badgeText: '#b45309',
    tagline: 'Bulk Corn & Rice DDGS & Heavy Molasses Tanker Logistics',
  },
  seabuckthorn: {
    name: 'Himalayan Premium Botanicals',
    subdomain: 'seabuckthorn.biolinkagri.in',
    primary: '#7c2d12',
    accent: '#ea580c',
    accentLight: '#fff7ed',
    border: '#fed7aa',
    badgeText: '#c2410c',
    tagline: 'Pure Supercritical CO2 Sea Buckthorn Oils & Cryo Extracts',
  },
  partner: {
    name: 'KrishakJan Partner Network',
    subdomain: 'partners.biolinkagri.in',
    primary: '#0f172a',
    accent: '#10b981',
    accentLight: '#f0fdf4',
    border: '#bbf7d0',
    badgeText: '#065f46',
    tagline: 'Verified Rural Aggregator & Institutional Referral Network',
  },
};

/**
 * Normalizes sector key to match SECTOR_PALETTES
 */
function resolveSectorKey(sector) {
  if (!sector) return 'corporate';
  const s = String(sector).toLowerCase();
  if (s.includes('manure') || s.includes('fom') || s.includes('organic')) return 'manure';
  if (s.includes('feed') || s.includes('ddgs') || s.includes('molasses')) return 'feed';
  if (s.includes('seabuckthorn') || s.includes('botanical') || s.includes('berry') || s.includes('omega')) return 'seabuckthorn';
  if (s.includes('partner') || s.includes('krishak') || s.includes('referral')) return 'partner';
  return 'corporate';
}

/**
 * Master Enterprise Email Layout Wrapper
 * Inline-safe, responsive, Neumorphic accents, custom-domain verified branding
 */
export function wrapBrandedEmail({
  title,
  subtitle,
  sector = 'corporate',
  badgeText,
  contentHtml,
  actionButton = null,
  noticeHtml = null,
  refId = null,
}) {
  const theme = SECTOR_PALETTES[resolveSectorKey(sector)] || SECTOR_PALETTES.corporate;
  const badge = badgeText || theme.name;

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f5f9; padding: 32px 12px;">
    <tr>
      <td align="center">
        <!-- Master Email Card -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 640px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03); overflow: hidden;">
          
          <!-- Top Accent Band -->
          <tr>
            <td height="6" style="background-color: ${theme.accent};"></td>
          </tr>

          <!-- Header Section -->
          <tr>
            <td style="padding: 28px 32px 20px 32px; border-bottom: 1px solid #f1f5f9;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td valign="middle">
                    <div style="font-size: 20px; font-weight: 800; letter-spacing: -0.5px; color: ${theme.primary}; line-height: 1.2;">
                      BioLink <span style="color: ${theme.accent}; font-weight: 700;">AGRITECH</span>
                    </div>
                    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 600; margin-top: 3px;">
                      Verified Dispatch &bull; ${theme.subdomain}
                    </div>
                  </td>
                  <td align="right" valign="middle">
                    <span style="display: inline-block; background-color: ${theme.accentLight}; color: ${theme.badgeText}; border: 1px solid ${theme.border}; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 6px 12px; border-radius: 20px;">
                      ${badge}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Banner / Headline Title -->
          <tr>
            <td style="padding: 24px 32px 8px 32px;">
              <h1 style="margin: 0 0 6px 0; font-size: 22px; font-weight: 800; color: #0f172a; line-height: 1.3;">
                ${title}
              </h1>
              ${subtitle ? `<div style="font-size: 14px; color: #64748b; margin-bottom: 4px;">${subtitle}</div>` : ''}
              ${refId ? `<div style="display: inline-block; background-color: #f8fafc; border: 1px solid #e2e8f0; color: #475569; font-size: 12px; font-weight: 600; padding: 3px 8px; border-radius: 4px; margin-top: 6px;">Ref: ${refId}</div>` : ''}
            </td>
          </tr>

          <!-- Core Content -->
          <tr>
            <td style="padding: 12px 32px 24px 32px; font-size: 14px; line-height: 1.6; color: #334155;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Action Button (Optional) -->
          ${actionButton ? `
          <tr>
            <td align="center" style="padding: 4px 32px 28px 32px;">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="border-radius: 8px; background-color: ${theme.accent};">
                    <a href="${actionButton.url}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.12);">
                      ${actionButton.label} &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>` : ''}

          <!-- Notice / Trust Seal Box (Optional) -->
          ${noticeHtml ? `
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid ${theme.accent}; padding: 14px 16px; border-radius: 6px; font-size: 13px; color: #475569; line-height: 1.5;">
                ${noticeHtml}
              </div>
            </td>
          </tr>` : ''}

          <!-- Security & Escrow Guarantee Footer Strip -->
          <tr>
            <td style="background-color: #fafbfc; border-top: 1px solid #f1f5f9; padding: 18px 32px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="36" valign="top">
                    <span style="font-size: 22px;">🛡️</span>
                  </td>
                  <td valign="top" style="font-size: 12px; color: #64748b; line-height: 1.4;">
                    <strong style="color: #334155;">BioLink 72-Hour Gate Escrow Protocol:</strong> 
                    Consignments are backed by site weighbridge verification and multi-point moisture &amp; purity checks. Escrow funds released only upon site delivery acceptance.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Standardized Enterprise Footer -->
          <tr>
            <td style="background-color: #0f172a; color: #94a3b8; padding: 24px 32px; font-size: 12px; line-height: 1.6; text-align: center;">
              <div style="font-weight: 700; color: #f8fafc; font-size: 13px; margin-bottom: 4px;">
                BioLink Agritech Solutions Private Limited
              </div>
              <div style="margin-bottom: 12px;">
                Patliputra Industrial Area / Maurya Lok Commercial Complex, Patna, Bihar &bull; 800001<br/>
                Pan-India Direct Logistics Helpline: <a href="tel:+918581868466" style="color: #38bdf8; text-decoration: none;">+91 8581868466</a> &bull; WhatsApp Desk Available
              </div>
              <div style="border-top: 1px solid #334155; padding-top: 12px; font-size: 11px; color: #64748b;">
                Sent via verified enterprise infrastructure &bull; <a href="https://biolinkagri.in" style="color: #38bdf8; text-decoration: none;">biolinkagri.in</a> &bull; 
                Confidential B2B Transactional Notification
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. PARTNER PORTAL EMAIL TEMPLATES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sent when a partner registers or their account is provisioned
 */
export function buildPartnerWelcomeEmail({
  partnerName,
  referralCode,
  email,
  company = '',
  loginUrl = 'https://biolinkagri.in/partner/login',
}) {
  const content = `
    <p>Dear <strong>${partnerName}</strong>,</p>
    <p>Welcome to the <strong>BioLink Agritech Partner Network</strong>${company ? ` as representative for <strong>${company}</strong>` : ''}. Your partner credentials and exclusive institutional referral code have been activated.</p>
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin: 20px 0; font-size: 14px; overflow: hidden;">
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; width: 40%;"><strong>Your Referral Code:</strong></td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 800; font-size: 18px; color: #059669; letter-spacing: 1px;">${referralCode}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Registered Email:</strong></td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #0f172a;">${email}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Commission Rate:</strong></td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 700; color: #0f172a;">₹300 per Metric Ton (MT)</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; color: #64748b;"><strong>Farmer Discount:</strong></td>
        <td style="padding: 12px 16px; font-weight: 600; color: #0284c7;">₹100/MT off delivered quote</td>
      </tr>
    </table>

    <h3 style="color: #0f172a; margin: 20px 0 10px 0; font-size: 16px;">How It Works:</h3>
    <ol style="margin: 0; padding-left: 20px; line-height: 1.8;">
      <li>Share your unique code <strong>${referralCode}</strong> with progressive farmers, FPOs, orchards, or estate managers.</li>
      <li>When they generate quotes or place bulk bio-manure allocations using your code, your dashboard attributes the volume instantly.</li>
      <li>Once the consignment is weighed and cleared at destination, your commission is credited directly to your partner ledger.</li>
    </ol>
  `;

  return wrapBrandedEmail({
    title: 'Welcome to the BioLink Partner Network! 🤝',
    subtitle: `Partner Account Activated: ${referralCode}`,
    sector: 'partner',
    badgeText: 'Partner Onboarding',
    contentHtml: content,
    actionButton: {
      label: 'Access Partner Dashboard',
      url: loginUrl,
    },
    noticeHtml: `<strong>Need onboarding support?</strong> Connect with our Partner Desk directly on WhatsApp at <strong>+91 8581868466</strong> for marketing collateral, digital brochures, and regional CBG allocation maps.`,
    refId: referralCode,
  });
}

/**
 * Sent when a partner referral is attributed via quotation or checkout
 */
export function buildPartnerReferralNotificationEmail({
  partnerName,
  referralCode,
  farmerName,
  farmerMobile,
  farmerEmail,
  pincode,
  product,
  volume,
}) {
  const mt = Number(volume || 15);
  const totalCommission = mt * 300;
  const displayProduct = String(product || 'FOM Organic Manure').replace(/-/g, ' ').toUpperCase();

  const content = `
    <p>Dear <strong>${partnerName}</strong>,</p>
    <p>Great news! A new bulk agri-input booking has been attributed to your referral code <strong>${referralCode}</strong>.</p>
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin: 20px 0; font-size: 14px; overflow: hidden;">
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; width: 40%;"><strong>Attributed Client:</strong></td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 700; color: #0f172a;">${farmerName}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Contact Mobile:</strong></td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #0284c7;">${farmerMobile || 'N/A'}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Destination PIN:</strong></td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${pincode || 'Regional'}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Allocated Product:</strong></td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${displayProduct}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Tonnage Booked:</strong></td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 800; color: #0f172a;">${mt} MT (Metric Tons)</td>
      </tr>
      <tr style="background-color: #ecfdf5;">
        <td style="padding: 14px 16px; color: #065f46; font-weight: 700; font-size: 15px;">Earned Commission:</td>
        <td style="padding: 14px 16px; font-weight: 800; font-size: 18px; color: #059669; text-align: right;">₹${totalCommission.toLocaleString('en-IN')}</td>
      </tr>
    </table>

    <p style="margin-top: 16px;">This order is currently progressing through factory allocation and weighbridge verification. You can track this booking in real time inside your partner ledger.</p>
  `;

  return wrapBrandedEmail({
    title: 'New Referral Attributed! 🎉',
    subtitle: `${mt} MT Booked under Code ${referralCode}`,
    sector: 'partner',
    badgeText: 'Referral Pipeline',
    contentHtml: content,
    actionButton: {
      label: 'View in Partner Portal',
      url: 'https://biolinkagri.in/partner/dashboard',
    },
    noticeHtml: `Commission of <strong>₹${totalCommission.toLocaleString('en-IN')}</strong> will be disbursed to your registered bank account upon site weighbridge tare clearance.`,
    refId: referralCode,
  });
}

/**
 * Sent when a partner payout/commission settlement is processed
 */
export function buildPartnerCommissionPayoutEmail({
  partnerName,
  payoutAmount,
  transactionRef,
  period = 'Monthly Cycle',
  bankLast4 = 'XXXX',
  totalVolumeMT = 0,
}) {
  const content = `
    <p>Dear <strong>${partnerName}</strong>,</p>
    <p>We are pleased to inform you that your commission payout for <strong>${period}</strong> has been processed successfully via NEFT / IMPS bank transfer.</p>
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin: 20px 0; font-size: 14px; overflow: hidden;">
      <tr style="background-color: #ecfdf5;">
        <td style="padding: 14px 16px; color: #065f46; font-weight: 700;">Payout Amount:</td>
        <td style="padding: 14px 16px; font-weight: 800; font-size: 20px; color: #059669; text-align: right;">₹${Number(payoutAmount).toLocaleString('en-IN')}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Transaction Ref / UTR:</strong></td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-weight: 700; color: #0f172a;">${transactionRef}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Settled Volume:</strong></td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${totalVolumeMT} Metric Tons</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; color: #64748b;"><strong>Destination Account:</strong></td>
        <td style="padding: 12px 16px; font-weight: 600;">Linked Account (Ending in ${bankLast4})</td>
      </tr>
    </table>

    <p>Funds generally reflect in your account within 2-4 banking hours. Your updated ledger statement is available for download in your partner dashboard.</p>
  `;

  return wrapBrandedEmail({
    title: 'Commission Payout Disbursed 💰',
    subtitle: `₹${Number(payoutAmount).toLocaleString('en-IN')} Settled for ${period}`,
    sector: 'partner',
    badgeText: 'Payout Statement',
    contentHtml: content,
    actionButton: {
      label: 'Download Ledger Statement',
      url: 'https://biolinkagri.in/partner/dashboard',
    },
    refId: transactionRef,
  });
}

/**
 * Sent when a partner updates their account password
 */
export function buildPartnerPasswordChangeEmail({
  partnerName,
  email,
  timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
  ipAddress = 'Recorded Secure Session',
}) {
  const content = `
    <p>Dear <strong>${partnerName}</strong>,</p>
    <p>This is a security notification confirming that the password for your BioLink Partner account (<strong>${email}</strong>) was changed on <strong>${timestamp}</strong>.</p>
    
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin: 16px 0; font-size: 13px;">
      <div><strong>Security Event:</strong> Credential Update</div>
      <div><strong>Timestamp:</strong> ${timestamp} IST</div>
      <div><strong>Session:</strong> ${ipAddress}</div>
    </div>

    <p style="color: #b91c1c; font-weight: 600;">
      If you did not initiate this change, please immediately reset your password or contact our security desk at <a href="mailto:security@biolinkagri.in" style="color: #b91c1c;">security@biolinkagri.in</a>.
    </p>
  `;

  return wrapBrandedEmail({
    title: 'Partner Security Alert: Password Updated 🔒',
    subtitle: `Security Notice for ${email}`,
    sector: 'partner',
    badgeText: 'Security Notice',
    contentHtml: content,
    actionButton: {
      label: 'Login to Partner Portal',
      url: 'https://biolinkagri.in/partner/login',
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. SAMPLE ORDERS EMAIL TEMPLATES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Internal notification to admin/plant when a bio-manure sample order is placed
 */
export function buildSampleOrderEmail({
  name,
  email,
  whatsapp,
  address,
  pincode,
  sampleSize,
  intendedUse,
  intendedUseOther,
  cropType,
  notes,
  sampleRefId,
}) {
  const content = `
    <p>A new customer sample request has been submitted on the <strong>Organic Manure Portal</strong>. Please coordinate pack dispatch with the nearest fulfillment hub.</p>

    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin: 20px 0; font-size: 14px; overflow: hidden;">
      <tr style="background-color: #ecfdf5;">
        <td style="padding: 12px 16px; color: #065f46; font-weight: 700; width: 40%;">Sample Size:</td>
        <td style="padding: 12px 16px; font-weight: 800; font-size: 16px; color: #047857;">${sampleSize} Test Bag</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Customer Name:</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 700; color: #0f172a;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;">WhatsApp Mobile:</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 700; color: #0284c7;">
          <a href="https://wa.me/91${whatsapp.replace(/[^0-9]/g, '')}" style="color: #0284c7; text-decoration: none;">${whatsapp}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Email Address:</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0;">${email}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Target Crop / Land:</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${cropType || 'General Agriculture'} (${intendedUse || 'Commercial'})</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Destination PIN:</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 700;">${pincode}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; color: #64748b;">Full Delivery Address:</td>
        <td style="padding: 12px 16px; font-weight: 500;">${address}</td>
      </tr>
    </table>

    ${notes ? `
    <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 6px; margin: 16px 0; font-size: 13px;">
      <strong style="color: #92400e; display: block; margin-bottom: 4px;">Customer Soil / Trial Notes:</strong>
      <div style="color: #78350f;">${notes}</div>
    </div>` : ''}
  `;

  return wrapBrandedEmail({
    title: 'New Organic Manure Sample Request 📦',
    subtitle: `${sampleSize} Test Pack &bull; Ref: ${sampleRefId}`,
    sector: 'manure',
    badgeText: 'Sample Lead',
    contentHtml: content,
    actionButton: {
      label: 'Open WhatsApp Chat with Client',
      url: `https://wa.me/91${whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(name)},%20this%20is%20BioLink%20Agritech%20regarding%20your%20FOM%20sample%20order%20(${sampleRefId}).`,
    },
    refId: sampleRefId,
  });
}

/**
 * Customer receipt confirming their bio-manure sample order
 */
export function buildSampleOrderAutoReply({
  name,
  sampleSize,
  address,
  pincode,
  sampleRefId,
}) {
  const content = `
    <p>Dear <strong>${name}</strong>,</p>
    <p>Thank you for requesting your <strong>BioLink Fermented Organic Manure (FOM) — ${sampleSize} Test Bag</strong>. Your sample order has been registered in our fulfillment queue.</p>
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin: 20px 0; font-size: 14px; overflow: hidden;">
      <tr style="background-color: #ecfdf5;">
        <td style="padding: 12px 16px; color: #065f46; font-weight: 700; width: 40%;">Selected Pack:</td>
        <td style="padding: 12px 16px; font-weight: 800; color: #047857;">${sampleSize} FOM Soil Test Pack</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Reference ID:</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-weight: 700;">${sampleRefId}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Destination PIN:</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${pincode}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; color: #64748b;">Shipping Address:</td>
        <td style="padding: 12px 16px; font-weight: 500;">${address}</td>
      </tr>
    </table>

    <h3 style="color: #0f172a; margin: 20px 0 10px 0; font-size: 15px;">Fulfillment Timeline:</h3>
    <p style="margin: 0 0 12px 0;">Our logistics coordinator will connect via WhatsApp within 24 hours to verify dispatch coordinates and share your courier airway bill (AWB) tracking number.</p>
  `;

  return wrapBrandedEmail({
    title: 'Sample Order Confirmed! 🌱',
    subtitle: `Reference: ${sampleRefId} &bull; BioLink Fermented Organic Manure`,
    sector: 'manure',
    badgeText: 'Sample Order Confirmation',
    contentHtml: content,
    actionButton: {
      label: 'Connect with Logistics on WhatsApp',
      url: 'https://wa.me/918581868466?text=Hello%20BioLink,%20checking%20status%20for%20sample%20order%20' + sampleRefId,
    },
    noticeHtml: `<strong>Technical Note:</strong> Every BioLink FOM batch is 100% heat-sterilized at government-certified Compressed Biogas (CBG) facilities, ensuring complete weed-seed dormancy and pathogen elimination.`,
    refId: sampleRefId,
  });
}

/**
 * Customer notification when sample has been dispatched via courier
 */
export function buildSampleDispatchedEmail({
  name,
  sampleSize,
  trackingNumber,
  courierName = 'Delhivery / BlueDart',
  trackingUrl,
  address,
  sampleRefId,
}) {
  const content = `
    <p>Dear <strong>${name}</strong>,</p>
    <p>Great news! Your <strong>${sampleSize} BioLink Sample Consignment</strong> has been picked up by our courier partner and is on its way to you.</p>
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin: 20px 0; font-size: 14px; overflow: hidden;">
      <tr style="background-color: #eff6ff;">
        <td style="padding: 12px 16px; color: #1e40af; font-weight: 700; width: 40%;">Courier Partner:</td>
        <td style="padding: 12px 16px; font-weight: 800; color: #2563eb;">${courierName}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Airway Bill (AWB):</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-weight: 700; font-size: 16px; color: #0f172a;">${trackingNumber}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Consignment Type:</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${sampleSize} Sealed Test Pack</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; color: #64748b;">Destination:</td>
        <td style="padding: 12px 16px; font-weight: 500;">${address}</td>
      </tr>
    </table>
  `;

  return wrapBrandedEmail({
    title: 'Sample Dispatched & In Transit 🚚',
    subtitle: `AWB: ${trackingNumber} &bull; ${courierName}`,
    sector: 'manure',
    badgeText: 'Dispatched',
    contentHtml: content,
    actionButton: trackingUrl ? {
      label: 'Track Courier Consignment',
      url: trackingUrl,
    } : null,
    refId: sampleRefId || trackingNumber,
  });
}

/**
 * Admin notification for Himalayan Sea Buckthorn sample request
 */
export function buildSeaBuckthornSampleEmail({
  companyName,
  name,
  email,
  whatsapp,
  requiredFormat,
  monthlyVolume,
  pincode,
  notes,
  sampleRefId,
}) {
  const content = `
    <p>A new industrial/clinical sample request has been submitted for <strong>Himalayan Sea Buckthorn</strong> extracts.</p>

    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fff7ed; border: 1px solid #fed7aa; border-radius: 10px; margin: 20px 0; font-size: 14px; overflow: hidden;">
      <tr style="background-color: #ffedd5;">
        <td style="padding: 12px 16px; color: #9a3412; font-weight: 700; width: 40%;">Enterprise / Brand:</td>
        <td style="padding: 12px 16px; font-weight: 800; font-size: 16px; color: #7c2d12;">${companyName}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #fed7aa; color: #9a3412;">Contact Person:</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #fed7aa; font-weight: 700; color: #0f172a;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #fed7aa; color: #9a3412;">WhatsApp Mobile:</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #fed7aa; font-weight: 700; color: #0284c7;">
          <a href="https://wa.me/91${whatsapp.replace(/[^0-9]/g, '')}" style="color: #0284c7; text-decoration: none;">${whatsapp}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #fed7aa; color: #9a3412;">Business Email:</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #fed7aa;">${email}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #fed7aa; color: #9a3412;">Requested Botanical Format:</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #fed7aa; font-weight: 700; color: #ea580c;">${requiredFormat}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #fed7aa; color: #9a3412;">Estimated Monthly Demand:</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #fed7aa; font-weight: 600;">${monthlyVolume}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; color: #9a3412;">Destination PIN:</td>
        <td style="padding: 12px 16px; font-weight: 600;">${pincode}</td>
      </tr>
    </table>

    ${notes ? `
    <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 6px; margin: 16px 0; font-size: 13px;">
      <strong style="color: #92400e; display: block; margin-bottom: 4px;">Formulation / Lab Specifications:</strong>
      <div style="color: #78350f;">${notes}</div>
    </div>` : ''}
  `;

  return wrapBrandedEmail({
    title: 'Himalayan Sea Buckthorn Pilot Lead 🫐',
    subtitle: `${companyName} &bull; Format: ${requiredFormat}`,
    sector: 'seabuckthorn',
    badgeText: 'Botanical Lead',
    contentHtml: content,
    actionButton: {
      label: 'Open WhatsApp Chat with Brand',
      url: `https://wa.me/91${whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(name)},%20this%20is%20BioLink%20Botanicals%20regarding%20Sea%20Buckthorn%20Pilot%20(${sampleRefId}).`,
    },
    refId: sampleRefId,
  });
}

/**
 * Customer receipt confirming their Himalayan Sea Buckthorn sample request
 */
export function buildSeaBuckthornSampleAutoReply({
  companyName,
  name,
  requiredFormat,
  sampleRefId,
}) {
  const content = `
    <p>Dear <strong>${name}</strong> (${companyName}),</p>
    <p>Thank you for expressing interest in BioLink Agritech's <strong>Himalayan Sea Buckthorn B2B Pilot Sourcing Program</strong>.</p>
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fff7ed; border: 1px solid #fed7aa; border-radius: 10px; margin: 20px 0; font-size: 14px; overflow: hidden;">
      <tr style="background-color: #ffedd5;">
        <td style="padding: 12px 16px; color: #9a3412; font-weight: 700; width: 40%;">Organization:</td>
        <td style="padding: 12px 16px; font-weight: 800; color: #7c2d12;">${companyName}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #fed7aa; color: #9a3412;">Requested Format:</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #fed7aa; font-weight: 700; color: #ea580c;">${requiredFormat}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; color: #9a3412;">Pilot Ref ID:</td>
        <td style="padding: 12px 16px; font-family: monospace; font-weight: 700;">${sampleRefId}</td>
      </tr>
    </table>

    <p>Our extraction desk in Ladakh / Leh harvests sustainably at 11,000+ ft altitude and uses sub-zero supercritical CO2 extraction to guarantee active Palmitoleic acid (Omega-7 > 32%) without residual solvent traces.</p>
    <p>Our botanical formulations lead will contact you within 24 business hours to provide technical COAs, fatty acid profiling, and dispatch sample vials for lab verification.</p>
  `;

  return wrapBrandedEmail({
    title: 'Advance Lab Sample Registered 🫐',
    subtitle: `Reference: ${sampleRefId} &bull; Himalayan Sea Buckthorn`,
    sector: 'seabuckthorn',
    badgeText: 'Pilot Sample Confirmation',
    contentHtml: content,
    actionButton: {
      label: 'Connect with Botanical Desk',
      url: 'https://wa.me/918581868466?text=Hello%20BioLink%20Botanicals,%20inquiry%20for%20' + sampleRefId,
    },
    noticeHtml: `<strong>Batch Allocation:</strong> High-altitude wild-harvest harvest window is strictly monitored. Pilot sample vials are shipped with full NABL-accredited Certificate of Analysis (COA).`,
    refId: sampleRefId,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. BULK ORDERS & GATE ESCROW WORKFLOW
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Buyer receipt upon placing a bulk order into 72-Hour Gate Escrow
 */
export function buildBuyerReceipt({ buyerName, listing, quantityTons, order }) {
  const isManure = (listing?.productType || '').toLowerCase().includes('manure');
  const isFeed = (listing?.productType || '').toLowerCase().includes('feed') || (listing?.productType || '').toLowerCase().includes('ddgs');
  const sector = isManure ? 'manure' : isFeed ? 'feed' : 'corporate';

  const content = `
    <p>Dear <strong>${buyerName}</strong>,</p>
    <p>Your institutional bio-input order has been registered and deposited into <strong>BioLink 72-Hour Gate Escrow</strong>. Funds are securely locked and will not be released to the facility until you inspect and accept the consignment at your weighbridge.</p>
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin: 20px 0; font-size: 14px; overflow: hidden;">
      <tr style="background-color: #eff6ff;">
        <td style="padding: 12px 16px; color: #1e40af; font-weight: 700; width: 40%;">Order Tracking ID:</td>
        <td style="padding: 12px 16px; font-family: monospace; font-weight: 800; font-size: 16px; color: #2563eb;">${order.trackingId}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Source Facility:</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 700; color: #0f172a;">${listing?.plantName || 'Verified Processing Plant'}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Allocation Volume:</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 700;">${quantityTons} Metric Tons (MT)</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Delivery Destination:</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 500;">${order.deliveryAddress || 'Site Weighbridge'}</td>
      </tr>
      <tr style="background-color: #ecfdf5;">
        <td style="padding: 14px 16px; color: #065f46; font-weight: 700; font-size: 15px;">Escrow Deposit Total:</td>
        <td style="padding: 14px 16px; font-weight: 800; font-size: 18px; color: #059669; text-align: right;">₹${Number(order.totalPaid || 0).toLocaleString('en-IN')}</td>
      </tr>
    </table>

    <h3 style="color: #0f172a; margin: 20px 0 10px 0; font-size: 15px;">Next Logistics Milestone:</h3>
    <p style="margin: 0;">The plant is currently preparing your truckload allocation. You will receive an automated dispatch notification with driver phone number and vehicle registration plate once the truck crosses the plant weighbridge.</p>
  `;

  return wrapBrandedEmail({
    title: 'Order Confirmed & Funds Held in Escrow 🔒',
    subtitle: `Tracking ID: ${order.trackingId} &bull; ${quantityTons} MT Allocation`,
    sector,
    badgeText: 'Escrow Deposit Held',
    contentHtml: content,
    actionButton: {
      label: 'Track Consignment Live',
      url: `https://biolinkagri.in/tracking?trackingId=${order.trackingId}`,
    },
    noticeHtml: `<strong>Escrow Release Policy:</strong> Your funds remain in escrow. After the truck arrives at your site, you will upload the tare weighbridge slip to authorize settlement. If moisture or purity deviates, you can raise an instant dispute.`,
    refId: order.trackingId,
  });
}

/**
 * Plant notification when an allocation is assigned
 */
export function buildPlantNotification({ buyer, listing, quantityTons, order }) {
  const content = `
    <p>Hello <strong>${listing?.plantName || 'Facility Partner'}</strong>,</p>
    <p>A new institutional order has been assigned to your plant. The buyer's payment has been verified and deposited into BioLink Gate Escrow.</p>
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin: 20px 0; font-size: 14px; overflow: hidden;">
      <tr style="background-color: #eff6ff;">
        <td style="padding: 12px 16px; color: #1e40af; font-weight: 700; width: 40%;">Order Tracking ID:</td>
        <td style="padding: 12px 16px; font-family: monospace; font-weight: 800; color: #2563eb;">${order.trackingId}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Buyer Organization:</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 700; color: #0f172a;">${buyer?.name || 'Verified Buyer'}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Target Quantity:</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 800; color: #059669;">${quantityTons} Metric Tons</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Delivery Destination:</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0;">${order.deliveryAddress}</td>
      </tr>
    </table>

    <h3 style="color: #0f172a; margin: 20px 0 10px 0; font-size: 15px;">Fulfillment Instructions:</h3>
    <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
      <li>Ensure truck tare and gross weight slips from Dharma Kanta are scanned.</li>
      <li>Attach the certified laboratory test COA with moisture reading &lt; 25%.</li>
      <li>Mark consignment status as <strong>DISPATCHED</strong> once the sealed truck departs your gate.</li>
    </ul>
  `;

  return wrapBrandedEmail({
    title: 'Fulfillment Order Allocation Assigned 🏭',
    subtitle: `Action Required &bull; Tracking ID: ${order.trackingId}`,
    sector: 'corporate',
    badgeText: 'Plant Allocation',
    contentHtml: content,
    actionButton: {
      label: 'Open Plant Dispatch Portal',
      url: `https://biolinkagri.in/plant/dispatch?orderId=${order._id}`,
    },
    refId: order.trackingId,
  });
}

/**
 * Quality Clearance / Site Arrival notice to buyer to inspect and release escrow
 */
export function buildQAClearanceEmail({ buyerName, trackingId, quantityTons, settleUrl, plantName }) {
  const content = `
    <p>Dear <strong>${buyerName}</strong>,</p>
    <p>Your consignment <strong>${trackingId}</strong> (${quantityTons} MT)${plantName ? ` from <strong>${plantName}</strong>` : ''} has safely arrived at your destination site.</p>
    
    <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 10px; padding: 18px; margin: 20px 0; text-align: center;">
      <div style="font-size: 16px; font-weight: 700; color: #065f46; margin-bottom: 6px;">Consignment Ready for Gate Release</div>
      <div style="font-size: 13px; color: #047857; margin-bottom: 16px;">
        Please complete destination weighbridge tare verification and quality sign-off to authorize release of escrow funds.
      </div>
      <a href="${settleUrl}" target="_blank" style="display: inline-block; padding: 12px 28px; background-color: #059669; color: #ffffff; text-decoration: none; font-weight: 700; border-radius: 8px;">
        Verify Weighbridge &amp; Release Funds &rarr;
      </a>
    </div>

    <p style="font-size: 13px; color: #64748b;">
      *In accordance with the BioLink 72-Hour Gate Escrow policy, if no quality dispute is raised within 72 hours of site arrival, the escrow settlement may auto-release.
    </p>
  `;

  return wrapBrandedEmail({
    title: 'Consignment Arrived: Quality Clearance Required ⚖️',
    subtitle: `Tracking: ${trackingId} &bull; ${quantityTons} MT Delivered`,
    sector: 'manure',
    badgeText: 'QA Clearance Action',
    contentHtml: content,
    actionButton: {
      label: 'Confirm Weighbridge & Release Funds',
      url: settleUrl,
    },
    refId: trackingId,
  });
}

/**
 * Settlement confirmation when escrow funds are released
 */
export function buildSettlementConfirmEmail({ recipientName, trackingId, totalPaid, role = 'buyer', releaseTxRef = '' }) {
  const isSupplier = role === 'supplier' || role === 'plant';

  const content = `
    <p>Dear <strong>${recipientName}</strong>,</p>
    <p>
      ${isSupplier
        ? `We are pleased to confirm that escrow funds for consignment <strong>${trackingId}</strong> have been released and initiated for transfer to your account.`
        : `Consignment <strong>${trackingId}</strong> has been successfully settled and closed. The escrow funds have been released to the fulfillment facility.`}
    </p>

    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin: 20px 0; font-size: 14px; overflow: hidden;">
      <tr style="background-color: #ecfdf5;">
        <td style="padding: 14px 16px; color: #065f46; font-weight: 700;">Settlement Amount:</td>
        <td style="padding: 14px 16px; font-weight: 800; font-size: 18px; color: #059669; text-align: right;">₹${Number(totalPaid || 0).toLocaleString('en-IN')}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Consignment ID:</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-weight: 700;">${trackingId}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; color: #64748b;">Escrow Status:</td>
        <td style="padding: 12px 16px; font-weight: 700; color: #059669;">SETTLED &amp; CLOSED</td>
      </tr>
    </table>

    <p>Thank you for choosing BioLink Agritech Solutions for your industrial agricultural supply chain.</p>
  `;

  return wrapBrandedEmail({
    title: 'Escrow Settlement Complete & Funds Released ✅',
    subtitle: `Consignment: ${trackingId} &bull; ₹${Number(totalPaid || 0).toLocaleString('en-IN')}`,
    sector: 'corporate',
    badgeText: 'Escrow Settled',
    contentHtml: content,
    actionButton: {
      label: 'Download GST Invoice',
      url: `https://biolinkagri.in/invoice?trackingId=${trackingId}`,
    },
    refId: trackingId,
  });
}

/**
 * Dispute email when a buyer flags quality or weight discrepancies
 */
export function buildOrderDisputedEmail({ buyerName, trackingId, reason, disputeRef, adminEmail }) {
  const content = `
    <p>A formal quality/weight dispute has been lodged regarding consignment <strong>${trackingId}</strong>.</p>
    
    <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-left: 4px solid #ef4444; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <div style="font-weight: 800; color: #991b1b; font-size: 15px; margin-bottom: 6px;">
        ⚠️ ESCROW SETTLEMENT PAUSED
      </div>
      <div style="font-size: 13px; color: #7f1d1d; line-height: 1.5;">
        All escrow fund disbursements for this order are strictly frozen pending inspection of weighbridge tare slips and lab sample re-testing.
      </div>
    </div>

    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin: 20px 0; font-size: 14px; overflow: hidden;">
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; width: 40%;">Buyer Contact:</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 700; color: #0f172a;">${buyerName}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Consignment ID:</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-weight: 700;">${trackingId}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; color: #64748b;">Dispute Reason:</td>
        <td style="padding: 12px 16px; font-weight: 600; color: #b91c1c;">${reason}</td>
      </tr>
    </table>
  `;

  return wrapBrandedEmail({
    title: 'Dispute Raised: Escrow Locked ⚠️',
    subtitle: `Dispute Case: ${disputeRef || trackingId}`,
    sector: 'corporate',
    badgeText: 'Dispute Action',
    contentHtml: content,
    actionButton: {
      label: 'Open Arbitration Panel',
      url: `https://biolinkagri.in/admin/disputes?trackingId=${trackingId}`,
    },
    refId: disputeRef || trackingId,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MULTI-SECTOR INQUIRIES & INSTANT QUOTES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sourcing inquiry sent to the BioLink team
 */
export function buildContactEmail({
  name,
  email,
  phone,
  enquiryType,
  message,
  productSector = 'General',
  requestedTonnage = '15+',
}) {
  const sector = resolveSectorKey(productSector);
  const theme = SECTOR_PALETTES[sector];

  const content = `
    <p>A new institutional B2B intake has been recorded via the <strong>${theme.name}</strong> portal.</p>

    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin: 20px 0; font-size: 14px; overflow: hidden;">
      <tr style="background-color: ${theme.accentLight};">
        <td style="padding: 12px 16px; color: ${theme.badgeText}; font-weight: 700; width: 40%;">Product Sector:</td>
        <td style="padding: 12px 16px; font-weight: 800; font-size: 15px; color: ${theme.primary};">${productSector}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Client Name:</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 700; color: #0f172a;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Business Email:</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0;">${email}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Phone / Mobile:</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 700; color: #0284c7;">
          ${phone ? `<a href="https://wa.me/91${phone.replace(/[^0-9]/g, '')}" style="color: #0284c7; text-decoration: none;">${phone}</a>` : 'Not provided'}
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Requested Tonnage:</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 700;">${requestedTonnage} MT</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; color: #64748b;">Inquiry Category:</td>
        <td style="padding: 12px 16px; font-weight: 600;">${enquiryType}</td>
      </tr>
    </table>

    <div style="background-color: #f1f5f9; padding: 16px; border-radius: 8px; border-left: 4px solid ${theme.accent}; margin: 20px 0;">
      <strong style="color: #0f172a; display: block; margin-bottom: 6px;">Technical Requirements &amp; Message:</strong>
      <p style="margin: 0; color: #334155; font-size: 14px; white-space: pre-line;">${message}</p>
    </div>
  `;

  return wrapBrandedEmail({
    title: `New B2B Sourcing Intake [${productSector}] 📬`,
    subtitle: `${name} &bull; ${requestedTonnage} MT Requested`,
    sector,
    badgeText: `${productSector} Inquiry`,
    contentHtml: content,
    actionButton: phone ? {
      label: 'Open WhatsApp Chat with Buyer',
      url: `https://wa.me/91${phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(name)},%20this%20is%20BioLink%20Agritech%20regarding%20your%20inquiry%20for%20${encodeURIComponent(productSector)}.`,
    } : null,
  });
}

/**
 * Auto-reply sent to the client when they submit an inquiry
 */
export function buildContactAutoReply({ name, productSector = 'BioLink Agri' }) {
  const sector = resolveSectorKey(productSector);
  const theme = SECTOR_PALETTES[sector];

  const content = `
    <p>Dear <strong>${name}</strong>,</p>
    <p>Thank you for connecting with <strong>BioLink Agritech Solutions</strong>. We have successfully registered your B2B sourcing inquiry for <strong>${productSector}</strong>.</p>
    
    <p>Our regional logistics matching desk is analyzing your specifications against available allocations from our certified manufacturing nodes.</p>

    <div style="background-color: ${theme.accentLight}; color: ${theme.badgeText}; padding: 14px 18px; border-radius: 8px; border-left: 4px solid ${theme.accent}; font-size: 14px; margin: 20px 0; line-height: 1.5;">
      <strong>Next Steps:</strong> A dedicated sector coordinator will connect via WhatsApp or phone (+91 8581868466) within 24 business hours with initial freight routing and plant availability.
    </div>

    <p style="margin-top: 20px;">
      Warm regards,<br/>
      <strong>Sahil Siddique</strong><br/>
      Founder &amp; Managing Director<br/>
      BioLink Agritech Solutions Private Limited
    </p>
  `;

  return wrapBrandedEmail({
    title: 'Inquiry Registered Successfully 🚜',
    subtitle: `BioLink Official B2B Gateway &bull; ${theme.name}`,
    sector,
    badgeText: 'Inquiry Received',
    contentHtml: content,
    actionButton: {
      label: 'Explore Our Infrastructure Network',
      url: `https://${theme.subdomain}`,
    },
  });
}

/**
 * Instant Quote Email
 */
export function buildQuoteEmail({ name, product, volume, pincode, quote, sector }) {
  const displayProduct = String(product || 'FOM Organic Manure').replace(/-/g, ' ').toUpperCase();
  const sectorKey = resolveSectorKey(sector || product);
  const theme = SECTOR_PALETTES[sectorKey];

  const content = `
    <p>Dear <strong>${name}</strong>,</p>
    <p>Below is your institutional quote and logistics estimate for <strong>${displayProduct}</strong> delivered to destination PIN <strong>${pincode}</strong>:</p>
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin: 20px 0; font-size: 14px; overflow: hidden;">
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; width: 50%;">Allocation Volume:</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 800; text-align: right; color: #0f172a;">${volume} Metric Tons (MT)</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Ex-Factory Base Rate:</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 700; text-align: right;">₹${quote.manureCost.toLocaleString('en-IN')}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Dedicated Interstate Freight:</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 700; text-align: right;">₹${quote.freightCost.toLocaleString('en-IN')}</td>
      </tr>
      <tr style="background-color: #edf2f7;">
        <td style="padding: 12px 16px; font-weight: 700; color: #0f172a;">Delivered Rate Per Ton:</td>
        <td style="padding: 12px 16px; font-weight: 800; color: ${theme.accent}; text-align: right; font-size: 15px;">₹${quote.pricePerTon.toLocaleString('en-IN')} / MT</td>
      </tr>
      <tr style="background-color: ${theme.accentLight};">
        <td style="padding: 14px 16px; font-weight: 800; color: ${theme.primary}; font-size: 16px;">Estimated Grand Total:</td>
        <td style="padding: 14px 16px; font-weight: 800; color: ${theme.accent}; text-align: right; font-size: 20px;">₹${quote.total.toLocaleString('en-IN')}</td>
      </tr>
    </table>
  `;

  return wrapBrandedEmail({
    title: 'Instant Institutional Quote & Allocation Estimate 📊',
    subtitle: `${displayProduct} &bull; ${volume} MT to PIN ${pincode}`,
    sector: sectorKey,
    badgeText: 'B2B Instant Quote',
    contentHtml: content,
    actionButton: {
      label: 'Lock Allocation & Deposit in Escrow',
      url: `https://biolinkagri.in/order/checkout?product=${encodeURIComponent(product)}&volume=${volume}&pincode=${pincode}`,
    },
    noticeHtml: `<strong>Escrow Security Assurance:</strong> All dispatches are governed by the BioLink 72-Hour Gate Escrow guarantee. Consignment funds remain secured in escrow until your destination weighbridge tare verification is completed.`,
  });
}

/**
 * Early Access Notification Registration
 */
export function buildNotifyEmail({ productName, email }) {
  const content = `
    <p>Hello,</p>
    <p>You have been added to the early access notification list for <strong>${productName}</strong>.</p>
    <p>We will alert you as soon as retail consumer packaging or new regional plant allocations are available for booking in your territory.</p>
    <p>Best regards,<br/>
    <strong>BioLink Agritech Solutions Team</strong></p>
  `;

  return wrapBrandedEmail({
    title: 'Early Access Registration Confirmed 🚀',
    subtitle: `Product: ${productName}`,
    sector: 'corporate',
    badgeText: 'Priority Notification',
    contentHtml: content,
  });
}
