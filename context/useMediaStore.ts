
import * as MediaLibrary from 'expo-media-library';
import { create } from 'zustand';

type State = {
    medias: MediaLibrary.Asset[]
    activeView: 'camera' | 'form' | 'loader'
    setMedias: (media: MediaLibrary.Asset[]) => void
    setActiveView: (view: State['activeView']) => void
}

export const useMediaStore = create<State>((set) => ({
    medias: [],
    activeView: 'camera',
    setMedias: (medias) => set({ medias }),
    setActiveView: (activeView) => set({ activeView }),
}))
