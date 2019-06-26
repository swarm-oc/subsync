import fs from 'fs'
import {readDir, isDirectory, isVideo, flatten} from './utils'

interface ICategorizedFiles {
  videos: string[]
  directories: string[]
}

export async function readLibrary(libraryPath: fs.PathLike): Promise<string[]> {
  const files = await readDir(libraryPath)

  const {videos, directories} = files.reduce<ICategorizedFiles>(categorizeFiles(libraryPath), {
    videos: [],
    directories: []
  })

  if (!directories.length) {
    return videos
  }

  const allFiles = flatten<string>(await Promise.all(directories.map(readLibrary)))

  return videos.concat(allFiles)
}

function categorizeFiles(libraryPath: fs.PathLike) {
  return (total: ICategorizedFiles, file: string) => {
    const filePath = `${libraryPath}/${file}`

    if (isVideo(file)) {
      total.videos.push(filePath)
      return total
    }

    if (isDirectory(filePath)) {
      total.directories.push(filePath)
      return total
    }

    return total
  }
}
