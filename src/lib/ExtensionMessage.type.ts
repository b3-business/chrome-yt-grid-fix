import * as z from "@zod/mini";

export const GetGridItemsPerRowMessage = z.object({
  type: z.literal("GET_GRID_ITEMS_PER_ROW"),
});
export type GetGridItemsPerRowMessage = z.infer<
  typeof GetGridItemsPerRowMessage
>;

export const GetGridItemsPerRowResponse = z.object({
  type: z.literal("GET_GRID_ITEMS_PER_ROW_RESPONSE"),
  value: z.number(),
});
export type GetGridItemsPerRowResponse = z.infer<
  typeof GetGridItemsPerRowResponse
>;

export const UpdateGridItemsPerRowMessage = z.object({
  type: z.literal("UPDATE_GRID_ITEMS_PER_ROW"),
  value: z.number(),
});
export type UpdateGridItemsPerRowMessage = z.infer<
  typeof UpdateGridItemsPerRowMessage
>;

export const UpdateGridItemsPerRowResponse = z.object({
  type: z.literal("UPDATE_GRID_ITEMS_PER_ROW_RESPONSE"),
});
export type UpdateGridItemsPerRowResponse = z.infer<
  typeof UpdateGridItemsPerRowResponse
>;

export const ExtensionMessage = z.union([
  GetGridItemsPerRowMessage,
  GetGridItemsPerRowResponse,
  UpdateGridItemsPerRowMessage,
]);

export type ExtensionMessage = z.infer<typeof ExtensionMessage>;
