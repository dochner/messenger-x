<script setup lang="ts">
const props = defineProps({
  id: String,
});
const { user } = useUser();
const router = useRouter();

const message = ref("");
const messagesEndRef: Ref<HTMLDivElement | null> = ref(null);

const { messages, channels, activeChannelId } = useChat({
  channelId: props.id,
});

watch(
  () => messages,
  () => {
    (messagesEndRef.value as HTMLDivElement)?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }
);

const handleSubmit = async () => {
  console.log("usereeeeeeeeeeeeeeeee ", user);
  await addMessage(message.value, props.id, user.id);
  message.value = "";
};

watchEffect(() => {
  if (!channels.value.some((channel) => channel?.id === Number(props.id))) {
    router.push("/channels/1");
  }
});

watchEffect(() => {
  activeChannelId.value = props.id;
});
</script>

<template>
  <div class="relative h-screen">
    <div class="Messages h-full pb-16">
      <div class="p-2 overflow-y-auto">
        <MessageBubble
          v-for="message in messages"
          :key="message.id"
          :message="message"
        />
        <div ref="messageEndRef" style="height: 0"></div>
      </div>
    </div>
    <div class="p-2 absolute bottom-0 left-0 w-full">
      <MessageInput :model-value="message" @submit="handleSubmit" />
    </div>
  </div>
</template>
