export declare const Role: {
    readonly ADMIN: "ADMIN";
    readonly HR_MANAGER: "HR_MANAGER";
    readonly EMPLOYEE: "EMPLOYEE";
};
export type Role = (typeof Role)[keyof typeof Role];
