import { type ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void

export type ID = string | number

export type UserStatus = 'ONLINE' | 'OFFLINE'

export type AppRole = 'admin' | 'moderator'

export type AppPermission = 'channels.delete' | 'messages.delete'

export interface UserRole {
  id: ID
  role: AppRole
  user_id: string
}

export interface User {
  id: ID
  status: UserStatus
  username: string | null
}

export interface RolePermissions {
  id: ID
  permission: AppPermission
  role: AppRole
}

export interface Message {
  channel_id: ID
  id: ID
  inserted_at: string
  message: string | null
  user_id: string
  author: User
}

export interface Channel {
  created_by: string
  id: ID
  inserted_at: string
  slug: string
}
