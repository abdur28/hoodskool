import { create } from "zustand";
import { AdminStore } from "@/types/admin";
import useAdminUsersData from "./useAdminUsersData";
import useAdminCategoriesData from "./useAdminCategoriesData";

/**
 * Main admin hook that combines all specialized admin hooks
 * This provides a single entry point for accessing all admin functionality
 */
const useAdmin = create<AdminStore>((set, get) => {
  // Get initial state from sub-stores
  const userDataState = useAdminUsersData.getState();
  const categoryDataState = useAdminCategoriesData.getState();

  // Helper function to wrap async methods to ensure direct updates to main store
  const wrapAsyncMethod = (method: Function, storeUpdater: Function) => {
    return async (...args: any[]) => {
      // Call the original method from the sub-store
      const result = await method(...args);
      
      // Get the latest state from the sub-store after the method completes
      const newState = storeUpdater();
      
      // Update the main store with the new state
      set((currentState) => ({
        ...currentState,
        ...newState
      }));
      
      // Return the original result
      return result;
    };
  };

  // Wrap all user data methods
  const wrappedUserMethods = Object.keys(userDataState)
    .filter(key => typeof userDataState[key as keyof typeof userDataState] === 'function')
    .reduce((methods, key) => {
      methods[key] = wrapAsyncMethod(
        userDataState[key as keyof typeof userDataState] as Function,
        () => useAdminUsersData.getState()
      );
      return methods;
    }, {} as Record<string, any>);

  // Wrap all category data methods
  const wrappedCategoryMethods = Object.keys(categoryDataState)
    .filter(key => typeof categoryDataState[key as keyof typeof categoryDataState] === 'function')
    .reduce((methods, key) => {
      methods[key] = wrapAsyncMethod(
        categoryDataState[key as keyof typeof categoryDataState] as Function,
        () => useAdminCategoriesData.getState()
      );
      return methods;
    }, {} as Record<string, any>);

  // Global reset errors function
  const resetErrors = () => {
    useAdminUsersData.setState(state => ({
      error: { 
        ...state.error, 
        users: null, 
        adminAction: null 
      }
    }));
    useAdminCategoriesData.setState(state => ({
      error: { 
        ...state.error, 
        categories: null, 
        adminAction: null 
      }
    }));
  };

  // Subscribe to user data store to keep the main store in sync
  useAdminUsersData.subscribe((state) => {
    const stateWithoutMethods = Object.fromEntries(
      Object.entries(state).filter(([_, value]) => typeof value !== 'function')
    );
    set((currentState) => ({
      ...currentState,
      ...stateWithoutMethods
    }));
  });

  // Subscribe to category data store to keep the main store in sync
  useAdminCategoriesData.subscribe((state) => {
    const stateWithoutMethods = Object.fromEntries(
      Object.entries(state).filter(([_, value]) => typeof value !== 'function')
    );
    set((currentState) => ({
      ...currentState,
      ...stateWithoutMethods
    }));
  });

  // Create the combined store
  return {
    // Combine all state properties
    ...userDataState,
    ...categoryDataState,

    // Add all wrapped methods
    ...wrappedUserMethods,
    ...wrappedCategoryMethods,

    // Global method to reset all errors
    resetErrors,
  };
});

export default useAdmin;