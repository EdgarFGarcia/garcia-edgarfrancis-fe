export interface Store {
    id: number
    name: string
    address: string
    created_at: string
    updated_at: string
    deleted_at: any
    is_open: boolean
    hours: Hour[]
}

export interface Hour {
    id: number
    store_id: number
    day_of_week: string
    open_time: string
    close_time: string
    created_at: string
    updated_at: string
  }