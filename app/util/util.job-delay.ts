const jobsDelayNames: any = {};
export function utilJobDelay(
  jobName: string,
  myFunction: () => void,
  timeout: number
) {
  if (jobsDelayNames[jobName]) {
    clearTimeout(jobsDelayNames[jobName]);
    delete jobsDelayNames[jobName];
  }
  jobsDelayNames[jobName] = setTimeout(myFunction, timeout);
}
