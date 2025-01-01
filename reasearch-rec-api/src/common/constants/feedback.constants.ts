export const FeedbackStatus = {
  PENDING: 'pending',
  USED: 'used',
  DISCARDED: 'discarded',
};

export const FeedbackStatusDescriptions = {
  [FeedbackStatus.PENDING]:
    'The feedback sample is awaiting annotation or processing.',
  [FeedbackStatus.USED]:
    'The feedback sample has been utilized in model retraining.',
  [FeedbackStatus.DISCARDED]:
    'The feedback sample has been deemed invalid or irrelevant.',
};
