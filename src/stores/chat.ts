import { defineStore } from 'pinia'
import type { Channel, ID, Message, User } from '~/types'

export const useChatStore = defineStore('chat', () => {
  const { fetchUser } = useUserStore()

  const supabase = useSupabase()

  const channelId = ref<ID>()

  const setChannelId = (payload: ID) => {
    channelId.value = payload
  }

  const channels = ref<Partial<Channel[]> | null>([])
  const messages = ref<Partial<Message[]> | null>([])
  const users = ref(new Map<string, User>())

  const newMessage = ref<Message | null>()
  const newChannel = ref<Partial<Channel> | null>()

  const newOrUpdatedUser = ref<Partial<User> | null>()

  const deletedChannel = ref<Partial<Channel> | null>()
  const deletedMessage = ref<Partial<Message> | null>()

  const setMessages = (payload: Partial<Message[]>) => {
    messages.value = payload
  }

  const setNewMessage = async (payload: Message) => {
    newMessage.value = payload
  }

  const setDeletedMessage = async (payload: Partial<Message>) => {
    deletedMessage.value = payload
  }

  const setNewOrUpdatedUser = async (payload: Partial<User>) => {
    newOrUpdatedUser.value = payload
  }

  const setNewChannel = async (payload: Partial<Channel>) => {
    newChannel.value = payload
  }

  const setDeletedChannel = async (payload: Partial<Channel>) => {
    deletedChannel.value = payload
  }

  const fetchChannels = async () => {
    try {
      const { data } = await supabase
        .from('channels')
        .select('*')
        .order('slug', { ascending: true })

      channels.value = data as Channel[]

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

  const addChannel = async (slug: string, user_id: ID) => {
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

  const deleteChannel = async (id: ID) => {
    try {
      const { data } = await supabase
        .from('channels')
        .delete()
        .eq('id', id)
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

  const fetchMessages = async (channelId: ID, reference?: Ref<any> | CallableFunction) => {
    try {
      const { data } = await supabase
        .from('messages')
        .select('*, author:users(*)')
        .eq('channel_id', channelId)
        .order('inserted_at', { ascending: true })

      if (!reference)
        messages.value = data as Message[]

      else if (reference instanceof Function)
        reference(data)

      else
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

  const addMessage = async (message: string, channel_id: ID, user_id: ID) => {
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

  const deleteMessage = async (id: ID) => {
    try {
      const { data } = await supabase
        .from('messages')
        .delete()
        .eq('id', id).select()

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

  onBeforeMount(async () => {
    await fetchChannels()

    messageListener.value = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          setNewMessage(payload.new as Message)
        },
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'messages' },
        payload => setDeletedMessage(payload.old as Message),
      )
      .subscribe()

    userListener.value = supabase
      .channel('public:users')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        payload => setNewOrUpdatedUser(payload.new as User),
      )
      .subscribe()

    channelListener.value = supabase
      .channel('public:channels')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'channels' },
        payload => setNewChannel(payload.new as Channel),
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'channels' },
        payload => setDeletedChannel(payload.old as Channel),
      )
      .subscribe()
  })

  onBeforeUnmount(() => {
    supabase.removeAllChannels()
  })

  watch(newMessage, async (payload) => {
    if (payload && payload.channel_id === channelId.value) {
      const handleAsync = async () => {
        const authorId = payload.user_id
        if (users.value.get(authorId))
          payload.author = users.value.get(authorId) as User

        else
          payload.author = await fetchUser(authorId, setNewOrUpdatedUser) as User

        messages.value = messages.value?.concat(payload) || [payload]
      }
      handleAsync()
    }
  })

  watch(channelId, () => {
    if (channelId.value) {
      fetchMessages(channelId.value, (newMessages: Message[]) => {
        setMessages(newMessages)
      })
    }
  })

  watch(deletedMessage, (payload) => {
    if (payload)
      setMessages(messages.value!.filter(message => message?.id !== payload.id))
  })

  watch(newChannel, (payload) => {
    if (payload)
      channels.value = channels.value!.concat(payload as Channel)
  })

  watch(deletedChannel, (payload) => {
    if (payload)
      channels.value = channels.value!.filter(channel => channel?.id !== payload.id)
  })

  watch(newOrUpdatedUser, (payload) => {
    if (typeof payload?.id === 'string')
      users.value.set(payload.id, payload as User)
  })

  return {
    users,
    channelId,
    setChannelId,
    fetchChannels,
    fetchMessages,
    setMessages,
    addMessage,
    addChannel,
    deleteChannel,
    deleteMessage,
    channelList: computed(() => channels.value || []),
    messageList: computed(() => messages.value || []),
    channelListener,
    messageListener,
    userListener,
  }
})
