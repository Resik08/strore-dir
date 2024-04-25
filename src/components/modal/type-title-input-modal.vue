<script setup>
import {computed, onMounted, ref} from "vue";
const emit = defineEmits(['processed', 'close', 'rename', 'editName'])
const { fileDate, errorName } = defineProps({
  fileDate: {
    type: Object
  },
  errorName: {
    type: Boolean,
    default: false
  }
})
const arrType = [
  { title: 'Папка', value: 'dir' },
  { title: 'Фаил', value: 'file' },
  { title: 'Картинка', value: 'img' }
]
const isCreate = ref(false)
const nameType = ref('')
const localFileDate = ref({})
onMounted(() => {
  isCreate.value = Object.keys(fileDate).length <= 0
 localFileDate.value = { ...fileDate }
})

const isValid = computed(() => {
  if (localFileDate.value && localFileDate.value.type && localFileDate.value.name) {
    return localFileDate.value.type.length > 0 && localFileDate.value.name.length > 0;
  }
  else return  false
});

const changeType = (type) => {
  localFileDate.value.type = type.value
  nameType.value = type.title
}
const processed = () => {
  if (isValid.value) {
      emit(isCreate.value ? 'processed' : 'editName', localFileDate.value)
  }
}
</script>

<template>
  <div class="modal" >
    <div class="modal__body" v-click-outside="() => emit('close')">
    <div v-if="!errorName">
      <div class="modal__body-title">{{ isCreate ? 'Создать' : 'Редактировать' }}</div>
      <div class="modal__types" v-if="isCreate">
        <div class="modal__types-name" :class="{'modal__types-name-change' : localFileDate.type === type.value}"
             @click="changeType(type)" v-for="type in arrType">
          {{ type.title }}
        </div>
      </div>
      <input class="modal__body-input" type="text" placeholder="Имя файла" v-model="localFileDate.name">
      <button @click="processed" class="modal__body-btn" style="width: 100%" :style="{background: isValid ? '#e44' : 'gray'}">Ок</button>
    </div>
      <div v-else>
        <div class="modal-message"> {{nameType ? nameType : 'Фаил'}} с таким именем уже существует в текущей директории, придумайте другое!</div>
        <div @click="emit('rename')" class="modal__body-btn" style="background: goldenrod">Ок</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal {
  display: flex;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  z-index: 30;
  background-color: rgba(83, 83, 83, 0.46);

  &__body {
    background: white;
    padding: 30px;
    border-radius: 6px;
    &-title {
      font-weight: 600;
      font-size: 20px;
      margin-bottom: 30px;
    }

    &-input {
      width: 100%;
      padding: 15px;
      box-sizing: border-box;
      border-radius: 6px;
      border: 1px solid gray;

      &:focus {
        outline: none;
      }
    }

    &-btn {
      border-radius: 6px;
      padding: 15px;
      border: none;

      margin-top: 20px;
      text-align: center;
      cursor: pointer;
    }
  }

  &__types {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    margin-bottom: 30px;

    &-name {
      border: 1px dotted gray;
      border-radius: 6px;
      padding: 20px;
      font-size: 18px;
      cursor: pointer;

      &-change {
        border: 1px solid #e44;
        font-size: 18px;
        color: #ee4444;
      }
    }
  }
  &-message {
    text-align: center;
    margin-bottom: 30px;
    font-size: 20px;

  }
}
</style>