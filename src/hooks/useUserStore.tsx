// stores/userStore.ts
import { create } from 'zustand'
import { supabase } from '@/store/supabase'

interface UserData {
  displayName: string
  initial: string
  email: string
  hasName: boolean
}

interface UserStore {
  user: UserData | null
  isLoading: boolean
  error: string | null
  fetchUser: () => Promise<void>
  clearUser: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  
  fetchUser: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        throw new Error('Not authenticated')
      }

      let displayName = "User";
      let initial = "U";

      if (user.user_metadata?.full_name) {
        displayName = user.user_metadata.full_name;
        initial = user.user_metadata.full_name.charAt(0).toUpperCase();
      } else if (user.user_metadata?.name) {
        displayName = user.user_metadata.name;
        initial = user.user_metadata.name.charAt(0).toUpperCase();
      } else if (user.user_metadata?.first_name) {
        displayName = user.user_metadata.first_name;
        initial = user.user_metadata.first_name.charAt(0).toUpperCase();
      } else if (user.email) {
        const username = user.email.split("@")[0];
        displayName = username;
        initial = username.charAt(0).toUpperCase();
      }

      set({ 
        user: {
          displayName,
          initial,
          email: user.email || '',
          hasName: !!(
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.user_metadata?.first_name
          ),
        }, 
        isLoading: false 
      })
    } catch (error) {
      console.error('Error fetching user:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false 
      })
    }
  },
  
  clearUser: () => {
    set({ user: null, error: null })
  }
}))