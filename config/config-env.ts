export const enviroment = {
  debug: process.env.NODE_ENV !== 'production',
  lab: process.env.NEXT_PUBLIC_LAB_ENV === 'lab',
}
