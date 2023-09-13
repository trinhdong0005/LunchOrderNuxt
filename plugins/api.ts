export default defineNuxtPlugin(async (nuxtApp) => {
  const useApi = async (request: string, params: any) => {
    const token = localStorage.getItem('access-token')
    const config = useRuntimeConfig()
    const router = useRouter()
  
    const opts = {
      key: request,
      baseURL: config.public.baseURL,
      async onRequest({ options }: any) {
        options.headers = options.headers || {}
        if (token) {
          options.headers['Authorization'] = `Bearer ${token}`
        }
      },
      async onResponseError({ response }: any) {
        if (response.status === 401) {
          localStorage.removeItem("access-token");
          router.push('/')
        }
      },
      ...params
    }
  
    const { data, pending, error, execute } = await useFetch(request, opts)
  
    return {
      data, pending, error, execute
    }
  }

  nuxtApp.provide('useApi', useApi)
})
