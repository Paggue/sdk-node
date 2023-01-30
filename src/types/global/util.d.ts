type Primitives =
  | string
  | boolean
  | number
  | Date
  | string[]
  | boolean[]
  | number[]
  | Date[]

type Any = Primitives | AnyObject

type AnyObject = Record<string, Any>

type SimpleFn<Param, Return> = (a: Param) => Return
