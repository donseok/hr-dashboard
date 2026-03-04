export const CREATE_CYCLE_MUTATION = /* GraphQL */ `
  mutation CreateCycle($input: CreateCycleInput!) {
    createCycle(input: $input) {
      id
      name
      status
      startDate
      endDate
    }
  }
`;

export const SUBMIT_REVIEW_MUTATION = /* GraphQL */ `
  mutation SubmitReview($reviewId: ID!, $rating: String!, $comments: String) {
    submitReview(reviewId: $reviewId, rating: $rating, comments: $comments) {
      id
      rating
      submittedAt
    }
  }
`;

export const CALIBRATE_RATINGS_MUTATION = /* GraphQL */ `
  mutation CalibrateRatings($input: CalibrateRatingsInput!) {
    calibrateRatings(input: $input) {
      cycleId
      totalReviews
      completedReviews
      ratingDistribution {
        rating
        count
        percentage
      }
    }
  }
`;
