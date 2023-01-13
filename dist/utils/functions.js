export const debounce = (cb, timeout = 100) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => cb.apply(this, args), timeout);
    };
};
export const capitalize = (s) => s[0].toUpperCase() + s.slice(1, s.length);
