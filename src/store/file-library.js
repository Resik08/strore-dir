import { defineStore } from 'pinia';
import axios from 'axios';

export const directoryEntry = defineStore({
    id: 'catalogStore',
    state: () => ({
        entries: []
    }),

    actions: {
        // Загружаем данные из локального Json
        async loadEntriesFromLocalJson() {
            try {
                const response = await axios.get('start.json');
                this.entries = response.data;
            } catch (error) {
                console.error('Error loading entries:', error);
            }
        },
        getAllFiles() {
            return this.entries;
        },
        setEntries(newEntries) {
            this.entries = newEntries;
        }
    }
})



