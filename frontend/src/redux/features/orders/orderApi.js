import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../../utils/getBaseUrl";

const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/orders`,
        credentials: "include",
    }),
    tagTypes: ["Orders"],
    endpoints: (builder) => ({
        getOrderbyEmail: builder.query({
            query: (email) => ({
                url: `/${email}`,
                method: "GET"
            }),
            providesTags: ["Orders"]
        }),

        // get order by id
        getOrderbyId: builder.query({
            query: (orderId) => ({
                url: `/order/${orderId}`,
                method: "GET"
            }),
            providesTags: ["Orders"]
        }),

        // get all orders
        getAllOrders: builder.query({
            query: () => ({
                url: "/",
                method: "GET"
            }),
            providesTags: ["Orders"]
        }),

        // update order status
        updateOrderStatus: builder.mutation({
            query: ({id, status}) => ({
                url: `/update-order-status/${id}`,
                method: "PATCH",
                body: {status}
            }),
            invalidatesTags: ["Orders"]
        }),

        // delete order by id
        deleteOrderById: builder.mutation({
            query: (id) => ({
                url: `/delete-order/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: (result, error, id) => [{type: "Orders", id }]
        }),
    }),
})

export const { useGetOrderbyEmailQuery, useGetOrderbyIdQuery, useGetAllOrdersQuery, useUpdateOrderStatusMutation, useDeleteOrderByIdMutation } = orderApi;

export default orderApi;