import { Resend } from 'resend'

// Resend uses HTTPS port 443 — never blocked by ISPs unlike SMTP ports 465/587
const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'SenSaloon <onboarding@resend.dev>'

// Resend free tier only delivers to the account owner's email without a verified domain.
// All emails are redirected here until a domain is verified at resend.com/domains.
const TO = process.env.RESEND_DEV_EMAIL

// Convert "DD_MM_YYYY" → "12 May 2026"
const formatDate = (slotDate) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]
  const [day, month, year] = slotDate.split('_')
  return `${day} ${months[Number(month) - 1]} ${year}`
}

// Shared branded HTML wrapper
const emailShell = (title, bodyHtml) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
  <style>
    body { margin:0; padding:0; background:#f4f4f7; font-family:'Segoe UI',Arial,sans-serif; }
    .wrapper { max-width:600px; margin:40px auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 16px rgba(0,0,0,0.08); }
    .header { background:#5F6FFF; padding:32px 40px; text-align:center; }
    .header h1 { margin:0; color:#ffffff; font-size:26px; letter-spacing:1px; }
    .header p  { margin:6px 0 0; color:#d0d4ff; font-size:13px; }
    .body { padding:36px 40px; }
    .status-badge { display:inline-block; padding:6px 18px; border-radius:20px; font-size:13px; font-weight:600; margin-bottom:20px; }
    .badge-green { background:#dcfce7; color:#16a34a; }
    .badge-blue  { background:#dbeafe; color:#1d4ed8; }
    .badge-red   { background:#fee2e2; color:#dc2626; }
    h2 { margin:0 0 6px; color:#1a1a2e; font-size:20px; }
    p  { margin:0 0 12px; color:#555; line-height:1.6; font-size:14px; }
    .detail-card { background:#f8f9ff; border:1px solid #e8ebff; border-radius:8px; padding:20px 24px; margin:20px 0; }
    .detail-row  { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #eee; font-size:14px; }
    .detail-row:last-child { border-bottom:none; }
    .detail-label { color:#888; }
    .detail-value { color:#222; font-weight:600; }
    .amount-row .detail-value { color:#5F6FFF; font-size:16px; }
    .btn { display:inline-block; margin-top:24px; padding:12px 32px; background:#5F6FFF; color:#ffffff; text-decoration:none; border-radius:6px; font-size:14px; font-weight:600; }
    .footer { background:#f8f9ff; padding:20px 40px; text-align:center; border-top:1px solid #eee; }
    .footer p { margin:0; color:#aaa; font-size:12px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>✂ SenSaloon</h1>
      <p>Professional Salon Booking Platform</p>
    </div>
    <div class="body">${bodyHtml}</div>
    <div class="footer">
      <p>© 2026 SenSaloon · This is an automated message, please do not reply.</p>
    </div>
  </div>
</body>
</html>`

/**
 * Booking confirmation — sent immediately when an appointment is saved.
 */
export const sendBookingConfirmationEmail = async ({ userData, stylistData, slotDate, slotTime, amount }) => {
  try {
    const formattedDate = formatDate(slotDate)

    const body = `
      <span class="status-badge badge-blue">Booking Confirmed</span>
      <h2>Hi ${userData.name},</h2>
      <p>Your appointment at <strong>SenSaloon</strong> has been successfully booked. Please complete the payment to secure your slot.</p>
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Stylist</span>
          <span class="detail-value">${stylistData.name}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Service</span>
          <span class="detail-value">${stylistData.speciality || 'Salon Service'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date</span>
          <span class="detail-value">${formattedDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Time</span>
          <span class="detail-value">${slotTime}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Salon Address</span>
          <span class="detail-value">${stylistData.address?.line1 || ''}, ${stylistData.address?.line2 || ''}</span>
        </div>
        <div class="detail-row amount-row">
          <span class="detail-label">Amount Due</span>
          <span class="detail-value">Rs. ${amount.toLocaleString()}</span>
        </div>
      </div>
      <p>Log in and complete the payment to confirm your slot.</p>
      <a class="btn" href="${process.env.FRONTEND_URL}/my-appointments">View &amp; Pay Now</a>`

    const { data, error } = await resend.emails.send({
      from: FROM,
      to: TO,
      subject: `Appointment Booked – ${stylistData.name} on ${formattedDate}`,
      html: emailShell('Appointment Confirmed – SenSaloon', body),
    })

    if (error) {
      console.error(`❌ Booking email BLOCKED by Resend → ${userData.email}:`, error)
    } else {
      console.log(`📧 Booking email queued → ${userData.email} (id: ${data?.id})`)
    }
  } catch (err) {
    console.error('Booking email error:', err.message)
  }
}

/**
 * Payment confirmation — sent when PayHere confirms a successful payment.
 * Fires two emails in parallel: one to the customer, one to the stylist.
 */
export const sendPaymentConfirmationEmail = async ({ userData, stylistData, slotDate, slotTime, amount }) => {
  const formattedDate = formatDate(slotDate)

  // ── 1. Customer email ──────────────────────────────────────────────────────
  const customerBody = `
    <span class="status-badge badge-green">Payment Received ✓</span>
    <h2>Thank you, ${userData.name}!</h2>
    <p>Your payment has been received and your appointment is fully confirmed. We look forward to seeing you!</p>
    <div class="detail-card">
      <div class="detail-row">
        <span class="detail-label">Stylist</span>
        <span class="detail-value">${stylistData.name}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Service</span>
        <span class="detail-value">${stylistData.speciality || 'Salon Service'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Date</span>
        <span class="detail-value">${formattedDate}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Time</span>
        <span class="detail-value">${slotTime}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Salon Address</span>
        <span class="detail-value">${stylistData.address?.line1 || ''}, ${stylistData.address?.line2 || ''}</span>
      </div>
      <div class="detail-row amount-row">
        <span class="detail-label">Amount Paid</span>
        <span class="detail-value">Rs. ${amount.toLocaleString()}</span>
      </div>
    </div>
    <p>Please arrive 5 minutes before your scheduled time.</p>
    <a class="btn" href="${process.env.FRONTEND_URL}/my-appointments">View My Appointments</a>`

  // ── 2. Stylist notification email ──────────────────────────────────────────
  const stylistBody = `
    <span class="status-badge badge-green">New Appointment Confirmed ✓</span>
    <h2>Hi ${stylistData.name},</h2>
    <p>A customer has completed payment and their appointment with you is now confirmed.</p>
    <div class="detail-card">
      <div class="detail-row">
        <span class="detail-label">Customer</span>
        <span class="detail-value">${userData.name}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Customer Email</span>
        <span class="detail-value">${userData.email}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Customer Phone</span>
        <span class="detail-value">${userData.phone || 'Not provided'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Service</span>
        <span class="detail-value">${stylistData.speciality || 'Salon Service'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Date</span>
        <span class="detail-value">${formattedDate}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Time</span>
        <span class="detail-value">${slotTime}</span>
      </div>
      <div class="detail-row amount-row">
        <span class="detail-label">Amount Received</span>
        <span class="detail-value">Rs. ${amount.toLocaleString()}</span>
      </div>
    </div>
    <p>Please be ready for the appointment. You can view all your upcoming bookings in your dashboard.</p>
    <a class="btn" href="${process.env.FRONTEND_URL}/stylist-appointments">View My Schedule</a>`

  // Send both emails in parallel
  await Promise.allSettled([
    resend.emails.send({
      from: FROM,
      to: TO,
      subject: `Payment Confirmed – Appointment with ${stylistData.name} on ${formattedDate}`,
      html: emailShell('Payment Confirmed – SenSaloon', customerBody),
    }).then(({ data, error }) => {
      if (error) console.error(`❌ Payment email BLOCKED → customer ${userData.email}:`, error)
      else console.log(`📧 Payment email queued → customer: ${userData.email} (id: ${data?.id})`)
    }).catch((err) => console.error('Payment email (customer) error:', err.message)),

    resend.emails.send({
      from: FROM,
      to: TO,
      subject: `New Appointment – ${userData.name} on ${formattedDate} at ${slotTime}`,
      html: emailShell('New Appointment Confirmed – SenSaloon', stylistBody),
    }).then(({ data, error }) => {
      if (error) console.error(`❌ Payment email BLOCKED → stylist ${stylistData.email}:`, error)
      else console.log(`📧 Payment email queued → stylist: ${stylistData.email} (id: ${data?.id})`)
    }).catch((err) => console.error('Payment email (stylist) error:', err.message)),
  ])
}

/**
 * Completion — sent when a stylist marks the appointment as completed.
 */
export const sendCompletionEmail = async ({ userData, stylistData, slotDate, slotTime, amount }) => {
  try {
    const formattedDate = formatDate(slotDate)

    const body = `
      <span class="status-badge badge-green">Appointment Completed ✓</span>
      <h2>Thank you, ${userData.name}!</h2>
      <p>Your appointment at <strong>SenSaloon</strong> has been completed. We hope you had a great experience!</p>
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Stylist</span>
          <span class="detail-value">${stylistData.name}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Service</span>
          <span class="detail-value">${stylistData.speciality || 'Salon Service'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date</span>
          <span class="detail-value">${formattedDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Time</span>
          <span class="detail-value">${slotTime}</span>
        </div>
        <div class="detail-row amount-row">
          <span class="detail-label">Amount Paid</span>
          <span class="detail-value">Rs. ${amount.toLocaleString()}</span>
        </div>
      </div>
      <p>We'd love to see you again! Book your next appointment any time.</p>
      <a class="btn" href="${process.env.FRONTEND_URL}/stylists">Book Again</a>`

    const { data, error } = await resend.emails.send({
      from: FROM,
      to: TO,
      subject: `Appointment Completed – Thank you for visiting SenSaloon`,
      html: emailShell('Appointment Completed – SenSaloon', body),
    })

    if (error) {
      console.error(`❌ Completion email BLOCKED → ${userData.email}:`, error)
    } else {
      console.log(`📧 Completion email sent → ${userData.email} (id: ${data?.id})`)
    }
  } catch (err) {
    console.error('Completion email error:', err.message)
  }
}

/**
 * Cancellation — sent when a user cancels their appointment.
 */
export const sendCancellationEmail = async ({ userData, stylistData, slotDate, slotTime }) => {
  try {
    const formattedDate = formatDate(slotDate)

    const body = `
      <span class="status-badge badge-red">Appointment Cancelled</span>
      <h2>Hi ${userData.name},</h2>
      <p>Your appointment at <strong>SenSaloon</strong> has been cancelled as requested.</p>
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Stylist</span>
          <span class="detail-value">${stylistData.name}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date</span>
          <span class="detail-value">${formattedDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Time</span>
          <span class="detail-value">${slotTime}</span>
        </div>
      </div>
      <p>We hope to see you again soon. You can book a new appointment any time.</p>
      <a class="btn" href="${process.env.FRONTEND_URL}/stylists">Book Again</a>`

    await resend.emails.send({
      from: FROM,
      to: TO,
      subject: `Appointment Cancelled – ${stylistData.name} on ${formattedDate}`,
      html: emailShell('Appointment Cancelled – SenSaloon', body),
    })

    console.log(`📧 Cancellation email sent to ${userData.email}`)
  } catch (err) {
    console.error('Cancellation email error:', err.message)
  }
}
