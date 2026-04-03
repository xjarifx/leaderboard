import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model SessionQueue
 *
 */
export type SessionQueueModel = runtime.Types.Result.DefaultSelection<Prisma.$SessionQueuePayload>;
export type AggregateSessionQueue = {
    _count: SessionQueueCountAggregateOutputType | null;
    _avg: SessionQueueAvgAggregateOutputType | null;
    _sum: SessionQueueSumAggregateOutputType | null;
    _min: SessionQueueMinAggregateOutputType | null;
    _max: SessionQueueMaxAggregateOutputType | null;
};
export type SessionQueueAvgAggregateOutputType = {
    id: number | null;
    session_id: number | null;
    image_id: number | null;
    order_index: number | null;
};
export type SessionQueueSumAggregateOutputType = {
    id: number | null;
    session_id: number | null;
    image_id: number | null;
    order_index: number | null;
};
export type SessionQueueMinAggregateOutputType = {
    id: number | null;
    session_id: number | null;
    image_id: number | null;
    order_index: number | null;
};
export type SessionQueueMaxAggregateOutputType = {
    id: number | null;
    session_id: number | null;
    image_id: number | null;
    order_index: number | null;
};
export type SessionQueueCountAggregateOutputType = {
    id: number;
    session_id: number;
    image_id: number;
    order_index: number;
    _all: number;
};
export type SessionQueueAvgAggregateInputType = {
    id?: true;
    session_id?: true;
    image_id?: true;
    order_index?: true;
};
export type SessionQueueSumAggregateInputType = {
    id?: true;
    session_id?: true;
    image_id?: true;
    order_index?: true;
};
export type SessionQueueMinAggregateInputType = {
    id?: true;
    session_id?: true;
    image_id?: true;
    order_index?: true;
};
export type SessionQueueMaxAggregateInputType = {
    id?: true;
    session_id?: true;
    image_id?: true;
    order_index?: true;
};
export type SessionQueueCountAggregateInputType = {
    id?: true;
    session_id?: true;
    image_id?: true;
    order_index?: true;
    _all?: true;
};
export type SessionQueueAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which SessionQueue to aggregate.
     */
    where?: Prisma.SessionQueueWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SessionQueues to fetch.
     */
    orderBy?: Prisma.SessionQueueOrderByWithRelationInput | Prisma.SessionQueueOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.SessionQueueWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SessionQueues from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SessionQueues.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned SessionQueues
    **/
    _count?: true | SessionQueueCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: SessionQueueAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: SessionQueueSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: SessionQueueMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: SessionQueueMaxAggregateInputType;
};
export type GetSessionQueueAggregateType<T extends SessionQueueAggregateArgs> = {
    [P in keyof T & keyof AggregateSessionQueue]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSessionQueue[P]> : Prisma.GetScalarType<T[P], AggregateSessionQueue[P]>;
};
export type SessionQueueGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SessionQueueWhereInput;
    orderBy?: Prisma.SessionQueueOrderByWithAggregationInput | Prisma.SessionQueueOrderByWithAggregationInput[];
    by: Prisma.SessionQueueScalarFieldEnum[] | Prisma.SessionQueueScalarFieldEnum;
    having?: Prisma.SessionQueueScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SessionQueueCountAggregateInputType | true;
    _avg?: SessionQueueAvgAggregateInputType;
    _sum?: SessionQueueSumAggregateInputType;
    _min?: SessionQueueMinAggregateInputType;
    _max?: SessionQueueMaxAggregateInputType;
};
export type SessionQueueGroupByOutputType = {
    id: number;
    session_id: number;
    image_id: number;
    order_index: number;
    _count: SessionQueueCountAggregateOutputType | null;
    _avg: SessionQueueAvgAggregateOutputType | null;
    _sum: SessionQueueSumAggregateOutputType | null;
    _min: SessionQueueMinAggregateOutputType | null;
    _max: SessionQueueMaxAggregateOutputType | null;
};
export type GetSessionQueueGroupByPayload<T extends SessionQueueGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SessionQueueGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SessionQueueGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SessionQueueGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SessionQueueGroupByOutputType[P]>;
}>>;
export type SessionQueueWhereInput = {
    AND?: Prisma.SessionQueueWhereInput | Prisma.SessionQueueWhereInput[];
    OR?: Prisma.SessionQueueWhereInput[];
    NOT?: Prisma.SessionQueueWhereInput | Prisma.SessionQueueWhereInput[];
    id?: Prisma.IntFilter<"SessionQueue"> | number;
    session_id?: Prisma.IntFilter<"SessionQueue"> | number;
    image_id?: Prisma.IntFilter<"SessionQueue"> | number;
    order_index?: Prisma.IntFilter<"SessionQueue"> | number;
    session?: Prisma.XOR<Prisma.SessionScalarRelationFilter, Prisma.SessionWhereInput>;
    image?: Prisma.XOR<Prisma.ImageScalarRelationFilter, Prisma.ImageWhereInput>;
};
export type SessionQueueOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    session_id?: Prisma.SortOrder;
    image_id?: Prisma.SortOrder;
    order_index?: Prisma.SortOrder;
    session?: Prisma.SessionOrderByWithRelationInput;
    image?: Prisma.ImageOrderByWithRelationInput;
};
export type SessionQueueWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.SessionQueueWhereInput | Prisma.SessionQueueWhereInput[];
    OR?: Prisma.SessionQueueWhereInput[];
    NOT?: Prisma.SessionQueueWhereInput | Prisma.SessionQueueWhereInput[];
    session_id?: Prisma.IntFilter<"SessionQueue"> | number;
    image_id?: Prisma.IntFilter<"SessionQueue"> | number;
    order_index?: Prisma.IntFilter<"SessionQueue"> | number;
    session?: Prisma.XOR<Prisma.SessionScalarRelationFilter, Prisma.SessionWhereInput>;
    image?: Prisma.XOR<Prisma.ImageScalarRelationFilter, Prisma.ImageWhereInput>;
}, "id">;
export type SessionQueueOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    session_id?: Prisma.SortOrder;
    image_id?: Prisma.SortOrder;
    order_index?: Prisma.SortOrder;
    _count?: Prisma.SessionQueueCountOrderByAggregateInput;
    _avg?: Prisma.SessionQueueAvgOrderByAggregateInput;
    _max?: Prisma.SessionQueueMaxOrderByAggregateInput;
    _min?: Prisma.SessionQueueMinOrderByAggregateInput;
    _sum?: Prisma.SessionQueueSumOrderByAggregateInput;
};
export type SessionQueueScalarWhereWithAggregatesInput = {
    AND?: Prisma.SessionQueueScalarWhereWithAggregatesInput | Prisma.SessionQueueScalarWhereWithAggregatesInput[];
    OR?: Prisma.SessionQueueScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SessionQueueScalarWhereWithAggregatesInput | Prisma.SessionQueueScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"SessionQueue"> | number;
    session_id?: Prisma.IntWithAggregatesFilter<"SessionQueue"> | number;
    image_id?: Prisma.IntWithAggregatesFilter<"SessionQueue"> | number;
    order_index?: Prisma.IntWithAggregatesFilter<"SessionQueue"> | number;
};
export type SessionQueueCreateInput = {
    order_index: number;
    session: Prisma.SessionCreateNestedOneWithoutSession_queueInput;
    image: Prisma.ImageCreateNestedOneWithoutSession_queueInput;
};
export type SessionQueueUncheckedCreateInput = {
    id?: number;
    session_id: number;
    image_id: number;
    order_index: number;
};
export type SessionQueueUpdateInput = {
    order_index?: Prisma.IntFieldUpdateOperationsInput | number;
    session?: Prisma.SessionUpdateOneRequiredWithoutSession_queueNestedInput;
    image?: Prisma.ImageUpdateOneRequiredWithoutSession_queueNestedInput;
};
export type SessionQueueUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    session_id?: Prisma.IntFieldUpdateOperationsInput | number;
    image_id?: Prisma.IntFieldUpdateOperationsInput | number;
    order_index?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type SessionQueueCreateManyInput = {
    id?: number;
    session_id: number;
    image_id: number;
    order_index: number;
};
export type SessionQueueUpdateManyMutationInput = {
    order_index?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type SessionQueueUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    session_id?: Prisma.IntFieldUpdateOperationsInput | number;
    image_id?: Prisma.IntFieldUpdateOperationsInput | number;
    order_index?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type SessionQueueListRelationFilter = {
    every?: Prisma.SessionQueueWhereInput;
    some?: Prisma.SessionQueueWhereInput;
    none?: Prisma.SessionQueueWhereInput;
};
export type SessionQueueOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type SessionQueueCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    session_id?: Prisma.SortOrder;
    image_id?: Prisma.SortOrder;
    order_index?: Prisma.SortOrder;
};
export type SessionQueueAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    session_id?: Prisma.SortOrder;
    image_id?: Prisma.SortOrder;
    order_index?: Prisma.SortOrder;
};
export type SessionQueueMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    session_id?: Prisma.SortOrder;
    image_id?: Prisma.SortOrder;
    order_index?: Prisma.SortOrder;
};
export type SessionQueueMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    session_id?: Prisma.SortOrder;
    image_id?: Prisma.SortOrder;
    order_index?: Prisma.SortOrder;
};
export type SessionQueueSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    session_id?: Prisma.SortOrder;
    image_id?: Prisma.SortOrder;
    order_index?: Prisma.SortOrder;
};
export type SessionQueueCreateNestedManyWithoutImageInput = {
    create?: Prisma.XOR<Prisma.SessionQueueCreateWithoutImageInput, Prisma.SessionQueueUncheckedCreateWithoutImageInput> | Prisma.SessionQueueCreateWithoutImageInput[] | Prisma.SessionQueueUncheckedCreateWithoutImageInput[];
    connectOrCreate?: Prisma.SessionQueueCreateOrConnectWithoutImageInput | Prisma.SessionQueueCreateOrConnectWithoutImageInput[];
    createMany?: Prisma.SessionQueueCreateManyImageInputEnvelope;
    connect?: Prisma.SessionQueueWhereUniqueInput | Prisma.SessionQueueWhereUniqueInput[];
};
export type SessionQueueUncheckedCreateNestedManyWithoutImageInput = {
    create?: Prisma.XOR<Prisma.SessionQueueCreateWithoutImageInput, Prisma.SessionQueueUncheckedCreateWithoutImageInput> | Prisma.SessionQueueCreateWithoutImageInput[] | Prisma.SessionQueueUncheckedCreateWithoutImageInput[];
    connectOrCreate?: Prisma.SessionQueueCreateOrConnectWithoutImageInput | Prisma.SessionQueueCreateOrConnectWithoutImageInput[];
    createMany?: Prisma.SessionQueueCreateManyImageInputEnvelope;
    connect?: Prisma.SessionQueueWhereUniqueInput | Prisma.SessionQueueWhereUniqueInput[];
};
export type SessionQueueUpdateManyWithoutImageNestedInput = {
    create?: Prisma.XOR<Prisma.SessionQueueCreateWithoutImageInput, Prisma.SessionQueueUncheckedCreateWithoutImageInput> | Prisma.SessionQueueCreateWithoutImageInput[] | Prisma.SessionQueueUncheckedCreateWithoutImageInput[];
    connectOrCreate?: Prisma.SessionQueueCreateOrConnectWithoutImageInput | Prisma.SessionQueueCreateOrConnectWithoutImageInput[];
    upsert?: Prisma.SessionQueueUpsertWithWhereUniqueWithoutImageInput | Prisma.SessionQueueUpsertWithWhereUniqueWithoutImageInput[];
    createMany?: Prisma.SessionQueueCreateManyImageInputEnvelope;
    set?: Prisma.SessionQueueWhereUniqueInput | Prisma.SessionQueueWhereUniqueInput[];
    disconnect?: Prisma.SessionQueueWhereUniqueInput | Prisma.SessionQueueWhereUniqueInput[];
    delete?: Prisma.SessionQueueWhereUniqueInput | Prisma.SessionQueueWhereUniqueInput[];
    connect?: Prisma.SessionQueueWhereUniqueInput | Prisma.SessionQueueWhereUniqueInput[];
    update?: Prisma.SessionQueueUpdateWithWhereUniqueWithoutImageInput | Prisma.SessionQueueUpdateWithWhereUniqueWithoutImageInput[];
    updateMany?: Prisma.SessionQueueUpdateManyWithWhereWithoutImageInput | Prisma.SessionQueueUpdateManyWithWhereWithoutImageInput[];
    deleteMany?: Prisma.SessionQueueScalarWhereInput | Prisma.SessionQueueScalarWhereInput[];
};
export type SessionQueueUncheckedUpdateManyWithoutImageNestedInput = {
    create?: Prisma.XOR<Prisma.SessionQueueCreateWithoutImageInput, Prisma.SessionQueueUncheckedCreateWithoutImageInput> | Prisma.SessionQueueCreateWithoutImageInput[] | Prisma.SessionQueueUncheckedCreateWithoutImageInput[];
    connectOrCreate?: Prisma.SessionQueueCreateOrConnectWithoutImageInput | Prisma.SessionQueueCreateOrConnectWithoutImageInput[];
    upsert?: Prisma.SessionQueueUpsertWithWhereUniqueWithoutImageInput | Prisma.SessionQueueUpsertWithWhereUniqueWithoutImageInput[];
    createMany?: Prisma.SessionQueueCreateManyImageInputEnvelope;
    set?: Prisma.SessionQueueWhereUniqueInput | Prisma.SessionQueueWhereUniqueInput[];
    disconnect?: Prisma.SessionQueueWhereUniqueInput | Prisma.SessionQueueWhereUniqueInput[];
    delete?: Prisma.SessionQueueWhereUniqueInput | Prisma.SessionQueueWhereUniqueInput[];
    connect?: Prisma.SessionQueueWhereUniqueInput | Prisma.SessionQueueWhereUniqueInput[];
    update?: Prisma.SessionQueueUpdateWithWhereUniqueWithoutImageInput | Prisma.SessionQueueUpdateWithWhereUniqueWithoutImageInput[];
    updateMany?: Prisma.SessionQueueUpdateManyWithWhereWithoutImageInput | Prisma.SessionQueueUpdateManyWithWhereWithoutImageInput[];
    deleteMany?: Prisma.SessionQueueScalarWhereInput | Prisma.SessionQueueScalarWhereInput[];
};
export type SessionQueueCreateNestedManyWithoutSessionInput = {
    create?: Prisma.XOR<Prisma.SessionQueueCreateWithoutSessionInput, Prisma.SessionQueueUncheckedCreateWithoutSessionInput> | Prisma.SessionQueueCreateWithoutSessionInput[] | Prisma.SessionQueueUncheckedCreateWithoutSessionInput[];
    connectOrCreate?: Prisma.SessionQueueCreateOrConnectWithoutSessionInput | Prisma.SessionQueueCreateOrConnectWithoutSessionInput[];
    createMany?: Prisma.SessionQueueCreateManySessionInputEnvelope;
    connect?: Prisma.SessionQueueWhereUniqueInput | Prisma.SessionQueueWhereUniqueInput[];
};
export type SessionQueueUncheckedCreateNestedManyWithoutSessionInput = {
    create?: Prisma.XOR<Prisma.SessionQueueCreateWithoutSessionInput, Prisma.SessionQueueUncheckedCreateWithoutSessionInput> | Prisma.SessionQueueCreateWithoutSessionInput[] | Prisma.SessionQueueUncheckedCreateWithoutSessionInput[];
    connectOrCreate?: Prisma.SessionQueueCreateOrConnectWithoutSessionInput | Prisma.SessionQueueCreateOrConnectWithoutSessionInput[];
    createMany?: Prisma.SessionQueueCreateManySessionInputEnvelope;
    connect?: Prisma.SessionQueueWhereUniqueInput | Prisma.SessionQueueWhereUniqueInput[];
};
export type SessionQueueUpdateManyWithoutSessionNestedInput = {
    create?: Prisma.XOR<Prisma.SessionQueueCreateWithoutSessionInput, Prisma.SessionQueueUncheckedCreateWithoutSessionInput> | Prisma.SessionQueueCreateWithoutSessionInput[] | Prisma.SessionQueueUncheckedCreateWithoutSessionInput[];
    connectOrCreate?: Prisma.SessionQueueCreateOrConnectWithoutSessionInput | Prisma.SessionQueueCreateOrConnectWithoutSessionInput[];
    upsert?: Prisma.SessionQueueUpsertWithWhereUniqueWithoutSessionInput | Prisma.SessionQueueUpsertWithWhereUniqueWithoutSessionInput[];
    createMany?: Prisma.SessionQueueCreateManySessionInputEnvelope;
    set?: Prisma.SessionQueueWhereUniqueInput | Prisma.SessionQueueWhereUniqueInput[];
    disconnect?: Prisma.SessionQueueWhereUniqueInput | Prisma.SessionQueueWhereUniqueInput[];
    delete?: Prisma.SessionQueueWhereUniqueInput | Prisma.SessionQueueWhereUniqueInput[];
    connect?: Prisma.SessionQueueWhereUniqueInput | Prisma.SessionQueueWhereUniqueInput[];
    update?: Prisma.SessionQueueUpdateWithWhereUniqueWithoutSessionInput | Prisma.SessionQueueUpdateWithWhereUniqueWithoutSessionInput[];
    updateMany?: Prisma.SessionQueueUpdateManyWithWhereWithoutSessionInput | Prisma.SessionQueueUpdateManyWithWhereWithoutSessionInput[];
    deleteMany?: Prisma.SessionQueueScalarWhereInput | Prisma.SessionQueueScalarWhereInput[];
};
export type SessionQueueUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: Prisma.XOR<Prisma.SessionQueueCreateWithoutSessionInput, Prisma.SessionQueueUncheckedCreateWithoutSessionInput> | Prisma.SessionQueueCreateWithoutSessionInput[] | Prisma.SessionQueueUncheckedCreateWithoutSessionInput[];
    connectOrCreate?: Prisma.SessionQueueCreateOrConnectWithoutSessionInput | Prisma.SessionQueueCreateOrConnectWithoutSessionInput[];
    upsert?: Prisma.SessionQueueUpsertWithWhereUniqueWithoutSessionInput | Prisma.SessionQueueUpsertWithWhereUniqueWithoutSessionInput[];
    createMany?: Prisma.SessionQueueCreateManySessionInputEnvelope;
    set?: Prisma.SessionQueueWhereUniqueInput | Prisma.SessionQueueWhereUniqueInput[];
    disconnect?: Prisma.SessionQueueWhereUniqueInput | Prisma.SessionQueueWhereUniqueInput[];
    delete?: Prisma.SessionQueueWhereUniqueInput | Prisma.SessionQueueWhereUniqueInput[];
    connect?: Prisma.SessionQueueWhereUniqueInput | Prisma.SessionQueueWhereUniqueInput[];
    update?: Prisma.SessionQueueUpdateWithWhereUniqueWithoutSessionInput | Prisma.SessionQueueUpdateWithWhereUniqueWithoutSessionInput[];
    updateMany?: Prisma.SessionQueueUpdateManyWithWhereWithoutSessionInput | Prisma.SessionQueueUpdateManyWithWhereWithoutSessionInput[];
    deleteMany?: Prisma.SessionQueueScalarWhereInput | Prisma.SessionQueueScalarWhereInput[];
};
export type SessionQueueCreateWithoutImageInput = {
    order_index: number;
    session: Prisma.SessionCreateNestedOneWithoutSession_queueInput;
};
export type SessionQueueUncheckedCreateWithoutImageInput = {
    id?: number;
    session_id: number;
    order_index: number;
};
export type SessionQueueCreateOrConnectWithoutImageInput = {
    where: Prisma.SessionQueueWhereUniqueInput;
    create: Prisma.XOR<Prisma.SessionQueueCreateWithoutImageInput, Prisma.SessionQueueUncheckedCreateWithoutImageInput>;
};
export type SessionQueueCreateManyImageInputEnvelope = {
    data: Prisma.SessionQueueCreateManyImageInput | Prisma.SessionQueueCreateManyImageInput[];
    skipDuplicates?: boolean;
};
export type SessionQueueUpsertWithWhereUniqueWithoutImageInput = {
    where: Prisma.SessionQueueWhereUniqueInput;
    update: Prisma.XOR<Prisma.SessionQueueUpdateWithoutImageInput, Prisma.SessionQueueUncheckedUpdateWithoutImageInput>;
    create: Prisma.XOR<Prisma.SessionQueueCreateWithoutImageInput, Prisma.SessionQueueUncheckedCreateWithoutImageInput>;
};
export type SessionQueueUpdateWithWhereUniqueWithoutImageInput = {
    where: Prisma.SessionQueueWhereUniqueInput;
    data: Prisma.XOR<Prisma.SessionQueueUpdateWithoutImageInput, Prisma.SessionQueueUncheckedUpdateWithoutImageInput>;
};
export type SessionQueueUpdateManyWithWhereWithoutImageInput = {
    where: Prisma.SessionQueueScalarWhereInput;
    data: Prisma.XOR<Prisma.SessionQueueUpdateManyMutationInput, Prisma.SessionQueueUncheckedUpdateManyWithoutImageInput>;
};
export type SessionQueueScalarWhereInput = {
    AND?: Prisma.SessionQueueScalarWhereInput | Prisma.SessionQueueScalarWhereInput[];
    OR?: Prisma.SessionQueueScalarWhereInput[];
    NOT?: Prisma.SessionQueueScalarWhereInput | Prisma.SessionQueueScalarWhereInput[];
    id?: Prisma.IntFilter<"SessionQueue"> | number;
    session_id?: Prisma.IntFilter<"SessionQueue"> | number;
    image_id?: Prisma.IntFilter<"SessionQueue"> | number;
    order_index?: Prisma.IntFilter<"SessionQueue"> | number;
};
export type SessionQueueCreateWithoutSessionInput = {
    order_index: number;
    image: Prisma.ImageCreateNestedOneWithoutSession_queueInput;
};
export type SessionQueueUncheckedCreateWithoutSessionInput = {
    id?: number;
    image_id: number;
    order_index: number;
};
export type SessionQueueCreateOrConnectWithoutSessionInput = {
    where: Prisma.SessionQueueWhereUniqueInput;
    create: Prisma.XOR<Prisma.SessionQueueCreateWithoutSessionInput, Prisma.SessionQueueUncheckedCreateWithoutSessionInput>;
};
export type SessionQueueCreateManySessionInputEnvelope = {
    data: Prisma.SessionQueueCreateManySessionInput | Prisma.SessionQueueCreateManySessionInput[];
    skipDuplicates?: boolean;
};
export type SessionQueueUpsertWithWhereUniqueWithoutSessionInput = {
    where: Prisma.SessionQueueWhereUniqueInput;
    update: Prisma.XOR<Prisma.SessionQueueUpdateWithoutSessionInput, Prisma.SessionQueueUncheckedUpdateWithoutSessionInput>;
    create: Prisma.XOR<Prisma.SessionQueueCreateWithoutSessionInput, Prisma.SessionQueueUncheckedCreateWithoutSessionInput>;
};
export type SessionQueueUpdateWithWhereUniqueWithoutSessionInput = {
    where: Prisma.SessionQueueWhereUniqueInput;
    data: Prisma.XOR<Prisma.SessionQueueUpdateWithoutSessionInput, Prisma.SessionQueueUncheckedUpdateWithoutSessionInput>;
};
export type SessionQueueUpdateManyWithWhereWithoutSessionInput = {
    where: Prisma.SessionQueueScalarWhereInput;
    data: Prisma.XOR<Prisma.SessionQueueUpdateManyMutationInput, Prisma.SessionQueueUncheckedUpdateManyWithoutSessionInput>;
};
export type SessionQueueCreateManyImageInput = {
    id?: number;
    session_id: number;
    order_index: number;
};
export type SessionQueueUpdateWithoutImageInput = {
    order_index?: Prisma.IntFieldUpdateOperationsInput | number;
    session?: Prisma.SessionUpdateOneRequiredWithoutSession_queueNestedInput;
};
export type SessionQueueUncheckedUpdateWithoutImageInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    session_id?: Prisma.IntFieldUpdateOperationsInput | number;
    order_index?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type SessionQueueUncheckedUpdateManyWithoutImageInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    session_id?: Prisma.IntFieldUpdateOperationsInput | number;
    order_index?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type SessionQueueCreateManySessionInput = {
    id?: number;
    image_id: number;
    order_index: number;
};
export type SessionQueueUpdateWithoutSessionInput = {
    order_index?: Prisma.IntFieldUpdateOperationsInput | number;
    image?: Prisma.ImageUpdateOneRequiredWithoutSession_queueNestedInput;
};
export type SessionQueueUncheckedUpdateWithoutSessionInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    image_id?: Prisma.IntFieldUpdateOperationsInput | number;
    order_index?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type SessionQueueUncheckedUpdateManyWithoutSessionInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    image_id?: Prisma.IntFieldUpdateOperationsInput | number;
    order_index?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type SessionQueueSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    session_id?: boolean;
    image_id?: boolean;
    order_index?: boolean;
    session?: boolean | Prisma.SessionDefaultArgs<ExtArgs>;
    image?: boolean | Prisma.ImageDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["sessionQueue"]>;
export type SessionQueueSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    session_id?: boolean;
    image_id?: boolean;
    order_index?: boolean;
    session?: boolean | Prisma.SessionDefaultArgs<ExtArgs>;
    image?: boolean | Prisma.ImageDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["sessionQueue"]>;
export type SessionQueueSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    session_id?: boolean;
    image_id?: boolean;
    order_index?: boolean;
    session?: boolean | Prisma.SessionDefaultArgs<ExtArgs>;
    image?: boolean | Prisma.ImageDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["sessionQueue"]>;
export type SessionQueueSelectScalar = {
    id?: boolean;
    session_id?: boolean;
    image_id?: boolean;
    order_index?: boolean;
};
export type SessionQueueOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "session_id" | "image_id" | "order_index", ExtArgs["result"]["sessionQueue"]>;
export type SessionQueueInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    session?: boolean | Prisma.SessionDefaultArgs<ExtArgs>;
    image?: boolean | Prisma.ImageDefaultArgs<ExtArgs>;
};
export type SessionQueueIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    session?: boolean | Prisma.SessionDefaultArgs<ExtArgs>;
    image?: boolean | Prisma.ImageDefaultArgs<ExtArgs>;
};
export type SessionQueueIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    session?: boolean | Prisma.SessionDefaultArgs<ExtArgs>;
    image?: boolean | Prisma.ImageDefaultArgs<ExtArgs>;
};
export type $SessionQueuePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "SessionQueue";
    objects: {
        session: Prisma.$SessionPayload<ExtArgs>;
        image: Prisma.$ImagePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        session_id: number;
        image_id: number;
        order_index: number;
    }, ExtArgs["result"]["sessionQueue"]>;
    composites: {};
};
export type SessionQueueGetPayload<S extends boolean | null | undefined | SessionQueueDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SessionQueuePayload, S>;
export type SessionQueueCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SessionQueueFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SessionQueueCountAggregateInputType | true;
};
export interface SessionQueueDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['SessionQueue'];
        meta: {
            name: 'SessionQueue';
        };
    };
    /**
     * Find zero or one SessionQueue that matches the filter.
     * @param {SessionQueueFindUniqueArgs} args - Arguments to find a SessionQueue
     * @example
     * // Get one SessionQueue
     * const sessionQueue = await prisma.sessionQueue.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionQueueFindUniqueArgs>(args: Prisma.SelectSubset<T, SessionQueueFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SessionQueueClient<runtime.Types.Result.GetResult<Prisma.$SessionQueuePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one SessionQueue that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionQueueFindUniqueOrThrowArgs} args - Arguments to find a SessionQueue
     * @example
     * // Get one SessionQueue
     * const sessionQueue = await prisma.sessionQueue.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionQueueFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SessionQueueFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SessionQueueClient<runtime.Types.Result.GetResult<Prisma.$SessionQueuePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first SessionQueue that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionQueueFindFirstArgs} args - Arguments to find a SessionQueue
     * @example
     * // Get one SessionQueue
     * const sessionQueue = await prisma.sessionQueue.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionQueueFindFirstArgs>(args?: Prisma.SelectSubset<T, SessionQueueFindFirstArgs<ExtArgs>>): Prisma.Prisma__SessionQueueClient<runtime.Types.Result.GetResult<Prisma.$SessionQueuePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first SessionQueue that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionQueueFindFirstOrThrowArgs} args - Arguments to find a SessionQueue
     * @example
     * // Get one SessionQueue
     * const sessionQueue = await prisma.sessionQueue.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionQueueFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SessionQueueFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SessionQueueClient<runtime.Types.Result.GetResult<Prisma.$SessionQueuePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more SessionQueues that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionQueueFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SessionQueues
     * const sessionQueues = await prisma.sessionQueue.findMany()
     *
     * // Get first 10 SessionQueues
     * const sessionQueues = await prisma.sessionQueue.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const sessionQueueWithIdOnly = await prisma.sessionQueue.findMany({ select: { id: true } })
     *
     */
    findMany<T extends SessionQueueFindManyArgs>(args?: Prisma.SelectSubset<T, SessionQueueFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SessionQueuePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a SessionQueue.
     * @param {SessionQueueCreateArgs} args - Arguments to create a SessionQueue.
     * @example
     * // Create one SessionQueue
     * const SessionQueue = await prisma.sessionQueue.create({
     *   data: {
     *     // ... data to create a SessionQueue
     *   }
     * })
     *
     */
    create<T extends SessionQueueCreateArgs>(args: Prisma.SelectSubset<T, SessionQueueCreateArgs<ExtArgs>>): Prisma.Prisma__SessionQueueClient<runtime.Types.Result.GetResult<Prisma.$SessionQueuePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many SessionQueues.
     * @param {SessionQueueCreateManyArgs} args - Arguments to create many SessionQueues.
     * @example
     * // Create many SessionQueues
     * const sessionQueue = await prisma.sessionQueue.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends SessionQueueCreateManyArgs>(args?: Prisma.SelectSubset<T, SessionQueueCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many SessionQueues and returns the data saved in the database.
     * @param {SessionQueueCreateManyAndReturnArgs} args - Arguments to create many SessionQueues.
     * @example
     * // Create many SessionQueues
     * const sessionQueue = await prisma.sessionQueue.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many SessionQueues and only return the `id`
     * const sessionQueueWithIdOnly = await prisma.sessionQueue.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends SessionQueueCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SessionQueueCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SessionQueuePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a SessionQueue.
     * @param {SessionQueueDeleteArgs} args - Arguments to delete one SessionQueue.
     * @example
     * // Delete one SessionQueue
     * const SessionQueue = await prisma.sessionQueue.delete({
     *   where: {
     *     // ... filter to delete one SessionQueue
     *   }
     * })
     *
     */
    delete<T extends SessionQueueDeleteArgs>(args: Prisma.SelectSubset<T, SessionQueueDeleteArgs<ExtArgs>>): Prisma.Prisma__SessionQueueClient<runtime.Types.Result.GetResult<Prisma.$SessionQueuePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one SessionQueue.
     * @param {SessionQueueUpdateArgs} args - Arguments to update one SessionQueue.
     * @example
     * // Update one SessionQueue
     * const sessionQueue = await prisma.sessionQueue.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends SessionQueueUpdateArgs>(args: Prisma.SelectSubset<T, SessionQueueUpdateArgs<ExtArgs>>): Prisma.Prisma__SessionQueueClient<runtime.Types.Result.GetResult<Prisma.$SessionQueuePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more SessionQueues.
     * @param {SessionQueueDeleteManyArgs} args - Arguments to filter SessionQueues to delete.
     * @example
     * // Delete a few SessionQueues
     * const { count } = await prisma.sessionQueue.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends SessionQueueDeleteManyArgs>(args?: Prisma.SelectSubset<T, SessionQueueDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more SessionQueues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionQueueUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SessionQueues
     * const sessionQueue = await prisma.sessionQueue.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends SessionQueueUpdateManyArgs>(args: Prisma.SelectSubset<T, SessionQueueUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more SessionQueues and returns the data updated in the database.
     * @param {SessionQueueUpdateManyAndReturnArgs} args - Arguments to update many SessionQueues.
     * @example
     * // Update many SessionQueues
     * const sessionQueue = await prisma.sessionQueue.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more SessionQueues and only return the `id`
     * const sessionQueueWithIdOnly = await prisma.sessionQueue.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends SessionQueueUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SessionQueueUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SessionQueuePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one SessionQueue.
     * @param {SessionQueueUpsertArgs} args - Arguments to update or create a SessionQueue.
     * @example
     * // Update or create a SessionQueue
     * const sessionQueue = await prisma.sessionQueue.upsert({
     *   create: {
     *     // ... data to create a SessionQueue
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SessionQueue we want to update
     *   }
     * })
     */
    upsert<T extends SessionQueueUpsertArgs>(args: Prisma.SelectSubset<T, SessionQueueUpsertArgs<ExtArgs>>): Prisma.Prisma__SessionQueueClient<runtime.Types.Result.GetResult<Prisma.$SessionQueuePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of SessionQueues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionQueueCountArgs} args - Arguments to filter SessionQueues to count.
     * @example
     * // Count the number of SessionQueues
     * const count = await prisma.sessionQueue.count({
     *   where: {
     *     // ... the filter for the SessionQueues we want to count
     *   }
     * })
    **/
    count<T extends SessionQueueCountArgs>(args?: Prisma.Subset<T, SessionQueueCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SessionQueueCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a SessionQueue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionQueueAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionQueueAggregateArgs>(args: Prisma.Subset<T, SessionQueueAggregateArgs>): Prisma.PrismaPromise<GetSessionQueueAggregateType<T>>;
    /**
     * Group by SessionQueue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionQueueGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends SessionQueueGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SessionQueueGroupByArgs['orderBy'];
    } : {
        orderBy?: SessionQueueGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SessionQueueGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionQueueGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the SessionQueue model
     */
    readonly fields: SessionQueueFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for SessionQueue.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__SessionQueueClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    session<T extends Prisma.SessionDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SessionDefaultArgs<ExtArgs>>): Prisma.Prisma__SessionClient<runtime.Types.Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    image<T extends Prisma.ImageDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ImageDefaultArgs<ExtArgs>>): Prisma.Prisma__ImageClient<runtime.Types.Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the SessionQueue model
 */
export interface SessionQueueFieldRefs {
    readonly id: Prisma.FieldRef<"SessionQueue", 'Int'>;
    readonly session_id: Prisma.FieldRef<"SessionQueue", 'Int'>;
    readonly image_id: Prisma.FieldRef<"SessionQueue", 'Int'>;
    readonly order_index: Prisma.FieldRef<"SessionQueue", 'Int'>;
}
/**
 * SessionQueue findUnique
 */
export type SessionQueueFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionQueue
     */
    select?: Prisma.SessionQueueSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SessionQueue
     */
    omit?: Prisma.SessionQueueOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SessionQueueInclude<ExtArgs> | null;
    /**
     * Filter, which SessionQueue to fetch.
     */
    where: Prisma.SessionQueueWhereUniqueInput;
};
/**
 * SessionQueue findUniqueOrThrow
 */
export type SessionQueueFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionQueue
     */
    select?: Prisma.SessionQueueSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SessionQueue
     */
    omit?: Prisma.SessionQueueOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SessionQueueInclude<ExtArgs> | null;
    /**
     * Filter, which SessionQueue to fetch.
     */
    where: Prisma.SessionQueueWhereUniqueInput;
};
/**
 * SessionQueue findFirst
 */
export type SessionQueueFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionQueue
     */
    select?: Prisma.SessionQueueSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SessionQueue
     */
    omit?: Prisma.SessionQueueOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SessionQueueInclude<ExtArgs> | null;
    /**
     * Filter, which SessionQueue to fetch.
     */
    where?: Prisma.SessionQueueWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SessionQueues to fetch.
     */
    orderBy?: Prisma.SessionQueueOrderByWithRelationInput | Prisma.SessionQueueOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for SessionQueues.
     */
    cursor?: Prisma.SessionQueueWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SessionQueues from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SessionQueues.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SessionQueues.
     */
    distinct?: Prisma.SessionQueueScalarFieldEnum | Prisma.SessionQueueScalarFieldEnum[];
};
/**
 * SessionQueue findFirstOrThrow
 */
export type SessionQueueFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionQueue
     */
    select?: Prisma.SessionQueueSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SessionQueue
     */
    omit?: Prisma.SessionQueueOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SessionQueueInclude<ExtArgs> | null;
    /**
     * Filter, which SessionQueue to fetch.
     */
    where?: Prisma.SessionQueueWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SessionQueues to fetch.
     */
    orderBy?: Prisma.SessionQueueOrderByWithRelationInput | Prisma.SessionQueueOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for SessionQueues.
     */
    cursor?: Prisma.SessionQueueWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SessionQueues from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SessionQueues.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SessionQueues.
     */
    distinct?: Prisma.SessionQueueScalarFieldEnum | Prisma.SessionQueueScalarFieldEnum[];
};
/**
 * SessionQueue findMany
 */
export type SessionQueueFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionQueue
     */
    select?: Prisma.SessionQueueSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SessionQueue
     */
    omit?: Prisma.SessionQueueOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SessionQueueInclude<ExtArgs> | null;
    /**
     * Filter, which SessionQueues to fetch.
     */
    where?: Prisma.SessionQueueWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SessionQueues to fetch.
     */
    orderBy?: Prisma.SessionQueueOrderByWithRelationInput | Prisma.SessionQueueOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing SessionQueues.
     */
    cursor?: Prisma.SessionQueueWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SessionQueues from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SessionQueues.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SessionQueues.
     */
    distinct?: Prisma.SessionQueueScalarFieldEnum | Prisma.SessionQueueScalarFieldEnum[];
};
/**
 * SessionQueue create
 */
export type SessionQueueCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionQueue
     */
    select?: Prisma.SessionQueueSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SessionQueue
     */
    omit?: Prisma.SessionQueueOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SessionQueueInclude<ExtArgs> | null;
    /**
     * The data needed to create a SessionQueue.
     */
    data: Prisma.XOR<Prisma.SessionQueueCreateInput, Prisma.SessionQueueUncheckedCreateInput>;
};
/**
 * SessionQueue createMany
 */
export type SessionQueueCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many SessionQueues.
     */
    data: Prisma.SessionQueueCreateManyInput | Prisma.SessionQueueCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * SessionQueue createManyAndReturn
 */
export type SessionQueueCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionQueue
     */
    select?: Prisma.SessionQueueSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the SessionQueue
     */
    omit?: Prisma.SessionQueueOmit<ExtArgs> | null;
    /**
     * The data used to create many SessionQueues.
     */
    data: Prisma.SessionQueueCreateManyInput | Prisma.SessionQueueCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SessionQueueIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * SessionQueue update
 */
export type SessionQueueUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionQueue
     */
    select?: Prisma.SessionQueueSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SessionQueue
     */
    omit?: Prisma.SessionQueueOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SessionQueueInclude<ExtArgs> | null;
    /**
     * The data needed to update a SessionQueue.
     */
    data: Prisma.XOR<Prisma.SessionQueueUpdateInput, Prisma.SessionQueueUncheckedUpdateInput>;
    /**
     * Choose, which SessionQueue to update.
     */
    where: Prisma.SessionQueueWhereUniqueInput;
};
/**
 * SessionQueue updateMany
 */
export type SessionQueueUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update SessionQueues.
     */
    data: Prisma.XOR<Prisma.SessionQueueUpdateManyMutationInput, Prisma.SessionQueueUncheckedUpdateManyInput>;
    /**
     * Filter which SessionQueues to update
     */
    where?: Prisma.SessionQueueWhereInput;
    /**
     * Limit how many SessionQueues to update.
     */
    limit?: number;
};
/**
 * SessionQueue updateManyAndReturn
 */
export type SessionQueueUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionQueue
     */
    select?: Prisma.SessionQueueSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the SessionQueue
     */
    omit?: Prisma.SessionQueueOmit<ExtArgs> | null;
    /**
     * The data used to update SessionQueues.
     */
    data: Prisma.XOR<Prisma.SessionQueueUpdateManyMutationInput, Prisma.SessionQueueUncheckedUpdateManyInput>;
    /**
     * Filter which SessionQueues to update
     */
    where?: Prisma.SessionQueueWhereInput;
    /**
     * Limit how many SessionQueues to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SessionQueueIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * SessionQueue upsert
 */
export type SessionQueueUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionQueue
     */
    select?: Prisma.SessionQueueSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SessionQueue
     */
    omit?: Prisma.SessionQueueOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SessionQueueInclude<ExtArgs> | null;
    /**
     * The filter to search for the SessionQueue to update in case it exists.
     */
    where: Prisma.SessionQueueWhereUniqueInput;
    /**
     * In case the SessionQueue found by the `where` argument doesn't exist, create a new SessionQueue with this data.
     */
    create: Prisma.XOR<Prisma.SessionQueueCreateInput, Prisma.SessionQueueUncheckedCreateInput>;
    /**
     * In case the SessionQueue was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.SessionQueueUpdateInput, Prisma.SessionQueueUncheckedUpdateInput>;
};
/**
 * SessionQueue delete
 */
export type SessionQueueDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionQueue
     */
    select?: Prisma.SessionQueueSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SessionQueue
     */
    omit?: Prisma.SessionQueueOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SessionQueueInclude<ExtArgs> | null;
    /**
     * Filter which SessionQueue to delete.
     */
    where: Prisma.SessionQueueWhereUniqueInput;
};
/**
 * SessionQueue deleteMany
 */
export type SessionQueueDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which SessionQueues to delete
     */
    where?: Prisma.SessionQueueWhereInput;
    /**
     * Limit how many SessionQueues to delete.
     */
    limit?: number;
};
/**
 * SessionQueue without action
 */
export type SessionQueueDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionQueue
     */
    select?: Prisma.SessionQueueSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SessionQueue
     */
    omit?: Prisma.SessionQueueOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SessionQueueInclude<ExtArgs> | null;
};
