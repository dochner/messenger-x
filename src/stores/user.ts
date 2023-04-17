import { acceptHMRUpdate, defineStore } from 'pinia'
import type { ID, User, UserRole } from '~/types'

export const useUserStore = defineStore('user', () => {
  const user = ref<Partial<User> | User | null>()
  const userRoles = ref<Partial<UserRole[]>>()

  const supabase = useSupabase()

  const fetchUser = async (userId: ID, reference: Ref<any> | CallableFunction) => {
    try {
      const { data } = await supabase.from('users').select('*').eq('id', userId)
      if (typeof reference === 'function')
        reference(data?.[0])
      else if (reference)
        reference.value = data?.[0]

      return data?.[0]
    }
    catch (error: string | any) {
      useNotify({
        title: 'Error',
        text: error,
        type: 'error',
      })
    }
  }

  const fetchUserRoles = async () => {
    try {
      const { data } = await supabase.from('user_roles').select('*')

      userRoles.value = data as UserRole[]
    }
    catch (error: string | any) {
      useNotify({
        title: 'Error',
        text: error,
        type: 'error',
      })
    }
  }

  const setUser = (payload: Partial<User>) => {
    user.value = payload
  }

  return {
    user,
    userRoles,
    setUser,
    fetchUser,
    fetchUserRoles,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore as any, import.meta.hot))
