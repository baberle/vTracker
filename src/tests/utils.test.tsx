import * as Utils from "../utilities/utils";
import { describe, it, expect } from "vitest";

describe("getLocalDate", () => {
    it("should return a string with the correct format", () => {
        const result = Utils.getLocalDate();
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        expect(result).toMatch(regex);
    });
});

describe("getMonthNumber", () => {
    it("should return the correct month number with days as decimal", () => {
        const date = new Date(2023, 0, 15); // January 15, 2023
        const result = Utils.getMonthNumber(date);
        expect(result).toBeCloseTo(1.45, 2);
    });

    it("should handle end of month correctly", () => {
        const date = new Date(2023, 1, 28); // February 28, 2023
        const result = Utils.getMonthNumber(date);
        expect(result).toBeCloseTo(2.96, 2);
    });

    it("should handle beginning of month correctly", () => {
        const date = new Date(2023, 6, 1); // July 1, 2023
        const result = Utils.getMonthNumber(date);
        expect(result).toBeCloseTo(7.0, 2);
    });
});
