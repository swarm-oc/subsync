import fs from 'fs'
import util from 'util'

export const readDir = util.promisify(fs.readdir)

export function isVideo(fileName: string): boolean {
  return /(.*)\.(avi|mkv|mp4)/.test(fileName)
}

export function isDirectory(filePath: string): boolean {
  const stat = fs.lstatSync(filePath)

  return stat.isDirectory()
}

export function flatten<T>(arr: T[] | T[][]): T[] {
  if (!arr.length) return []

  return (arr as T[]).reduce<T[]>((previous, item) => {
    if (!Array.isArray(item)) return [...previous, item]
    return [...previous, ...flatten(item)]
  }, [])
}
