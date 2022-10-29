<template>
    <h1 class="title">hello,app</h1>
    <!-- <Home /> -->
    <el-button type="priary">按钮</el-button>
   
</template>

<script>
// import Home from './views/Home';
import { ElButton } from 'element-plus'

export default {
    name: "App",
    components: { ElButton },
};

</script>

<style>
.title{
    color:pink
}
</style>