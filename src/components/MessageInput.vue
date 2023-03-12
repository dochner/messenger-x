<script setup>
defineProps({
  modelValue: String,
});

const emits = defineEmits(["update:modelValue", "submit"]);

const submitOnEnter = () => {
  emits("submit");
};
</script>

<template>
  <input
    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    type="text"
    placeholder="Send a message"
    :value="modelValue"
    @keydown.enter="submitOnEnter"
    @input="($event) => $emit('update:modelValue', $event.target.value)"
  />
</template>
