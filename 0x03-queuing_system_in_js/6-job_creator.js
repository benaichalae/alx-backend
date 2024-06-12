#!/usr/bin/yarn dev
import kue from 'kue';

const queue = kue.createQueue({ name: 'push_notification_code' });

const jobData = {
  phoneNumber: '07045679939',
  message: 'Account registered',
};

const job = queue.create('push_notification_code', jobData)
  .save((err) => {
    if (err) {
      console.error('Failed to save job:', err);
    } else {
      console.log('Notification job created:', job.id);
    }
  });

job.on('complete', () => {
  console.log('Notification job completed');
});

job.on('failed attempt', (errorMessage, doneAttempts) => {
  console.log(`Notification job failed after ${doneAttempts} attempts:`, errorMessage);
});

job.on('failed', () => {
  console.log('Notification job failed completely');
});
