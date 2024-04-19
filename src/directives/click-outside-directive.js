// click-outside-directive.js
const handleOutsideClick = (event, el, binding) => {
    if (!(el === event.target || el.contains(event.target))) {
        binding.value();
    }
};

export default {
    beforeMount(el, binding) {
        el.__clickOutsideHandler = (event) => handleOutsideClick(event, el, binding);

        // Добавим небольшую задержку перед добавлением обработчика
        setTimeout(() => {
            document.addEventListener('click', el.__clickOutsideHandler);
        }, 0);
    },
    beforeUpdate(el, binding) {
        document.removeEventListener('click', el.__clickOutsideHandler);
        el.__clickOutsideHandler = (event) => handleOutsideClick(event, el, binding);

        // Добавим небольшую задержку перед добавлением обработчика
        setTimeout(() => {
            document.addEventListener('click', el.__clickOutsideHandler);
        }, 0);
    },
    unmounted(el) {
        document.removeEventListener('click', el.__clickOutsideHandler);
    },
};
