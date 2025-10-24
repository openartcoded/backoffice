import { HealthIndicator } from './health.indicator';

export interface BackendInfo {
  pid: string;
  build: Build;
}

export type Indicators = { buildInfo: BackendInfo; healthIndicator: HealthIndicator };
export interface Build {
  artifact: string;
  group: string;
  name: string;
  version: string;
  time: Date;
  java: BackendInfoSource;
  encoding: BackendInfoEncoding;
}

export interface BackendInfoSource {
  source: string;
}

export interface BackendInfoEncoding {
  source: string;
  reporting: string;
}
