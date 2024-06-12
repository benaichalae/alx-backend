#!/usr/bin/env node
import sinon from 'sinon';
import { expect } from 'chai';
import { createQueue } from 'kue';
import createPushNotificationsJobs from './8-job.js';

describe('createPushNotificationsJobs', () => {
  let consoleSpy;
  let queue;

  beforeEach(() => {
    consoleSpy = sinon.spy(console, 'log');
    queue = createQueue({ name: 'push_notification_code_test' });
  });

  afterEach(() => {
    consoleSpy.restore();
    queue.testMode.clear();
  });

  it('throws an error if jobs is not an array', () => {
    return expect(createPushNotificationsJobs({}, queue)).to.be.rejectedWith('Jobs is not an array');
  });

  it('adds jobs to the queue with the correct type', async () => {
    const jobInfos = [
      {
        phoneNumber: '44556677889',
        message: 'Use the code 1982 to verify your account',
      },
      {
        phoneNumber: '98877665544',
        message: 'Use the code 1738 to verify your account',
      },
    ];

    await createPushNotificationsJobs(jobInfos, queue);

    expect(queue.testMode.jobs.length).to.equal(2);
    expect(queue.testMode.jobs[0].data).to.deep.equal(jobInfos[0]);
    expect(queue.testMode.jobs[0].type).to.equal('push_notification_code_3');
  });

  it('logs progress event correctly', async () => {
    const job = queue.createJob('push_notification_code_3', { phoneNumber: '44556677889', message: 'Test message' });
    await job.save();

    const progressSpy = sinon.spy(job, 'log');

    job.emit('progress', 50);
    expect(progressSpy.calledWith('50% complete')).to.be.true;
  });

  it('logs failed event correctly', async () => {
    const job = queue.createJob('push_notification_code_3', { phoneNumber: '44556677889', message: 'Test message' });
    await job.save();

    const error = new Error('Failed to send');
    const failedSpy = sinon.spy(job, 'log');

    job.emit('failed', error);
    expect(failedSpy.calledWith('failed:', error.message)).to.be.true;
  });

  it('logs complete event correctly', async () => {
    const job = queue.createJob('push_notification_code_3', { phoneNumber: '44556677889', message: 'Test message' });
    await job.save();

    const completeSpy = sinon.spy(job, 'log');

    job.emit('complete');
    expect(completeSpy.calledWith('completed')).to.be.true;
  });
});
