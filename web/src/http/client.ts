import Cookies from 'universal-cookie'

async function getHeaders(headers?: HeadersInit): Promise<HeadersInit> {
  const cookies = new Cookies()
  const token = cookies.get('in-orbit.token')

  if (token) {
    return { ...headers, Authorization: `Bearer ${token}` }
  }

  return headers ?? {}
}

export async function http<T>(path: string, options: RequestInit): Promise<T> {
  const headers = await getHeaders(options.headers)

  const resquest = new Request(path, {
    ...options,
    headers,
  })

  const response = await fetch(resquest)

  if (response.ok) {
    const data = await response.json()

    return data as T
  }

  return Promise.reject(response)
}

