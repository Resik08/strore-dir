<script setup>
import {ref} from "vue";

const {} = defineProps({
  subcategory: {
    type: Array
  },
  indent: {
    type: Number,
    default: 0
  },
  selectedCategory: {
    type: Number
  }

})
const emit = defineEmits(['selectCategory', 'addEntry', 'editEntry', 'removeEntry'])

const isShowButtons = ref(null)

const toggleCategory = (category) => {
  category.isShow = !category.isShow;
  emit('selectCategory', category.sort)
  // Если у нас закрывается текущая папка, то и закрываются папки-дети
  if (!category.isShow) {
    emit('selectCategory', null)
    isShowButtons.value = null
    const closeChildren = (categories) => {
      if (!categories || categories.length === 0) return;
      for (const subcategory of categories) {
        subcategory.isShow = false;
        closeChildren(subcategory.contents);
      }
    };
    closeChildren(category.contents);
  }
};


</script>

<template>
  <section class="list-directory" v-for="category in subcategory">
    <div class="list-directory__item" :class="{'list-directory__item-change' : selectedCategory === category.sort}"
         :style="{marginLeft: indent + 'px'}" @click="toggleCategory(category)">
      <img v-if="category.type === 'dir' && category.contents && category.contents.length" src="/svg/select.svg" alt="ico"
           class="list-directory__select" :class="{'list-directory__select-active' : category.isShow}">
      <img style="cursor: pointer"
           :src="category.type === 'dir' ? '/svg/folder.svg': category.type === 'file' ? '/svg/file.svg' : '/svg/image.svg'"
           alt="ico">
      <div style="cursor: pointer">{{ category.name }}</div>
      <div class="list-directory__btn" v-if="selectedCategory === category.sort">
        <img @click.stop="emit('addEntry', category.sort)" v-if="category.type === 'dir'"
             class="list-directory__btn-svg" src="/svg/add.svg" alt="ico">
        <img @click.stop="emit('editEntry', category)" class="list-directory__btn-svg" src="/svg/edit.svg" alt="ico">
        <img @click.stop="emit('removeEntry', category.sort)" class="list-directory__btn-svg" src="/svg/delete.svg"
             alt="ico">
      </div>
    </div>
    <list-directory v-if="category.isShow"
                    :indent="indent + 20"
                    :subcategory="category.contents"
                    :selected-category="selectedCategory"
                    @addEntry="emit('addEntry', $event)"
                    @editEntry="emit('editEntry', $event)"
                    @removeEntry="emit('removeEntry', $event)"
                    @selectCategory="$emit('selectCategory', $event)"/>
  </section>
</template>

<style scoped lang="scss">
.list-directory {
  border-left: 1px solid gray;
  padding: 10px 10px 0;
  width: fit-content;

  &__item {
    display: flex;
    align-items: center;
    gap: 10px;
    border-radius: 6px;
    width: fit-content;
    font-size: 20px;
    padding: 5px;

    &-change {
      background: gray;
      color: #d3caca;
    }
  }

  &__select {
    cursor: pointer;
    width: 20px;
    height: 20px;
    &-active {
      transform: rotate(90deg);
    }
  }

  &__btn {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: 50px;

    &-svg {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  }

}
</style>