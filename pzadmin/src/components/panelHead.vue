<template>
    <div class="panel-heading">
        <div class="panel-lead">
            <div class="title">{{ props.info.meta.name}}</div>
            <p class="description">{{ props.info.meta.describe }}</p>

        </div>
    </div>
</template>
<script setup>

const props = defineProps({
    info: {
        type: Object,
    }
})
</script>

<style lang="less" scoped>
    .panel-heading {
        padding: 15px 0;
        background: #f3f6f7;
        border-color: #e8edf0;
        position: relative;
        .panel-lead {
            font-size: 14px;
            .title {
                font-weight: bold;
                font-style: normal;
            }
            .description {
                margin-top: 5px;
            }
        }
    }
</style>