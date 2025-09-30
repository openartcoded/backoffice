import moment from 'moment-timezone';

export class DateUtils {
    static toOptionalDate(value) {
        return value ? new Date(value) : null;
    }

    static toDateOrNow(value) {
        return value ? new Date(value) : new Date();
    }

    static formatInputDateTime(date) {
        if (date) {
            return moment(date).tz('Europe/Brussels').format().substring(0, 16);
        } else {
            return '';
        }
    }
    static formatInputDateTimeWithCustomFormat(date, format) {
        if (date) {
            return moment(date).tz('Europe/Brussels').format(format).substring(0, 16);
        } else {
            return '';
        }
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

    static formatInputDate(date?: Date) {
        if (!date) {
            return null;
        }
        return date.toISOString().substring(0, 10);
    }

    static getDateFromInput(value: any) {
        if (!value) {
            return null;
        }
        return new Date(value);
    }

    static getIsoDateFromBackend(d: any) {
        return DateUtils.getDateFromInput(d).toISOString();
    }

    static getCurrentYear() {
        return new Date().getFullYear();
    }
}
