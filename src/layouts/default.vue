<script setup>
import { addChannel, deleteChannel } from "~/composables/chat";

const { channels, activeChannelId } = useChat();

const { signOut, user, userRoles } = useUser();

const newChannel = async () => {
  const slug = prompt("Please enter your name");
  if (slug) {
    addChannel(useSlugify(slug), user.id);
  }
};
</script>

<template>
  <main class="main flex h-screen w-screen overflow-hidden">
    <!-- Sidebar -->
    <nav
      class="w-64 bg-gray-900 text-gray-100 overflow-scroll"
      :style="{ maxWidth: '20%', minWidth: 150, maxHeight: '100vh' }"
    >
      <div class="p-2">
        <div class="p-2">
          <button
            class="bg-blue-900 hover:bg-blue-800 text-white py-2 px-4 rounded w-full transition duration-150"
            @click="() => newChannel()"
          >
            New Channel
          </button>
        </div>
        <hr class="m-2" />
        <div class="p-2 flex flex-col space-y-2">
          <h6 class="text-xs">{{ user?.email }}</h6>
          <button
            class="bg-blue-900 hover:bg-blue-800 text-white py-2 px-4 rounded w-full transition duration-150"
            @click="signOut"
          >
            Log out
          </button>
        </div>
        <hr class="m-2" />
        <h4 class="font-bold">Channels</h4>
        <ul class="channel-list">
          <SidebarItem
            v-for="channel in channels"
            :key="channel.id"
            :channel="channel"
            :is-active-channel="channel?.id === activeChannelId"
            :user="user"
            :user-roles="userRoles"
            @delete-channel="() => deleteChannel(channel.id)"
          >
          </SidebarItem>
        </ul>
      </div>
    </nav>

    <!-- Messages -->
    <div class="flex-1 bg-gray-800 h-screen">
      <RouterView />
    </div>
  </main>
</template>
