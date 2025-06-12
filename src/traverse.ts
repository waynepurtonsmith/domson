import type { Element, Schema } from './schema'

export const traverse = <T>(contents: Element, schema: Schema<T>): T => {
  if (Array.isArray(schema)) {
    if (schema.length !== 2 || typeof schema[0] !== 'string' || typeof schema[1] !== 'function') {
      throw new Error('Invalid schema for array, expected structure: [selector, callback]')
    }

    const [selector, callback] = schema

    const matchingElement = contents.find(selector)

    return matchingElement.map((i) => traverse(
      matchingElement.eq(i),
      callback(matchingElement.eq(i))
    )).get() as T
  }

  if (typeof schema === 'string') {
    return contents.find(schema).first().text().trim() as T
  }

  if (typeof schema === 'function') {
    return schema(contents)
  }

  const result = {} as T

  for (const key in schema) {
    result[key] = traverse(contents, schema[key])
  }

  return result
}