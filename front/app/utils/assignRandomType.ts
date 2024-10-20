export const assignRandomType = (movieId: number): string => {
  const types = ["Romance", "Comédie", "Horreur", "Science-fiction"];
  const storedTypes = JSON.parse(localStorage.getItem("movieTypes") || "{}");

  if (storedTypes[movieId]) {
    return storedTypes[movieId];
  }

  const randomIndex = Math.floor(Math.random() * types.length);
  const assignedType = types[randomIndex];
  storedTypes[movieId] = assignedType;
  localStorage.setItem("movieTypes", JSON.stringify(storedTypes));

  return assignedType;
};
