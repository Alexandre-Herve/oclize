export const isPast = (date: Date): boolean => {
  const now = new Date()
  return date <= now
}
