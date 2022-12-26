export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_ACCESS_URL
const BASE_URL_RAW = process.env.NEXT_PUBLIC_BASE_URL

export const BASE_URL = BASE_URL_RAW + ":3000/"
export const COMPANION_URL = process.env.NEXT_PUBLIC_COMPANION_URL
export const TUS_ENDPOINT = process.env.NEXT_PUBLIC_TUS_ENDPOINT


// allowed filetypes
export const ALLOWED_FILETYPES = ".fastq, .fastq.gz"

// miscellaneous for now
export const CHUNK_SIZE = 8000000