<script setup>
const chatStore = useChatStore()
const { addChannel, deleteChannel } = chatStore
const { channelList, channelId } = toRefs(chatStore)

const userStore = useUserStore()
const { user, userRoles } = toRefs(userStore)

const supabase = useSupabase()

const newChannel = async () => {
  // eslint-disable-next-line no-alert
  const slug = prompt('Please enter your name')
  if (slug)
    addChannel(useSlugify(slug), user.value.id)
}

const signOut = async () => {
  await supabase.auth.signOut()
  router.push('/')
}
</script>

<template>
  <main class="main h-screen w-screen flex overflow-hidden">
    <!-- Sidebar -->
    <nav
      class="w-64 overflow-scroll bg-gray-900 text-gray-100"
      :style="{ maxWidth: '20%', minWidth: 150, maxHeight: '100vh' }"
    >
      <div class="p-2">
        <div class="p-2">
          <button
            class="w-full rounded bg-blue-900 px-4 py-2 text-white transition duration-150 hover:bg-blue-800"
            @click="() => newChannel()"
          >
            New Channel
          </button>
        </div>
        <hr class="m-2">
        <div class="flex flex-col p-2 space-y-2">
          <h6 class="text-xs">
            {{ user?.email }}
          </h6>
          <button
            class="w-full rounded bg-blue-900 px-4 py-2 text-white transition duration-150 hover:bg-blue-800"
            @click="signOut"
          >
            Log out
          </button>
        </div>
        <hr class="m-2">
        <h4 class="font-bold">
          Channels
        </h4>
        <ul class="channel-list">
          <SidebarItem
            v-for="channel in channelList"
            :key="channel.id"
            :channel="channel"
            :is-active-channel="channel?.id === channelId"
            :user="user"
            :user-roles="userRoles"
            @delete-channel="() => deleteChannel(channel.id)"
          />
        </ul>
      </div>
    </nav>

    <!-- Messages -->
    <div class="h-screen flex-1 bg-gray-800">
      <RouterView />
    </div>
  </main>
</template>
