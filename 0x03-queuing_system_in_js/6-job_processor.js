#!/usr/bin/yarn dev
import kue from 'kue';

const queue = kue.createQueue();

const sendNotification = (phoneNumber, message) => {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
};

queue.process('push_notification_code', (job, done) => {
  sendNotification(job.data.phoneNumber, job.data.message);
  done();
});

// Create a job to demonstrate the processing
const job = queue.create('push_notification_code', {
  phoneNumber: '07045679939',
  message: 'Account registered',
});

job
  .on('enqueue', () => {
    console.log('Notification job created:', job.id);
  })
  .on('complete', () => {
    console.log('Notification job completed');
  })
  .on('failed attempt', (errorMessage, doneAttempts) => {
    console.log(`Notification job failed after ${doneAttempts} attempts:`, errorMessage);
  })
  .on('failed', () => {
    console.log('Notification job failed completely');
  });

job.save();
