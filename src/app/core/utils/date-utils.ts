import * as moment from 'moment-timezone';

export class DateUtils {
  static toOptionalDate(value) {
    return value ? new Date(value) : null;
  }

  static toDateOrNow(value) {
    return value ? new Date(value) : new Date();
  }

  static formatInputDateTime(date) {
    return moment(date).tz('Europe/Brussels').format().substring(0, 16);
  }

  static dateStrToUtc(v) {
    return new Date(new Date(v).toUTCString());
  }

  static getCurrentTime() {
    return new Date().getTime();
  }

  static now() {
    return new Date();
  }

  static formatInputDate(date: Date) {
    return date.toISOString().substring(0, 10);
  }

  static getDateFromInput(value: any) {
    return new Date(value);
  }

  static getIsoDateFromBackend(d: any) {
    return DateUtils.getDateFromInput(d).toISOString();
  }

  static getCurrentYear() {
    return new Date().getFullYear();
  }
}
