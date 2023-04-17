<script setup lang="ts">
import { useChatStore } from '~/stores/chat'

const props = defineProps({
  id: String,
})

const chatStore = useChatStore()
const userStore = useUserStore()

const { addMessage, fetchMessages, setChannelId } = chatStore
const { messageList, channelList } = toRefs(chatStore)

const { user } = toRefs(userStore)

const router = useRouter()

const message = ref('')
const messagesEndRef: Ref<HTMLDivElement | null> = ref(null)

watch(messageList, () => {
  messagesEndRef.value?.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  })
})

const handleSubmit = async () => {
  if (props.id && user.value?.id) {
    await addMessage(message.value, +props.id, user.value.id)
    message.value = ''
  }
}

watchEffect(() => {
  if (props?.id) {
    setChannelId(+props.id)
    fetchMessages(+props.id)
  }

  if (!channelList.value?.some(channel => (props.id && channel?.id) && channel.id === +props.id))
    router.push('/channels/1')
})
</script>

<template>
  <div class="relative h-screen">
    <div class="Messages h-full pb-16">
      <div
        v-if="messageList?.length"
        class="h-full overflow-y-auto p-2"
      >
        <MessageBubble
          v-for="msg in messageList"
          :key="msg?.id"
          :message="msg"
        />
        <div
          ref="messagesEndRef"
          style="height: 0"
        />
      </div>

      <div
        v-else
        class="p-20"
      >
        <p>
          No messages yet!
        </p>
        <p>Be the first to send an message here!</p>
      </div>
    </div>
    <div class="absolute bottom-0 left-0 w-full p-2">
      <MessageInput
        v-model="message"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>
