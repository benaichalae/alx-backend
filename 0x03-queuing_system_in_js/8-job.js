#!/usr/bin/env node
const { Queue, Job } = require('kue');

async function createPushNotificationsJobs(jobs, queue) {
  if (!Array.isArray(jobs)) {
    throw new Error('Jobs is not an array');
  }
  for (const jobInfo of jobs) {
    const job = await new Promise((resolve, reject) => {
      const jobInstance = queue.create('push_notification_code_3', jobInfo);
      jobInstance
        .on('enqueue', () => {
          console.log('Notification job created:', jobInstance.id);
        })
        .on('complete', () => {
          console.log('Notification job', jobInstance.id, 'completed');
        })
        .on('failed', (err) => {
          console.log('Notification job', jobInstance.id, 'failed:', err.message || err.toString());
        })
        .on('progress', (progress, _data) => {
          console.log('Notification job', jobInstance.id, `${progress}% complete`);
        });
      jobInstance.save((err) => {
        if (err) {
          reject(err);
        } else {
          resolve(jobInstance);
        }
      });
    });
  }
}

module.exports = createPushNotificationsJobs;
