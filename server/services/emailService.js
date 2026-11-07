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
    from: from || `"${safeHeader(config.emailFromName)}" <${safeHeader(config.emailFromAddress || 'info@biolinkagri.in')}>`,
    to: safeHeader(to),
    subject: safeHeader(subject),
    html,
    ...(replyTo ? { replyTo: safeHeader(replyTo) } : {}),
  });
}

// ── Contact Email ──
export function buildContactEmail({ name, email, phone, enquiryType, message, productSector = 'General', requestedTonnage = '15+' }) {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; max-width: 620px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background: #ffffff;">
      <div style="border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #0f172a; margin: 0 0 4px 0;">📬 New B2B Sourcing Intake [${productSector}]</h2>
        <span style="background: #eff6ff; color: #1d4ed8; font-weight: bold; padding: 4px 10px; border-radius: 6px; font-size: 13px;">biolinkagri.in Enterprise Desk</span>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #f8fafc; border-radius: 8px; overflow: hidden; font-size: 14px;">
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #64748b; width: 40%;"><strong>Client Name:</strong></td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Business Email:</strong></td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Phone / Target Tonnage:</strong></td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #0284c7;">${phone || '15 MT Bulk'}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Product Sector:</strong></td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: 700; color: #059669;">${productSector}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Inquiry Sourcing Node:</strong></td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0;">${enquiryType}</td>
        </tr>
      </table>

      <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; border-left: 4px solid #2563eb; margin: 20px 0;">
        <strong style="color: #0f172a; display: block; margin-bottom: 4px;">Payload / Technical Specifications:</strong>
        <p style="margin: 0; color: #334155; font-size: 14px; white-space: pre-line;">${message}</p>
      </div>

      <p style="font-size: 13px; color: #64748b; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px;">
        ⚡ BioLink Agritech Custom Domain Dispatch &bull; Handled via Verified Resend API Gateway.
      </p>
    </div>
  `;
}

export function buildContactAutoReply({ name, productSector = 'BioLink Agri' }) {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background: #ffffff;">
      <div style="border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #0f172a; margin: 0 0 4px 0;">Inquiry Registered Successfully 🚜</h2>
        <span style="color: #64748b; font-size: 13px;">BioLink Agritech Solutions &bull; Official B2B Gateway</span>
      </div>

      <p>Dear <strong>${name}</strong>,</p>
      <p>Thank you for reaching out to <strong>BioLink Agritech Solutions</strong>. We have received your B2B sourcing request for <strong>${productSector}</strong>.</p>
      
      <p>Our regional logistics matching desk is reviewing your requirements and matching ex-factory allocations with nearest registered facilities.</p>

      <div style="background: #eff6ff; color: #1e40af; padding: 12px 16px; border-radius: 8px; border-left: 4px solid #2563eb; font-size: 14px; margin: 20px 0;">
        <strong>Next Steps:</strong> A dedicated logistics coordinator will connect via WhatsApp or phone (+91 8581868466) within 24 business hours with initial freight routing.
      </div>

      <p>Warm regards,<br>
      <strong>Sahil Siddique</strong><br>
      Founder &amp; MD, BioLink Agritech Solutions<br>
      Patna, Bihar | <a href="https://biolinkagri.in" style="color: #2563eb; text-decoration: none;">biolinkagri.in</a></p>
    </div>
  `;
}

// ── Quote Email ──
export function buildQuoteEmail({ name, product, volume, pincode, quote }) {
  const displayProduct = String(product).replace(/-/g, ' ').toUpperCase();
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; max-width: 620px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background: #ffffff;">
      <div style="border-bottom: 2px solid #059669; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #064e3b; margin: 0 0 4px 0;">Instant B2B Freight &amp; Allocation Estimate</h2>
        <span style="color: #64748b; font-size: 13px;">BioLink Automated Logistics Routing Engine</span>
      </div>

      <p>Dear ${name},</p>
      <p>Below is your custom instant estimate for <strong>${displayProduct}</strong> calculated for delivery to PIN code <strong>${pincode}</strong>:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #f8fafc; border-radius: 8px; overflow: hidden; font-size: 14px;">
        <tr>
          <td style="padding: 12px 15px; border-bottom: 1px solid #e2e8f0; color: #475569;">Volume Allocation:</td>
          <td style="padding: 12px 15px; border-bottom: 1px solid #e2e8f0; font-weight: bold; text-align: right;">${volume} Metric Tons (MT)</td>
        </tr>
        <tr>
          <td style="padding: 12px 15px; border-bottom: 1px solid #e2e8f0; color: #475569;">Ex-Factory Base Rate:</td>
          <td style="padding: 12px 15px; border-bottom: 1px solid #e2e8f0; font-weight: bold; text-align: right;">Rs. ${quote.manureCost.toLocaleString('en-IN')}</td>
        </tr>
        <tr>
          <td style="padding: 12px 15px; border-bottom: 1px solid #e2e8f0; color: #475569;">Interstate Freight Charges:</td>
          <td style="padding: 12px 15px; border-bottom: 1px solid #e2e8f0; font-weight: bold; text-align: right;">Rs. ${quote.freightCost.toLocaleString('en-IN')}</td>
        </tr>
        <tr style="background: #edf2f7;">
          <td style="padding: 12px 15px; font-weight: bold; color: #0f172a;">Delivered Rate Per Ton:</td>
          <td style="padding: 12px 15px; font-weight: bold; color: #059669; text-align: right;">Rs. ${quote.pricePerTon.toLocaleString('en-IN')} / MT</td>
        </tr>
        <tr style="background: #e2e8f0;">
          <td style="padding: 12px 15px; font-weight: bold; color: #0f172a; font-size: 1.1em;">Estimated Grand Total:</td>
          <td style="padding: 12px 15px; font-weight: 800; color: #059669; text-align: right; font-size: 1.25em;">Rs. ${quote.total.toLocaleString('en-IN')}</td>
        </tr>
      </table>

      <p style="color: #b45309; font-size: 0.88em; font-weight: 600; background: #fffbeb; padding: 12px; border-radius: 6px; border-left: 4px solid #f59e0b;">
        *All allocations are protected by BioLink 72-Hour Gate Escrow. Funds are released to supplier facilities only after site Dharma Kanta weighbridge verification.
      </p>

      <p>Warm regards,<br>
      <strong>Sahil Siddique</strong><br>
      Founder &amp; MD, BioLink Agritech Solutions<br>
      <a href="https://biolinkagri.in" style="color: #059669; text-decoration: none;">biolinkagri.in</a></p>
    </div>
  `;
}

// ── Sample Order Email ──
export function buildSampleOrderEmail({ name, email, whatsapp, address, pincode, sampleSize, intendedUse, intendedUseOther, cropType, notes, sampleRefId }) {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; max-width: 620px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background: #ffffff;">
      <div style="border-bottom: 2px solid #10b981; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #065f46; margin: 0 0 6px 0;">📦 New Bio-Manure Sample Order Requested</h2>
        <span style="background: #ecfdf5; color: #047857; font-weight: bold; padding: 4px 10px; border-radius: 6px; font-size: 13px;">Ref: ${sampleRefId}</span>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #f8fafc; border-radius: 8px; overflow: hidden; font-size: 14px;">
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #64748b; width: 40%;"><strong>Sample Size Selected:</strong></td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #047857; font-size: 15px;">${sampleSize} Bag</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Customer Name:</strong></td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>WhatsApp Number:</strong></td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #0284c7;">${whatsapp}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Email Address:</strong></td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>PIN Code:</strong></td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${pincode}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; color: #64748b;"><strong>Complete Address:</strong></td>
          <td style="padding: 10px 14px; font-weight: 500;">${address}</td>
        </tr>
      </table>

      ${notes ? `
      <div style="background: #fffbeb; border: 1px solid #fef3c7; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px;">
        <strong style="color: #b45309; display: block; margin-bottom: 4px;">Customer Notes:</strong>
        <p style="margin: 0; color: #78350f; font-size: 14px;">${notes}</p>
      </div>` : ''}

      <p style="font-size: 13px; color: #64748b; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px;">
        ⚡ BioLink Agritech Sample Dispatch Protocol &bull; Verified via Resend / Custom Domain.
      </p>
    </div>
  `;
}

export function buildSampleOrderAutoReply({ name, sampleSize, address, pincode, sampleRefId }) {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background: #ffffff;">
      <div style="border-bottom: 2px solid #10b981; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #065f46; margin: 0 0 4px 0;">Sample Order Request Confirmed! 🌱</h2>
        <span style="color: #64748b; font-size: 14px;">Ref ID: <strong>${sampleRefId}</strong></span>
      </div>

      <p>Dear <strong>${name}</strong>,</p>
      <p>Thank you for requesting your <strong>BioLink Fermented Organic Manure (FOM) — ${sampleSize} Bag</strong>.</p>
      
      <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 14px;">
        <p style="margin: 0 0 6px 0;"><strong>Selected Size:</strong> ${sampleSize} Test Pack</p>
        <p style="margin: 0 0 6px 0;"><strong>Destination PIN Code:</strong> ${pincode}</p>
        <p style="margin: 0;"><strong>Delivery Address:</strong> ${address}</p>
      </div>

      <p style="background: #ecfdf5; color: #065f46; padding: 12px; border-radius: 8px; border-left: 4px solid #10b981; font-size: 14px; margin-bottom: 20px;">
        <strong>Next Steps:</strong> Our team will reach out via WhatsApp at your provided mobile number within 24 hours to confirm dispatch and courier tracking link.
      </p>

      <p>Warm regards,<br>
      <strong>Sahil Siddique</strong><br>
      Founder &amp; MD, BioLink Agritech Solutions<br>
      <a href="https://biolinkagri.in" style="color: #10b981; text-decoration: none;">biolinkagri.in</a></p>
    </div>
  `;
}

// ── Sea Buckthorn Advance Sample ──
export function buildSeaBuckthornSampleEmail({ companyName, name, email, whatsapp, requiredFormat, monthlyVolume, pincode, notes, sampleRefId }) {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; max-width: 620px; border: 1px solid #fed7aa; border-radius: 12px; padding: 24px; background: #ffffff;">
      <div style="border-bottom: 2px solid #ea580c; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #c2410c; margin: 0 0 6px 0;">🫐 Advance Sea Buckthorn Lab Sample Lead</h2>
        <span style="background: #fff7ed; color: #9a3412; font-weight: bold; padding: 4px 10px; border-radius: 6px; font-size: 13px;">Ref: ${sampleRefId}</span>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #fff7ed; border-radius: 8px; overflow: hidden; font-size: 14px;">
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #ffedd5; color: #9a3412; width: 42%;"><strong>Company / Brand Name:</strong></td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #ffedd5; font-weight: bold; color: #7c2d12; font-size: 15px;">${companyName}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #ffedd5; color: #9a3412;"><strong>Contact Person:</strong></td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #ffedd5; font-weight: bold;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #ffedd5; color: #9a3412;"><strong>WhatsApp Mobile:</strong></td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #ffedd5; font-weight: bold; color: #0284c7;">${whatsapp}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #ffedd5; color: #9a3412;"><strong>Email Address:</strong></td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #ffedd5;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #ffedd5; color: #9a3412;"><strong>Required Format:</strong></td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #ffedd5; font-weight: 700; color: #ea580c;">${requiredFormat}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #ffedd5; color: #9a3412;"><strong>Est. Monthly Volume:</strong></td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #ffedd5; font-weight: 700;">${monthlyVolume}</td>
        </tr>
      </table>

      ${notes ? `
      <div style="background: #fffbeb; border: 1px solid #fef3c7; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px;">
        <strong style="color: #b45309; display: block; margin-bottom: 4px;">Formulation / Specific Requirements:</strong>
        <p style="margin: 0; color: #78350f; font-size: 14px;">${notes}</p>
      </div>` : ''}

      <p style="font-size: 13px; color: #9a3412; margin-top: 24px; border-top: 1px solid #ffedd5; padding-top: 12px;">
        🌟 Himalayan Sea Buckthorn B2B Sourcing Protocol &bull; Dispatched via Resend API Gateway.
      </p>
    </div>
  `;
}

export function buildSeaBuckthornSampleAutoReply({ companyName, name, requiredFormat, sampleRefId }) {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; border: 1px solid #fed7aa; border-radius: 12px; padding: 24px; background: #ffffff;">
      <div style="border-bottom: 2px solid #ea580c; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #c2410c; margin: 0 0 4px 0;">Advance Lab Sample Registered! 🫐</h2>
        <span style="color: #9a3412; font-size: 14px;">Ref ID: <strong>${sampleRefId}</strong></span>
      </div>

      <p>Dear <strong>${name}</strong> (${companyName}),</p>
      <p>Thank you for expressing interest in BioLink Agritech's <strong>Himalayan Sea Buckthorn Extract B2B Pilot Sourcing Program</strong>.</p>
      
      <div style="background: #fff7ed; border: 1px solid #ffedd5; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 14px;">
        <p style="margin: 0 0 6px 0;"><strong>Company:</strong> ${companyName}</p>
        <p style="margin: 0 0 6px 0;"><strong>Requested Format:</strong> ${requiredFormat}</p>
        <p style="margin: 0;"><strong>Target Launch Batch:</strong> October 2026 Procurement Window</p>
      </div>

      <p>Warm regards,<br>
      <strong>Sahil Siddique</strong><br>
      Founder &amp; MD, BioLink Agritech Solutions<br>
      <a href="https://biolinkagri.in" style="color: #ea580c; text-decoration: none;">biolinkagri.in</a></p>
    </div>
  `;
}

export function buildNotifyEmail({ productName }) {
  return `
    <div style="font-family: 'Segoe UI', sans-serif; line-height: 1.6; color: #2d3748; max-width: 600px;">
      <p>Hello,</p>
      <p>You have been added to the early access notification list for <strong>${productName}</strong>.</p>
      <p>We will let you know as soon as retail packages are ready for booking in your region.</p>
      <p>Best regards,<br>
      BioLink Agritech Team</p>
    </div>
  `;
}

export function buildBuyerReceipt({ buyerName, listing, quantityTons, order }) {
  return `
    <div style="font-family: sans-serif; line-height: 1.6; color: #2d3748; max-width: 600px;">
      <p>Dear ${buyerName},</p>
      <p>Your bulk bio-input order has been registered successfully, and the payment is held in the secure quality escrow account.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #f7fafc; border-radius: 8px;">
        <tr><td style="padding: 10px;">Order ID:</td><td style="font-weight: bold; text-align: right;">${order.trackingId}</td></tr>
        <tr><td style="padding: 10px;">Source Plant:</td><td style="font-weight: bold; text-align: right;">${listing.plantName}</td></tr>
        <tr><td style="padding: 10px;">Quantity:</td><td style="font-weight: bold; text-align: right;">${quantityTons} MT</td></tr>
        <tr><td style="padding: 10px;">Total Paid:</td><td style="font-weight: bold; text-align: right; color: #10b981;">Rs. ${order.totalPaid.toLocaleString('en-IN')}</td></tr>
      </table>
      <p>Funds will be held securely in escrow and released only after site weighbridge & quality verification.</p>
    </div>
  `;
}

export function buildPlantNotification({ buyer, listing, quantityTons, order }) {
  return `
    <div style="font-family: sans-serif; line-height: 1.6; color: #2d3748; max-width: 600px;">
      <p>Hello Plant Partner,</p>
      <p>A new bulk order has been assigned to your facility:</p>
      <ul>
        <li><strong>Tracking ID:</strong> ${order.trackingId}</li>
        <li><strong>Quantity:</strong> ${quantityTons} Tons</li>
        <li><strong>Buyer:</strong> ${buyer.name}</li>
        <li><strong>Delivery Address:</strong> ${order.deliveryAddress}</li>
      </ul>
    </div>
  `;
}

export function buildQAClearanceEmail({ buyerName, trackingId, quantityTons, settleUrl }) {
  return `
    <div style="font-family: sans-serif; line-height: 1.6; color: #2d3748; max-width: 600px;">
      <p>Dear ${buyerName},</p>
      <p>Your consignment <strong>${trackingId}</strong> (${quantityTons} MT) has arrived at your destination site.</p>
      <p><a href="${settleUrl}" style="display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 6px;">Confirm Quality & Release Funds</a></p>
    </div>
  `;
}

export function buildSettlementConfirmEmail({ recipientName, trackingId, totalPaid }) {
  return `
    <div style="font-family: sans-serif; line-height: 1.6; color: #2d3748; max-width: 600px;">
      <p>Dear ${recipientName},</p>
      <p>Consignment <strong>${trackingId}</strong> has been confirmed. Escrow payment of Rs. ${totalPaid.toLocaleString('en-IN')} is settled.</p>
    </div>
  `;
}

export function buildPartnerReferralNotificationEmail({ partnerName, referralCode, farmerName, farmerMobile, farmerEmail, pincode, product, volume }) {
  const mt = Number(volume || 15);
  const totalCommission = mt * 300;
  return `
    <div style="font-family: sans-serif; padding: 20px; background: #111827; color: #f8fafc; border-radius: 10px;">
      <h2 style="color: #34d399;">New Referral Attributed to ${partnerName} (${referralCode})</h2>
      <p>Farmer: <strong>${farmerName}</strong> (${farmerMobile})</p>
      <p>Quantity: <strong>${mt} MT</strong> | Earned Commission: <strong style="color: #10b981;">Rs. ${totalCommission.toLocaleString('en-IN')}</strong></p>
    </div>
  `;
}
