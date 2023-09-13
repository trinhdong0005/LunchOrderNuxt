export default defineNuxtRouteMiddleware((to, from) => {
  const token = localStorage.getItem('access-token')
  const router = useRouter()
  if (!token) {
    router.push('/')
  }
})