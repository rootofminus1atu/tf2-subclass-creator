import { ok } from "neverthrow";

export const okify = <T>(x: T) => ok(x)