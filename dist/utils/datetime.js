import moment from 'moment';
export const timeTickMark = (ts) => {
    let date = moment(ts);
    if (date.get('h') == 0) {
        if (date.get('D') == 1) {
            if (date.get('M') == 0)
                return date.get('y').toString();
            return date.format('MMM');
        }
        return date.get('D').toString();
    }
    return date.format('HH:mm');
};
export const currentTimeTickMark = (ts) => {
    return moment(ts).format("ddd DD MMM 'YY HH:mm");
};
export const toMinutes = (ts) => {
    if (ts.toString().length != (+new Date()).toString().length)
        ts *= 1000;
    let date = new Date(ts);
    return +new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
};
export const dayOfYear = (date) => Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
export const timeUnitWeightMap = Object.freeze({
    year: 31536000000,
    quarter: 7776000000,
    month: 2592000000,
    week: 604800000,
    day: 86400000,
    hour: 3600000,
    minute: 60000,
    second: 1000
});
export var IntervalWeights;
(function (IntervalWeights) {
    IntervalWeights[IntervalWeights["1s"] = 1000] = "1s";
    IntervalWeights[IntervalWeights["1m"] = 60000] = "1m";
    IntervalWeights[IntervalWeights["3m"] = 180000] = "3m";
    IntervalWeights[IntervalWeights["5m"] = 300000] = "5m";
    IntervalWeights[IntervalWeights["15m"] = 900000] = "15m";
    IntervalWeights[IntervalWeights["30m"] = 1800000] = "30m";
    IntervalWeights[IntervalWeights["1h"] = 3600000] = "1h";
    IntervalWeights[IntervalWeights["2h"] = 7200000] = "2h";
    IntervalWeights[IntervalWeights["4h"] = 14400000] = "4h";
    IntervalWeights[IntervalWeights["6h"] = 21600000] = "6h";
    IntervalWeights[IntervalWeights["8h"] = 28800000] = "8h";
    IntervalWeights[IntervalWeights["12h"] = 43200000] = "12h";
    IntervalWeights[IntervalWeights["1d"] = 86400000] = "1d";
    IntervalWeights[IntervalWeights["3d"] = 259200000] = "3d";
    IntervalWeights[IntervalWeights["1w"] = 604800000] = "1w";
    IntervalWeights[IntervalWeights["1M"] = 2592000000] = "1M";
})(IntervalWeights || (IntervalWeights = {}));
const dateRangeToIntervalMap = {
    '1d': '1m',
    '5d': '5m',
    '1M': '30m',
    '3M': '1h',
    '6M': '2h',
    ytd: '1d',
    '1y': '1d',
    '5y': '1w',
    all: '1M'
};
export const getTimeUnitWeight = (value) => {
    return timeUnitWeightMap[moment.normalizeUnits(value)];
};
export const timeUnitToRange = (value, start = +new Date()) => {
    let t = getTimeUnitWeight(value);
    return [t - start, t];
};
export const getIntervalByDateRange = (value) => {
    return dateRangeToIntervalMap[value];
};
