export const generateId = (last) => {
  // map return an array and here i use spread to transform array into individual numbers
  const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  return maxId + 1;
};