import type { NotificationsOptions } from '@kyvg/vue3-notification'
import { useNotification } from '@kyvg/vue3-notification'
const { notify } = useNotification()

export const useNotify = (options: NotificationsOptions) => {
  notify(options)
}
