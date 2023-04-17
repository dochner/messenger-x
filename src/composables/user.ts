const supabase = useSupabase()

const userLoaded = ref(false)
const user = ref(null)
const session = ref(null)
const userRoles = ref([])

const setUserLoaded = (value: boolean) => {
  userLoaded.value = value
}

const setUser = (value: any) => {
  user.value = value
}

const setSession = (value: any) => {
  session.value = value
}

const setUserRoles = (value: any) => {
  userRoles.value = value
}

export const useUser = () => {
  const router = useRouter()

  const signIn = async () => {
    await fetchUserRoles(userRoles =>
      setUserRoles(userRoles.map(userRole => userRole.role)),
    )
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error)
      router.push('/')
  }

  watchEffect(
    () => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
        setUserLoaded(!!session)
        if (session?.user)
          signIn()
      })

      const {
        data: { subscription: authListener },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        setSession(session)
        const currentUser = session?.user
        setUser(currentUser ?? null)
        setUserLoaded(!!currentUser)
        if (currentUser) {
          signIn()
          router.push('/channels/1')
        }
      })

      return () => {
        authListener.unsubscribe()
      }
    },
    { flush: 'pre' },
  )
  return {
    userLoaded,
    user,
    userRoles,
    signIn,
    signOut,
  }
}
