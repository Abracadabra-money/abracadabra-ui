<template>
  <input class="search-input" type="text" placeholder="Search" />
</template>

<style lang="scss" scoped>
.search-input {
  background-color: rgba(255, 255, 255, 0.1);
  height: 50px;
  width: 100%;
  font-size: 20px;
  border-radius: 20px;
  border: none;
  outline: none;
  color: #fff;
  padding: 0 14px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
}
</style>
