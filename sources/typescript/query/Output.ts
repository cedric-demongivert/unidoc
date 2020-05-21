export interface Output<Type> {
  next (value : Type)
  error (error : Error)
  complete ()
}
