import dayjs from "dayjs"
import utcPlugin from 'dayjs/plugin/utc'
import timezonePlugin from 'dayjs/plugin/timezone'
dayjs.extend(utcPlugin);
dayjs.extend(timezonePlugin);
dayjs.tz.setDefault("America/Sao_Paulo");


export function getFileName(url: string) {
    return dayjs().format('DD-MM-YYYYTHH-mm-ss')
}
