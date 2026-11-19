import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type EmployeeModel = runtime.Types.Result.DefaultSelection<Prisma.$EmployeePayload>;
export type AggregateEmployee = {
    _count: EmployeeCountAggregateOutputType | null;
    _min: EmployeeMinAggregateOutputType | null;
    _max: EmployeeMaxAggregateOutputType | null;
};
export type EmployeeMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    designation: string | null;
    profileImage: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    departmentId: string | null;
};
export type EmployeeMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    designation: string | null;
    profileImage: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    departmentId: string | null;
};
export type EmployeeCountAggregateOutputType = {
    id: number;
    userId: number;
    firstName: number;
    lastName: number;
    phone: number;
    designation: number;
    profileImage: number;
    createdAt: number;
    updatedAt: number;
    departmentId: number;
    _all: number;
};
export type EmployeeMinAggregateInputType = {
    id?: true;
    userId?: true;
    firstName?: true;
    lastName?: true;
    phone?: true;
    designation?: true;
    profileImage?: true;
    createdAt?: true;
    updatedAt?: true;
    departmentId?: true;
};
export type EmployeeMaxAggregateInputType = {
    id?: true;
    userId?: true;
    firstName?: true;
    lastName?: true;
    phone?: true;
    designation?: true;
    profileImage?: true;
    createdAt?: true;
    updatedAt?: true;
    departmentId?: true;
};
export type EmployeeCountAggregateInputType = {
    id?: true;
    userId?: true;
    firstName?: true;
    lastName?: true;
    phone?: true;
    designation?: true;
    profileImage?: true;
    createdAt?: true;
    updatedAt?: true;
    departmentId?: true;
    _all?: true;
};
export type EmployeeAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EmployeeWhereInput;
    orderBy?: Prisma.EmployeeOrderByWithRelationInput | Prisma.EmployeeOrderByWithRelationInput[];
    cursor?: Prisma.EmployeeWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | EmployeeCountAggregateInputType;
    _min?: EmployeeMinAggregateInputType;
    _max?: EmployeeMaxAggregateInputType;
};
export type GetEmployeeAggregateType<T extends EmployeeAggregateArgs> = {
    [P in keyof T & keyof AggregateEmployee]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateEmployee[P]> : Prisma.GetScalarType<T[P], AggregateEmployee[P]>;
};
export type EmployeeGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EmployeeWhereInput;
    orderBy?: Prisma.EmployeeOrderByWithAggregationInput | Prisma.EmployeeOrderByWithAggregationInput[];
    by: Prisma.EmployeeScalarFieldEnum[] | Prisma.EmployeeScalarFieldEnum;
    having?: Prisma.EmployeeScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EmployeeCountAggregateInputType | true;
    _min?: EmployeeMinAggregateInputType;
    _max?: EmployeeMaxAggregateInputType;
};
export type EmployeeGroupByOutputType = {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    phone: string;
    designation: string;
    profileImage: string;
    createdAt: Date;
    updatedAt: Date;
    departmentId: string;
    _count: EmployeeCountAggregateOutputType | null;
    _min: EmployeeMinAggregateOutputType | null;
    _max: EmployeeMaxAggregateOutputType | null;
};
export type GetEmployeeGroupByPayload<T extends EmployeeGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<EmployeeGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof EmployeeGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], EmployeeGroupByOutputType[P]> : Prisma.GetScalarType<T[P], EmployeeGroupByOutputType[P]>;
}>>;
export type EmployeeWhereInput = {
    AND?: Prisma.EmployeeWhereInput | Prisma.EmployeeWhereInput[];
    OR?: Prisma.EmployeeWhereInput[];
    NOT?: Prisma.EmployeeWhereInput | Prisma.EmployeeWhereInput[];
    id?: Prisma.StringFilter<"Employee"> | string;
    userId?: Prisma.StringFilter<"Employee"> | string;
    firstName?: Prisma.StringFilter<"Employee"> | string;
    lastName?: Prisma.StringFilter<"Employee"> | string;
    phone?: Prisma.StringFilter<"Employee"> | string;
    designation?: Prisma.StringFilter<"Employee"> | string;
    profileImage?: Prisma.StringFilter<"Employee"> | string;
    createdAt?: Prisma.DateTimeFilter<"Employee"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Employee"> | Date | string;
    departmentId?: Prisma.StringFilter<"Employee"> | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    department?: Prisma.XOR<Prisma.DepartmentScalarRelationFilter, Prisma.DepartmentWhereInput>;
};
export type EmployeeOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    designation?: Prisma.SortOrder;
    profileImage?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    departmentId?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    department?: Prisma.DepartmentOrderByWithRelationInput;
};
export type EmployeeWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    userId?: string;
    AND?: Prisma.EmployeeWhereInput | Prisma.EmployeeWhereInput[];
    OR?: Prisma.EmployeeWhereInput[];
    NOT?: Prisma.EmployeeWhereInput | Prisma.EmployeeWhereInput[];
    firstName?: Prisma.StringFilter<"Employee"> | string;
    lastName?: Prisma.StringFilter<"Employee"> | string;
    phone?: Prisma.StringFilter<"Employee"> | string;
    designation?: Prisma.StringFilter<"Employee"> | string;
    profileImage?: Prisma.StringFilter<"Employee"> | string;
    createdAt?: Prisma.DateTimeFilter<"Employee"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Employee"> | Date | string;
    departmentId?: Prisma.StringFilter<"Employee"> | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    department?: Prisma.XOR<Prisma.DepartmentScalarRelationFilter, Prisma.DepartmentWhereInput>;
}, "id" | "userId">;
export type EmployeeOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    designation?: Prisma.SortOrder;
    profileImage?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    departmentId?: Prisma.SortOrder;
    _count?: Prisma.EmployeeCountOrderByAggregateInput;
    _max?: Prisma.EmployeeMaxOrderByAggregateInput;
    _min?: Prisma.EmployeeMinOrderByAggregateInput;
};
export type EmployeeScalarWhereWithAggregatesInput = {
    AND?: Prisma.EmployeeScalarWhereWithAggregatesInput | Prisma.EmployeeScalarWhereWithAggregatesInput[];
    OR?: Prisma.EmployeeScalarWhereWithAggregatesInput[];
    NOT?: Prisma.EmployeeScalarWhereWithAggregatesInput | Prisma.EmployeeScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Employee"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"Employee"> | string;
    firstName?: Prisma.StringWithAggregatesFilter<"Employee"> | string;
    lastName?: Prisma.StringWithAggregatesFilter<"Employee"> | string;
    phone?: Prisma.StringWithAggregatesFilter<"Employee"> | string;
    designation?: Prisma.StringWithAggregatesFilter<"Employee"> | string;
    profileImage?: Prisma.StringWithAggregatesFilter<"Employee"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Employee"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Employee"> | Date | string;
    departmentId?: Prisma.StringWithAggregatesFilter<"Employee"> | string;
};
export type EmployeeCreateInput = {
    id?: string;
    firstName: string;
    lastName: string;
    phone: string;
    designation: string;
    profileImage: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutEmployeeInput;
    department: Prisma.DepartmentCreateNestedOneWithoutEmployeesInput;
};
export type EmployeeUncheckedCreateInput = {
    id?: string;
    userId: string;
    firstName: string;
    lastName: string;
    phone: string;
    designation: string;
    profileImage: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    departmentId: string;
};
export type EmployeeUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.StringFieldUpdateOperationsInput | string;
    designation?: Prisma.StringFieldUpdateOperationsInput | string;
    profileImage?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutEmployeeNestedInput;
    department?: Prisma.DepartmentUpdateOneRequiredWithoutEmployeesNestedInput;
};
export type EmployeeUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.StringFieldUpdateOperationsInput | string;
    designation?: Prisma.StringFieldUpdateOperationsInput | string;
    profileImage?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    departmentId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type EmployeeCreateManyInput = {
    id?: string;
    userId: string;
    firstName: string;
    lastName: string;
    phone: string;
    designation: string;
    profileImage: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    departmentId: string;
};
export type EmployeeUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.StringFieldUpdateOperationsInput | string;
    designation?: Prisma.StringFieldUpdateOperationsInput | string;
    profileImage?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EmployeeUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.StringFieldUpdateOperationsInput | string;
    designation?: Prisma.StringFieldUpdateOperationsInput | string;
    profileImage?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    departmentId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type EmployeeNullableScalarRelationFilter = {
    is?: Prisma.EmployeeWhereInput | null;
    isNot?: Prisma.EmployeeWhereInput | null;
};
export type EmployeeCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    designation?: Prisma.SortOrder;
    profileImage?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    departmentId?: Prisma.SortOrder;
};
export type EmployeeMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    designation?: Prisma.SortOrder;
    profileImage?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    departmentId?: Prisma.SortOrder;
};
export type EmployeeMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    designation?: Prisma.SortOrder;
    profileImage?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    departmentId?: Prisma.SortOrder;
};
export type EmployeeListRelationFilter = {
    every?: Prisma.EmployeeWhereInput;
    some?: Prisma.EmployeeWhereInput;
    none?: Prisma.EmployeeWhereInput;
};
export type EmployeeOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type EmployeeCreateNestedOneWithoutUserInput = {
    create?: Prisma.XOR<Prisma.EmployeeCreateWithoutUserInput, Prisma.EmployeeUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.EmployeeCreateOrConnectWithoutUserInput;
    connect?: Prisma.EmployeeWhereUniqueInput;
};
export type EmployeeUncheckedCreateNestedOneWithoutUserInput = {
    create?: Prisma.XOR<Prisma.EmployeeCreateWithoutUserInput, Prisma.EmployeeUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.EmployeeCreateOrConnectWithoutUserInput;
    connect?: Prisma.EmployeeWhereUniqueInput;
};
export type EmployeeUpdateOneWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.EmployeeCreateWithoutUserInput, Prisma.EmployeeUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.EmployeeCreateOrConnectWithoutUserInput;
    upsert?: Prisma.EmployeeUpsertWithoutUserInput;
    disconnect?: Prisma.EmployeeWhereInput | boolean;
    delete?: Prisma.EmployeeWhereInput | boolean;
    connect?: Prisma.EmployeeWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.EmployeeUpdateToOneWithWhereWithoutUserInput, Prisma.EmployeeUpdateWithoutUserInput>, Prisma.EmployeeUncheckedUpdateWithoutUserInput>;
};
export type EmployeeUncheckedUpdateOneWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.EmployeeCreateWithoutUserInput, Prisma.EmployeeUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.EmployeeCreateOrConnectWithoutUserInput;
    upsert?: Prisma.EmployeeUpsertWithoutUserInput;
    disconnect?: Prisma.EmployeeWhereInput | boolean;
    delete?: Prisma.EmployeeWhereInput | boolean;
    connect?: Prisma.EmployeeWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.EmployeeUpdateToOneWithWhereWithoutUserInput, Prisma.EmployeeUpdateWithoutUserInput>, Prisma.EmployeeUncheckedUpdateWithoutUserInput>;
};
export type EmployeeCreateNestedManyWithoutDepartmentInput = {
    create?: Prisma.XOR<Prisma.EmployeeCreateWithoutDepartmentInput, Prisma.EmployeeUncheckedCreateWithoutDepartmentInput> | Prisma.EmployeeCreateWithoutDepartmentInput[] | Prisma.EmployeeUncheckedCreateWithoutDepartmentInput[];
    connectOrCreate?: Prisma.EmployeeCreateOrConnectWithoutDepartmentInput | Prisma.EmployeeCreateOrConnectWithoutDepartmentInput[];
    createMany?: Prisma.EmployeeCreateManyDepartmentInputEnvelope;
    connect?: Prisma.EmployeeWhereUniqueInput | Prisma.EmployeeWhereUniqueInput[];
};
export type EmployeeUncheckedCreateNestedManyWithoutDepartmentInput = {
    create?: Prisma.XOR<Prisma.EmployeeCreateWithoutDepartmentInput, Prisma.EmployeeUncheckedCreateWithoutDepartmentInput> | Prisma.EmployeeCreateWithoutDepartmentInput[] | Prisma.EmployeeUncheckedCreateWithoutDepartmentInput[];
    connectOrCreate?: Prisma.EmployeeCreateOrConnectWithoutDepartmentInput | Prisma.EmployeeCreateOrConnectWithoutDepartmentInput[];
    createMany?: Prisma.EmployeeCreateManyDepartmentInputEnvelope;
    connect?: Prisma.EmployeeWhereUniqueInput | Prisma.EmployeeWhereUniqueInput[];
};
export type EmployeeUpdateManyWithoutDepartmentNestedInput = {
    create?: Prisma.XOR<Prisma.EmployeeCreateWithoutDepartmentInput, Prisma.EmployeeUncheckedCreateWithoutDepartmentInput> | Prisma.EmployeeCreateWithoutDepartmentInput[] | Prisma.EmployeeUncheckedCreateWithoutDepartmentInput[];
    connectOrCreate?: Prisma.EmployeeCreateOrConnectWithoutDepartmentInput | Prisma.EmployeeCreateOrConnectWithoutDepartmentInput[];
    upsert?: Prisma.EmployeeUpsertWithWhereUniqueWithoutDepartmentInput | Prisma.EmployeeUpsertWithWhereUniqueWithoutDepartmentInput[];
    createMany?: Prisma.EmployeeCreateManyDepartmentInputEnvelope;
    set?: Prisma.EmployeeWhereUniqueInput | Prisma.EmployeeWhereUniqueInput[];
    disconnect?: Prisma.EmployeeWhereUniqueInput | Prisma.EmployeeWhereUniqueInput[];
    delete?: Prisma.EmployeeWhereUniqueInput | Prisma.EmployeeWhereUniqueInput[];
    connect?: Prisma.EmployeeWhereUniqueInput | Prisma.EmployeeWhereUniqueInput[];
    update?: Prisma.EmployeeUpdateWithWhereUniqueWithoutDepartmentInput | Prisma.EmployeeUpdateWithWhereUniqueWithoutDepartmentInput[];
    updateMany?: Prisma.EmployeeUpdateManyWithWhereWithoutDepartmentInput | Prisma.EmployeeUpdateManyWithWhereWithoutDepartmentInput[];
    deleteMany?: Prisma.EmployeeScalarWhereInput | Prisma.EmployeeScalarWhereInput[];
};
export type EmployeeUncheckedUpdateManyWithoutDepartmentNestedInput = {
    create?: Prisma.XOR<Prisma.EmployeeCreateWithoutDepartmentInput, Prisma.EmployeeUncheckedCreateWithoutDepartmentInput> | Prisma.EmployeeCreateWithoutDepartmentInput[] | Prisma.EmployeeUncheckedCreateWithoutDepartmentInput[];
    connectOrCreate?: Prisma.EmployeeCreateOrConnectWithoutDepartmentInput | Prisma.EmployeeCreateOrConnectWithoutDepartmentInput[];
    upsert?: Prisma.EmployeeUpsertWithWhereUniqueWithoutDepartmentInput | Prisma.EmployeeUpsertWithWhereUniqueWithoutDepartmentInput[];
    createMany?: Prisma.EmployeeCreateManyDepartmentInputEnvelope;
    set?: Prisma.EmployeeWhereUniqueInput | Prisma.EmployeeWhereUniqueInput[];
    disconnect?: Prisma.EmployeeWhereUniqueInput | Prisma.EmployeeWhereUniqueInput[];
    delete?: Prisma.EmployeeWhereUniqueInput | Prisma.EmployeeWhereUniqueInput[];
    connect?: Prisma.EmployeeWhereUniqueInput | Prisma.EmployeeWhereUniqueInput[];
    update?: Prisma.EmployeeUpdateWithWhereUniqueWithoutDepartmentInput | Prisma.EmployeeUpdateWithWhereUniqueWithoutDepartmentInput[];
    updateMany?: Prisma.EmployeeUpdateManyWithWhereWithoutDepartmentInput | Prisma.EmployeeUpdateManyWithWhereWithoutDepartmentInput[];
    deleteMany?: Prisma.EmployeeScalarWhereInput | Prisma.EmployeeScalarWhereInput[];
};
export type EmployeeCreateWithoutUserInput = {
    id?: string;
    firstName: string;
    lastName: string;
    phone: string;
    designation: string;
    profileImage: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    department: Prisma.DepartmentCreateNestedOneWithoutEmployeesInput;
};
export type EmployeeUncheckedCreateWithoutUserInput = {
    id?: string;
    firstName: string;
    lastName: string;
    phone: string;
    designation: string;
    profileImage: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    departmentId: string;
};
export type EmployeeCreateOrConnectWithoutUserInput = {
    where: Prisma.EmployeeWhereUniqueInput;
    create: Prisma.XOR<Prisma.EmployeeCreateWithoutUserInput, Prisma.EmployeeUncheckedCreateWithoutUserInput>;
};
export type EmployeeUpsertWithoutUserInput = {
    update: Prisma.XOR<Prisma.EmployeeUpdateWithoutUserInput, Prisma.EmployeeUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.EmployeeCreateWithoutUserInput, Prisma.EmployeeUncheckedCreateWithoutUserInput>;
    where?: Prisma.EmployeeWhereInput;
};
export type EmployeeUpdateToOneWithWhereWithoutUserInput = {
    where?: Prisma.EmployeeWhereInput;
    data: Prisma.XOR<Prisma.EmployeeUpdateWithoutUserInput, Prisma.EmployeeUncheckedUpdateWithoutUserInput>;
};
export type EmployeeUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.StringFieldUpdateOperationsInput | string;
    designation?: Prisma.StringFieldUpdateOperationsInput | string;
    profileImage?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    department?: Prisma.DepartmentUpdateOneRequiredWithoutEmployeesNestedInput;
};
export type EmployeeUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.StringFieldUpdateOperationsInput | string;
    designation?: Prisma.StringFieldUpdateOperationsInput | string;
    profileImage?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    departmentId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type EmployeeCreateWithoutDepartmentInput = {
    id?: string;
    firstName: string;
    lastName: string;
    phone: string;
    designation: string;
    profileImage: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutEmployeeInput;
};
export type EmployeeUncheckedCreateWithoutDepartmentInput = {
    id?: string;
    userId: string;
    firstName: string;
    lastName: string;
    phone: string;
    designation: string;
    profileImage: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type EmployeeCreateOrConnectWithoutDepartmentInput = {
    where: Prisma.EmployeeWhereUniqueInput;
    create: Prisma.XOR<Prisma.EmployeeCreateWithoutDepartmentInput, Prisma.EmployeeUncheckedCreateWithoutDepartmentInput>;
};
export type EmployeeCreateManyDepartmentInputEnvelope = {
    data: Prisma.EmployeeCreateManyDepartmentInput | Prisma.EmployeeCreateManyDepartmentInput[];
    skipDuplicates?: boolean;
};
export type EmployeeUpsertWithWhereUniqueWithoutDepartmentInput = {
    where: Prisma.EmployeeWhereUniqueInput;
    update: Prisma.XOR<Prisma.EmployeeUpdateWithoutDepartmentInput, Prisma.EmployeeUncheckedUpdateWithoutDepartmentInput>;
    create: Prisma.XOR<Prisma.EmployeeCreateWithoutDepartmentInput, Prisma.EmployeeUncheckedCreateWithoutDepartmentInput>;
};
export type EmployeeUpdateWithWhereUniqueWithoutDepartmentInput = {
    where: Prisma.EmployeeWhereUniqueInput;
    data: Prisma.XOR<Prisma.EmployeeUpdateWithoutDepartmentInput, Prisma.EmployeeUncheckedUpdateWithoutDepartmentInput>;
};
export type EmployeeUpdateManyWithWhereWithoutDepartmentInput = {
    where: Prisma.EmployeeScalarWhereInput;
    data: Prisma.XOR<Prisma.EmployeeUpdateManyMutationInput, Prisma.EmployeeUncheckedUpdateManyWithoutDepartmentInput>;
};
export type EmployeeScalarWhereInput = {
    AND?: Prisma.EmployeeScalarWhereInput | Prisma.EmployeeScalarWhereInput[];
    OR?: Prisma.EmployeeScalarWhereInput[];
    NOT?: Prisma.EmployeeScalarWhereInput | Prisma.EmployeeScalarWhereInput[];
    id?: Prisma.StringFilter<"Employee"> | string;
    userId?: Prisma.StringFilter<"Employee"> | string;
    firstName?: Prisma.StringFilter<"Employee"> | string;
    lastName?: Prisma.StringFilter<"Employee"> | string;
    phone?: Prisma.StringFilter<"Employee"> | string;
    designation?: Prisma.StringFilter<"Employee"> | string;
    profileImage?: Prisma.StringFilter<"Employee"> | string;
    createdAt?: Prisma.DateTimeFilter<"Employee"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Employee"> | Date | string;
    departmentId?: Prisma.StringFilter<"Employee"> | string;
};
export type EmployeeCreateManyDepartmentInput = {
    id?: string;
    userId: string;
    firstName: string;
    lastName: string;
    phone: string;
    designation: string;
    profileImage: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type EmployeeUpdateWithoutDepartmentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.StringFieldUpdateOperationsInput | string;
    designation?: Prisma.StringFieldUpdateOperationsInput | string;
    profileImage?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutEmployeeNestedInput;
};
export type EmployeeUncheckedUpdateWithoutDepartmentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.StringFieldUpdateOperationsInput | string;
    designation?: Prisma.StringFieldUpdateOperationsInput | string;
    profileImage?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EmployeeUncheckedUpdateManyWithoutDepartmentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.StringFieldUpdateOperationsInput | string;
    designation?: Prisma.StringFieldUpdateOperationsInput | string;
    profileImage?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EmployeeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    phone?: boolean;
    designation?: boolean;
    profileImage?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    departmentId?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    department?: boolean | Prisma.DepartmentDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["employee"]>;
export type EmployeeSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    phone?: boolean;
    designation?: boolean;
    profileImage?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    departmentId?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    department?: boolean | Prisma.DepartmentDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["employee"]>;
export type EmployeeSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    phone?: boolean;
    designation?: boolean;
    profileImage?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    departmentId?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    department?: boolean | Prisma.DepartmentDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["employee"]>;
export type EmployeeSelectScalar = {
    id?: boolean;
    userId?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    phone?: boolean;
    designation?: boolean;
    profileImage?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    departmentId?: boolean;
};
export type EmployeeOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "firstName" | "lastName" | "phone" | "designation" | "profileImage" | "createdAt" | "updatedAt" | "departmentId", ExtArgs["result"]["employee"]>;
export type EmployeeInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    department?: boolean | Prisma.DepartmentDefaultArgs<ExtArgs>;
};
export type EmployeeIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    department?: boolean | Prisma.DepartmentDefaultArgs<ExtArgs>;
};
export type EmployeeIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    department?: boolean | Prisma.DepartmentDefaultArgs<ExtArgs>;
};
export type $EmployeePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Employee";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        department: Prisma.$DepartmentPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        firstName: string;
        lastName: string;
        phone: string;
        designation: string;
        profileImage: string;
        createdAt: Date;
        updatedAt: Date;
        departmentId: string;
    }, ExtArgs["result"]["employee"]>;
    composites: {};
};
export type EmployeeGetPayload<S extends boolean | null | undefined | EmployeeDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$EmployeePayload, S>;
export type EmployeeCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<EmployeeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: EmployeeCountAggregateInputType | true;
};
export interface EmployeeDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Employee'];
        meta: {
            name: 'Employee';
        };
    };
    findUnique<T extends EmployeeFindUniqueArgs>(args: Prisma.SelectSubset<T, EmployeeFindUniqueArgs<ExtArgs>>): Prisma.Prisma__EmployeeClient<runtime.Types.Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends EmployeeFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, EmployeeFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__EmployeeClient<runtime.Types.Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends EmployeeFindFirstArgs>(args?: Prisma.SelectSubset<T, EmployeeFindFirstArgs<ExtArgs>>): Prisma.Prisma__EmployeeClient<runtime.Types.Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends EmployeeFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, EmployeeFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__EmployeeClient<runtime.Types.Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends EmployeeFindManyArgs>(args?: Prisma.SelectSubset<T, EmployeeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends EmployeeCreateArgs>(args: Prisma.SelectSubset<T, EmployeeCreateArgs<ExtArgs>>): Prisma.Prisma__EmployeeClient<runtime.Types.Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends EmployeeCreateManyArgs>(args?: Prisma.SelectSubset<T, EmployeeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends EmployeeCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, EmployeeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends EmployeeDeleteArgs>(args: Prisma.SelectSubset<T, EmployeeDeleteArgs<ExtArgs>>): Prisma.Prisma__EmployeeClient<runtime.Types.Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends EmployeeUpdateArgs>(args: Prisma.SelectSubset<T, EmployeeUpdateArgs<ExtArgs>>): Prisma.Prisma__EmployeeClient<runtime.Types.Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends EmployeeDeleteManyArgs>(args?: Prisma.SelectSubset<T, EmployeeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends EmployeeUpdateManyArgs>(args: Prisma.SelectSubset<T, EmployeeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends EmployeeUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, EmployeeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends EmployeeUpsertArgs>(args: Prisma.SelectSubset<T, EmployeeUpsertArgs<ExtArgs>>): Prisma.Prisma__EmployeeClient<runtime.Types.Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends EmployeeCountArgs>(args?: Prisma.Subset<T, EmployeeCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], EmployeeCountAggregateOutputType> : number>;
    aggregate<T extends EmployeeAggregateArgs>(args: Prisma.Subset<T, EmployeeAggregateArgs>): Prisma.PrismaPromise<GetEmployeeAggregateType<T>>;
    groupBy<T extends EmployeeGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: EmployeeGroupByArgs['orderBy'];
    } : {
        orderBy?: EmployeeGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, EmployeeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEmployeeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: EmployeeFieldRefs;
}
export interface Prisma__EmployeeClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    department<T extends Prisma.DepartmentDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.DepartmentDefaultArgs<ExtArgs>>): Prisma.Prisma__DepartmentClient<runtime.Types.Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface EmployeeFieldRefs {
    readonly id: Prisma.FieldRef<"Employee", 'String'>;
    readonly userId: Prisma.FieldRef<"Employee", 'String'>;
    readonly firstName: Prisma.FieldRef<"Employee", 'String'>;
    readonly lastName: Prisma.FieldRef<"Employee", 'String'>;
    readonly phone: Prisma.FieldRef<"Employee", 'String'>;
    readonly designation: Prisma.FieldRef<"Employee", 'String'>;
    readonly profileImage: Prisma.FieldRef<"Employee", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Employee", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Employee", 'DateTime'>;
    readonly departmentId: Prisma.FieldRef<"Employee", 'String'>;
}
export type EmployeeFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmployeeSelect<ExtArgs> | null;
    omit?: Prisma.EmployeeOmit<ExtArgs> | null;
    include?: Prisma.EmployeeInclude<ExtArgs> | null;
    where: Prisma.EmployeeWhereUniqueInput;
};
export type EmployeeFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmployeeSelect<ExtArgs> | null;
    omit?: Prisma.EmployeeOmit<ExtArgs> | null;
    include?: Prisma.EmployeeInclude<ExtArgs> | null;
    where: Prisma.EmployeeWhereUniqueInput;
};
export type EmployeeFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmployeeSelect<ExtArgs> | null;
    omit?: Prisma.EmployeeOmit<ExtArgs> | null;
    include?: Prisma.EmployeeInclude<ExtArgs> | null;
    where?: Prisma.EmployeeWhereInput;
    orderBy?: Prisma.EmployeeOrderByWithRelationInput | Prisma.EmployeeOrderByWithRelationInput[];
    cursor?: Prisma.EmployeeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EmployeeScalarFieldEnum | Prisma.EmployeeScalarFieldEnum[];
};
export type EmployeeFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmployeeSelect<ExtArgs> | null;
    omit?: Prisma.EmployeeOmit<ExtArgs> | null;
    include?: Prisma.EmployeeInclude<ExtArgs> | null;
    where?: Prisma.EmployeeWhereInput;
    orderBy?: Prisma.EmployeeOrderByWithRelationInput | Prisma.EmployeeOrderByWithRelationInput[];
    cursor?: Prisma.EmployeeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EmployeeScalarFieldEnum | Prisma.EmployeeScalarFieldEnum[];
};
export type EmployeeFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmployeeSelect<ExtArgs> | null;
    omit?: Prisma.EmployeeOmit<ExtArgs> | null;
    include?: Prisma.EmployeeInclude<ExtArgs> | null;
    where?: Prisma.EmployeeWhereInput;
    orderBy?: Prisma.EmployeeOrderByWithRelationInput | Prisma.EmployeeOrderByWithRelationInput[];
    cursor?: Prisma.EmployeeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EmployeeScalarFieldEnum | Prisma.EmployeeScalarFieldEnum[];
};
export type EmployeeCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmployeeSelect<ExtArgs> | null;
    omit?: Prisma.EmployeeOmit<ExtArgs> | null;
    include?: Prisma.EmployeeInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EmployeeCreateInput, Prisma.EmployeeUncheckedCreateInput>;
};
export type EmployeeCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.EmployeeCreateManyInput | Prisma.EmployeeCreateManyInput[];
    skipDuplicates?: boolean;
};
export type EmployeeCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmployeeSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EmployeeOmit<ExtArgs> | null;
    data: Prisma.EmployeeCreateManyInput | Prisma.EmployeeCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.EmployeeIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type EmployeeUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmployeeSelect<ExtArgs> | null;
    omit?: Prisma.EmployeeOmit<ExtArgs> | null;
    include?: Prisma.EmployeeInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EmployeeUpdateInput, Prisma.EmployeeUncheckedUpdateInput>;
    where: Prisma.EmployeeWhereUniqueInput;
};
export type EmployeeUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.EmployeeUpdateManyMutationInput, Prisma.EmployeeUncheckedUpdateManyInput>;
    where?: Prisma.EmployeeWhereInput;
    limit?: number;
};
export type EmployeeUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmployeeSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EmployeeOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EmployeeUpdateManyMutationInput, Prisma.EmployeeUncheckedUpdateManyInput>;
    where?: Prisma.EmployeeWhereInput;
    limit?: number;
    include?: Prisma.EmployeeIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type EmployeeUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmployeeSelect<ExtArgs> | null;
    omit?: Prisma.EmployeeOmit<ExtArgs> | null;
    include?: Prisma.EmployeeInclude<ExtArgs> | null;
    where: Prisma.EmployeeWhereUniqueInput;
    create: Prisma.XOR<Prisma.EmployeeCreateInput, Prisma.EmployeeUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.EmployeeUpdateInput, Prisma.EmployeeUncheckedUpdateInput>;
};
export type EmployeeDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmployeeSelect<ExtArgs> | null;
    omit?: Prisma.EmployeeOmit<ExtArgs> | null;
    include?: Prisma.EmployeeInclude<ExtArgs> | null;
    where: Prisma.EmployeeWhereUniqueInput;
};
export type EmployeeDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EmployeeWhereInput;
    limit?: number;
};
export type EmployeeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmployeeSelect<ExtArgs> | null;
    omit?: Prisma.EmployeeOmit<ExtArgs> | null;
    include?: Prisma.EmployeeInclude<ExtArgs> | null;
};
