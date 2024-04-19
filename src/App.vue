<script setup>
import {onMounted, ref} from "vue";
import {directoryEntry} from '@/store/file-library.js';
import ListDirectory from "@/components/list-directory.vue";
import TypeTitleInputModal from "@/components/modal/type-title-input-modal.vue";
import {findEntryAndParentArray, addSortProperty} from "@/hooks/tools.js";

const selectedCategory = ref(null)
const information = ref([])
const sort = ref(null)
const fileDate = ref({})
const store = directoryEntry();
const error = ref(false)

onMounted(async () => {
  await getData()
});

const getData = async () => {
  await store.loadEntriesFromLocalJson();
  addSortProperty(store.getAllFiles()); // Добавляем свойство sort
  information.value = store.getAllFiles(); // Получаем данные после загрузки
}

const toggleModal = (action, sortValue = null) => {
  sort.value = action === 'open' || action === 'edit' ? sortValue : null;
  fileDate.value = action === 'edit' ? sortValue : {};
  error.value = action === 'close' ? false : error.value;
};

// Добавление записи
const addEntry = (sort, data) => {
  let targetArray = sort !== 0 ? findEntryAndParentArray(information.value, sort).entry.contents : information.value;
  const nameExists = targetArray.some(entry => entry.name === data.name && entry.type === data.type); // проверяем на имя и тип

  if (!nameExists) {
    const newItem = {
      id: targetArray.length + 1,
      type: data.type,
      name: data.name, ...(data.type === 'dir' ? { contents: [] } : {})
    };
    targetArray.push(newItem);
    addSortProperty(store.getAllFiles()); // пересортировываем
    store.setEntries(information.value) // сохраняем в стор
    toggleModal('close');
  } else {
    error.value = true
  }
}

// Редактирование записи
const editEntry = (data) => {
  const { entry, parentArray } = findEntryAndParentArray(information.value, data.sort);
  const nameExists = parentArray.some(entry => entry.name === data.name && entry.type === data.type);
  if (!nameExists) {
    entry.id = data.id;
    entry.name = data.name;
    store.setEntries(information.value);
    toggleModal('close');
  } else {
    error.value = true
  }
}
// Удаление записи
const removeEntry = (sort) => {
  const { entry, parentArray } = findEntryAndParentArray(information.value, sort);
  // Если объект найден, удаляем его
  if (entry) {
    const index = parentArray.indexOf(entry);
    parentArray.splice(index, 1);
    store.setEntries(information.value);
  }
}

</script>


<template>
  <nav class="menu-bar">
    <button class="menu-bar-btn" @click="toggleModal('open', 0)">Добавить корневую папку или файл</button>
    <list-directory :selected-category="selectedCategory"
                    :subcategory="information"
                    @addEntry="toggleModal('open', $event)"
                    @editEntry="toggleModal('edit', $event)"
                    @removeEntry="removeEntry($event)"
                    @selectCategory="selectedCategory = $event"/>

    <type-title-input-modal v-if="sort !== null"
                            :error-name="error"
                            :file-date="fileDate"
                            @close="toggleModal('close')"
                            @rename="error = false"
                            @processed="addEntry(sort, $event)"
                            @edit-name="editEntry($event)"/>

  </nav>
</template>

<style scoped lang="scss">
.menu-bar {
  padding-left: 20px;
  background: #e5dddd;
  height: 100vh;
  padding-top: 10px;

  &-btn {
    margin-bottom: 20px;
    padding: 20px;
    border: none;
    background: #abaa1a;
    width: fit-content;
    border-radius: 6px;
    cursor: pointer;
    font-size: 20px;
    &:hover {
      background: #c7c512;
    }
  }
}
</style>
