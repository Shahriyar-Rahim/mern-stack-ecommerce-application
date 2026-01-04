import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../../utils/getBaseUrl";

const reviewsApi = createApi({
    reducerPath: "reviewsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/reviews`,
        credentials: "include",
    }),
    tagTypes: ["Reviews"],
    endpoints: (builder) => ({
        createReview: builder.mutation({
            query: (reviewData) => ({
                url: "/create-review",
                method: "POST",
                body: reviewData
            }),
            invalidatesTags: (result, error, id) => [{type: "Reviews", id }]
        }),
        getReviewsCount: builder.query({
            query: () => ({
                url: "/total-reviews",
                method: "GET",
            })
        }),
        getReviewbyUserId: builder.query({
            query: (userId) => ({
                url: `/${userId}`,
                method: "GET",
            }),
            providesTags: (result) => result ? [{type: "Reviews", id: result[0]?.email }] : []
        })
    })
})

export const { useCreateReviewMutation, useGetReviewsCountQuery, useGetReviewbyUserIdQuery } = reviewsApi;

export default reviewsApi;