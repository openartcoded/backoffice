export interface HealthIndicator {
  status: HealthStatus;
  components: HealthComponent;
}

export enum HealthStatus {
  DOWN,
  OUT_OF_SERVICE,
  UP,
  UNKNOWN,
}

export interface HealthComponent {
  camelHealth?: CamelHealth;
  mail?: any;
  redis?: any;
  diskSpace?: DiskSpace;
  jms?: Jms;
  mongo?: Mongo;
}

export interface CamelHealth {
  status: HealthStatus;
  details: any;
}

export interface DiskSpace {
  status: HealthStatus;
  details: DiskSpaceDetails;
}

export interface Jms {
  status: HealthStatus;
  details: any;
}

export interface Mongo {
  status: HealthStatus;
  details: MongoDetails;
}

export interface MongoDetails {
  version: string;
}

export interface DiskSpaceDetails {
  total: number;
  free: number;
  threshold: number;
  exists: boolean;
}
