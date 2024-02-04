import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const tw = (...input) => twMerge(clsx(input));
