const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const { sendAppointmentReminderEmails } = require('../utils/emailService');

const initCronScheduler = () => {
  console.log('[Cron Service] Initializing Appointment Start Reminder Cron Job...');

  // Schedule task to run every minute (* * * * *)
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const todayStr = `${year}-${month}-${day}`;

      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;

      // Calculate time 5 minutes from now for advance reminder
      const in5Mins = new Date(now.getTime() + 5 * 60 * 1000);
      const in5Hours = String(in5Mins.getHours()).padStart(2, '0');
      const in5Minutes = String(in5Mins.getMinutes()).padStart(2, '0');
      const in5TimeStr = `${in5Hours}:${in5Minutes}`;

      // Find approved appointments today where start time is near current time and reminder hasn't been sent
      const upcomingAppointments = await Appointment.find({
        status: 'Approved',
        date: todayStr,
        reminderSent: { $ne: true },
        'timeSlot.start': { $in: [currentTimeStr, in5TimeStr] },
      })
        .populate('customer', 'name email')
        .populate('provider', 'name email title specialization');

      for (const appt of upcomingAppointments) {
        if (appt.customer && appt.provider) {
          console.log(`[Cron Service] Triggering appointment start reminder for Appointment ${appt._id} (${appt.timeSlot.start})`);
          await sendAppointmentReminderEmails({
            customer: appt.customer,
            provider: appt.provider,
            appointment: appt,
          });
          appt.reminderSent = true;
          await appt.save();
        }
      }
    } catch (error) {
      console.error('[Cron Service] Error checking upcoming appointments:', error.message);
    }
  });
};

module.exports = { initCronScheduler };
