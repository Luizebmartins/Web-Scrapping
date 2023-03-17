import dayjs from "dayjs"
import utcPlugin from 'dayjs/plugin/utc'
import timezonePlugin from 'dayjs/plugin/timezone'
dayjs.extend(utcPlugin);
dayjs.extend(timezonePlugin);
dayjs.tz.setDefault("America/Sao_Paulo");



export function getFileName(url: string) {
    const regex = /fileId=([a-zA-Z0-9]+)/
    const fileId = url.match(regex)

    if(fileId) {
        return `${dayjs().format('DD-MM-YYYY')}_${fileId[1]}`
    } else {
        return dayjs().format('DD-MM-YYYYTHH:mm:ss')
    }
}