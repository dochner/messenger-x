<script setup>
defineProps({
  modelValue: String,
})

const emits = defineEmits(['update:modelValue', 'submit'])

const submitOnEnter = () => {
  emits('submit')
}
</script>

<template>
  <input
    class="focus:shadow-outline w-full appearance-none border rounded px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
    type="text"
    placeholder="Send a message"
    :value="modelValue"
    @keydown.enter="submitOnEnter"
    @input="($event) => $emit('update:modelValue', $event.target.value)"
  >
</template>
