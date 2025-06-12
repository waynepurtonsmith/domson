import { load } from 'cheerio'
import type { Schema } from './schema'
import { traverse } from './traverse'

export const extract = <T>(
  contents: string,
  schema: Schema<T>,
): T => {
  const $ = load(contents)
  return traverse($.root(), schema)
}