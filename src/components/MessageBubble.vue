<script setup lang="ts">
defineProps({
  message: Object,
});

const { user, userRoles } = useUser();
</script>

<template>
  <div className="py-1 flex items-center space-x-2">
    <div className="text-gray-100 w-4">
      <template
        v-if="
          user?.id === message?.user_id ||
          userRoles.some((role: string) => ['admin', 'moderator'].includes(role))
        "
      >
        <button @click="() => deleteMessage(message?.id)">
          <div class="i-carbon-trash-can h-5 w-5 text-dark-100" />
        </button>
      </template>
    </div>
    <div>
      <p className="text-blue-700 font-bold">{{ message?.author.username }}</p>
      <p className="text-white">{{ message?.message }}</p>
    </div>
  </div>
</template>
