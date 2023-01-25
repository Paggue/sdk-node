type Primitives =
  | string
  | boolean
  | number
  | date
  | string[]
  | boolean[]
  | number[]
  | date[]

type Any = Primitives | AnyObject

type AnyObject = Record<string, Any> // eslint-disable-line

type SimpleFn<Param, Return> = (a: Param) => Return
