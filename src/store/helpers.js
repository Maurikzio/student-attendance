export const getArrayFromCollection  = (collection) => {
  return collection.docs.map((doc) => {
    return {...doc.data(), id: doc.id}
  })
}