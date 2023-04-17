<script setup lang="ts">
const supabase = useSupabase()

useHead({
  title: 'MessengerX',
  meta: [
    { name: 'description', content: 'Chat message app' },
    {
      name: 'theme-color',
      content: computed(() =>
        isDark.value ? 'rgb(129, 140, 248) ' : '#ffffff',
      ),
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: computed(() =>
        preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg',
      ),
    },
  ],
})

const router = useRouter()

const { setUser, fetchUserRoles } = useUserStore()
// const { messageListener, userListener, channelListener } = useChatStore()

supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_OUT') {
    router.push('/')
  }
  else if (session?.user) {
    await setUser(session.user)
    await fetchUserRoles()
    router.push('/channels/1')
  }
})
</script>

<template>
  <RouterView />
  <notifications />
</template>
