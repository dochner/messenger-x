<script setup>
const props = defineProps({
  channel: Object,
  isActiveChannel: Boolean,
  user: Object,
  userRoles: Object,
})

defineEmits(['deleteChannel'])

const checkPermission = computed(() => {
  return (
    props.channel?.id !== 1
    && (props.channel?.created_by === props.user?.id
      || props.userRoles?.includes('admin'))
  )
})
</script>

<template>
  <li class="flex items-center justify-between">
    <RouterLink
      :to="`/channels/${channel?.id}`"
      active-class="font-bold"
      class="flex items-center"
    >
      <div class="i-carbon-hashtag h-5 w-5" />
      {{ channel?.slug }}
    </RouterLink>
    <template v-if="checkPermission">
      <button @click="() => $emit('deleteChannel', channel.id)">
        <div class="i-carbon-trash-can h-5 w-5 text-red-400" />
      </button>
    </template>
  </li>
</template>
