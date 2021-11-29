import { ImageLoaderProps } from 'next/image'

const loader = ({ src, width, quality }: ImageLoaderProps): string => {
  return `${src}?w=${width}&q=${quality || 75}`
}

export default loader
