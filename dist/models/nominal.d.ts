export declare type Nominal<T, Name extends string> = T & {
    [Symbol.species]: Name;
};
