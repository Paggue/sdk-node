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

interface AnyObject {
  [key: any]: AnyObject
}

type SimpleFn<Param, Return> = (a: Param) => Return
