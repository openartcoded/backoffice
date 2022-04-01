import { DayOfWeek, Month } from '@core/models/date-enhanced';

export interface Timesheet {
  readonly id?: string;
  readonly dateCreation?: Date;
  name?: string;
  periods?: TimesheetPeriod[];
  readonly closed?: boolean;
  readonly uploadId?: string;
  readonly year?: number;
  readonly month?: number;
  readonly monthEnum?: Month;
  readonly numberOfWorkingDays?: number;
  readonly numberOfMinutesWorked?: number;
  readonly numberOfHoursWorked?: string;
}

export interface TimesheetPeriod {
  readonly id?: string;
  readonly date?: Date;
  readonly duration?: number;
  readonly durationInHours?: string;
  shortDescription?: string;
  projectName?: string;
  morningStartTime?: Date;
  morningEndTime?: Date;
  afternoonStartTime?: Date;
  afternoonEndTime?: Date;
  periodType?: PeriodType;
  dayOfWeek?: DayOfWeek;
}

export enum PeriodType {
  SICKNESS,
  PUBLIC_HOLIDAYS,
  AUTHORIZED_HOLIDAYS,
  WORKING_DAY,
  WEEKEND,
}

export interface TimesheetSettings {
  readonly id?: string;
  maxHoursPerDay?: number;
  minHoursPerDay?: number;
  defaultProjectName?: string;
}
