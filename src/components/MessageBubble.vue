<script setup lang="ts">
const props = defineProps({
  message: Object,
})

const userStore = useUserStore()
const { user, userRoles } = toRefs(userStore)

const { deleteMessage } = useChatStore()

const hasPermission = computed(() => {
  return user.value?.id === props.message?.user_id || userRoles.value?.some(role => ['admin', 'moderator'].includes(role!.role))
})
</script>

<template>
  <div className="py-1 flex items-center space-x-2">
    <div className="text-gray-100 w-4">
      <template v-if="hasPermission">
        <button @click="() => deleteMessage(message?.id)">
          <div class="i-carbon-trash-can h-5 w-5 text-dark-100" />
        </button>
      </template>
    </div>
    <div>
      <p className="text-blue-700 font-bold">
        {{ message?.author?.username }}
      </p>
      <p className="text-white">
        {{ message?.message }}
      </p>
    </div>
  </div>
</template>
