const supabase = useSupabase()

const channels = ref([])
const messages = ref([])
const users = ref(new Map())
const activeChannelId = ref()

const newMessage = ref()
const newChannel = ref()
const newOrUpdatedUser = ref()
const deletedChannel = ref()
const deletedMessage = ref()

export const fetchChannels = async (reference: Ref<any> | CallableFunction) => {
  try {
    const { data } = await supabase.from('channels').select('*')
    if (typeof reference === 'function')
      reference(data)
    else if (reference)
      reference.value = data

    return data
  }
  catch (error: string | any) {
    useNotify({
      title: 'Error',
      text: error,
      type: 'error',
    })
  }
}

export const fetchUser = async (
  userId: string,
  reference: Ref<any> | CallableFunction,
) => {
  try {
    const { data } = await supabase.from('users').select('*').eq('id', userId)
    const user = data?.[0]
    if (typeof reference === 'function')
      reference(data)
    else if (reference)
      reference.value = data

    return user
  }
  catch (error: string | any) {
    useNotify({
      title: 'Error',
      text: error,
      type: 'error',
    })
  }
}

export const fetchUserRoles = async (
  reference: Ref<any> | CallableFunction,
) => {
  try {
    const { data } = await supabase.from('user_roles').select('*')
    if (typeof reference === 'function')
      reference(data)
    else if (reference)
      reference.value = data

    return data
  }
  catch (error: string | any) {
    useNotify({
      title: 'Error',
      text: error,
      type: 'error',
    })
  }
}

export const fetchMessages = async (
  channelId: number,
  reference: Ref<any> | CallableFunction,
) => {
  try {
    const { data } = await supabase
      .from('messages')
      .select('*, author:user_id(*)')
      .eq('channel_id', channelId)
      .order('inserted_at', { ascending: true })

    if (typeof reference === 'function')
      reference(data)
    else if (reference)
      reference.value = data

    return data
  }
  catch (error: string | any) {
    useNotify({
      title: 'Error',
      text: error,
      type: 'error',
    })
  }
}

export const addChannel = async (slug: string, user_id: string) => {
  try {
    const { data } = await supabase
      .from('channels')
      .insert([{ slug, created_by: user_id }])
      .select()
    return data
  }
  catch (error: string | any) {
    useNotify({
      title: 'Error',
      text: error,
      type: 'error',
    })
  }
}

export const addMessage = async (
  message: string,
  channel_id?: string,
  user_id?: string,
) => {
  try {
    const { data } = await supabase
      .from('messages')
      .insert([{ message, channel_id, user_id }])
      .select()
    return data
  }
  catch (error: string | any) {
    useNotify({
      title: 'Error',
      text: error,
      type: 'error',
    })
  }
}

export const deleteChannel = async (channel_id: string) => {
  try {
    const { data } = await supabase
      .from('channels')
      .delete()
      .match({ id: channel_id })
    return data
  }
  catch (error: string | any) {
    useNotify({
      title: 'Error',
      text: error,
      type: 'error',
    })
  }
}

export const deleteMessage = async (message_id: string) => {
  try {
    const { data } = await supabase
      .from('messages')
      .delete()
      .match({ id: message_id })
    return data
  }
  catch (error: string | any) {
    useNotify({
      title: 'Error',
      text: error,
      type: 'error',
    })
  }
}

const messageListener = ref()
const userListener = ref()
const channelListener = ref()

export const useChat = (props) => {
  const channelId = computed(() => props?.channelId)

  watchEffect(() => {
    fetchChannels(channels)

    messageListener.value = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          newMessage.value = payload.new
        },
      )
      .subscribe()
    userListener.value = supabase
      .channel('public:users')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        (payload) => {
          newOrUpdatedUser.value = payload.new
        },
      )
      .subscribe()
    channelListener.value = supabase
      .channel('public:channels')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'channels' },
        (payload) => {
          newChannel.value = payload.old
        },
      )
      .subscribe()
  })

  onBeforeUnmount(() => {
    // messageListener.value.unsubscribe();
    // userListener.value.unsubscribe();
    // channelListener.value.unsubscribe();
  })

  watchEffect(() => {
    if (activeChannelId?.value > 0) {
      fetchMessages(activeChannelId.value, (newMessages) => {
        newMessages.forEach(message =>
          users.value.set(message.user_id, message.author),
        )
        messages.value = newMessages
      })
    }
  })

  watch(newMessage, (message) => {
    if (message && message.channel_id === channelId) {
      const handleAsync = async () => {
        const authorId = message.user_id
        if (!users.value.get(authorId)) {
          await fetchUser(authorId, (user) => {
            newOrUpdatedUser.value = user
          })
        }
        messages.value = messages.value.concat(message)
      }
      handleAsync()
    }
  })

  watch(deletedMessage, (newDeletedMessage) => {
    if (newDeletedMessage) {
      messages.value = messages.value.filter(
        message => message.id !== newDeletedMessage.id,
      )
    }
  })

  watch(newChannel, (newChannel) => {
    if (newChannel)
      channels.value = channels.value.concat(newChannel)
  })

  watch(deletedChannel, (newDeletedChannel) => {
    if (newDeletedChannel) {
      channels.value = channels.value.filter(
        channel => channel.id !== newDeletedChannel.id,
      )
    }
  })

  watch(newOrUpdatedUser, (user) => {
    if (user)
      users.value.set(user.id, user)
  })

  return {
    messages: computed(() => {
      return messages.value.map((x: any) => ({
        ...x,
        author: users.value.get(x.user_id),
      }))
    }),
    channels: computed(() =>
      channels.value !== null
        ? channels.value.sort((a, b) => a.slug.localeCompare(b.slug))
        : [],
    ),
    users,
    activeChannelId,
  }
}
