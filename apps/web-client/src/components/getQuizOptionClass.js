export const getQuizOptionClass = ({ isCompleted, isSelected, isCorrect, isReady, idleClass }) => {
  if (isCompleted && isCorrect) {
    return 'border-green-500 bg-green-500/20 text-green-300';
  }

  if (isSelected && isCorrect && isReady) {
    return 'border-green-500 bg-green-500/20 text-green-300';
  }

  if (isSelected) {
    return 'border-red-500 bg-red-500/20 text-red-300';
  }

  return idleClass;
};
