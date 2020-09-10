import {useState} from "react";

type InputHook = {
    value: string;
    setValue: (s: string) => void;
    reset: () => void;
    bind: {
        value: string;
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    };
};
/**
 * @function useInput
 * @description check if all args are null
 *
 * @param {string} initialValue - default input value
 * @return {boolean}
 *
 * @example
 * const {value: name, setValue} useInput("majdi")
 *
 */
export default function useInput(initialValue: string = ""): InputHook {
    const [value, setValue] = useState<string>(initialValue);

    return {
        value,
        setValue,
        reset: (): void => setValue(""),
        bind: {
            value,
            onChange(event: React.ChangeEvent<HTMLInputElement>): void {
                setValue(event.target.value);
            },
        },
    };
}
