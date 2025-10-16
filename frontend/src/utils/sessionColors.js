const colorSequence = [
  "bg-green-100",
  "bg-yellow-100",
  "bg-blue-100",
  "bg-orange-100",
  "bg-teal-100",
  "bg-purple-100",
  "bg-pink-100",
  "bg-indigo-100",
  "bg-gray-100",
];

export const getSessionColor = (index) => {
  return colorSequence[index % colorSequence.length];
};
