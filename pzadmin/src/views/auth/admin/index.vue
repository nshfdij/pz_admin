<template>
    <panel-head  :info="route"/>

    <el-table :data="tableData.list" border stripe width="100%">
        <el-table-column prop="id" label="标识" width="180"/>
        <el-table-column prop="name" label="名称" width="180"/>
        <el-table-column prop="permission_id" label="类型" width="180">
            <template #default="scope">
                {{ permissionName(scope.row.permissions_id) }}
            </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" width="180"/>
        <el-table-column prop="active" label="状态" width="180">
            <template #default="scope">
                <el-tag class="ml-2" :type="scope.row.active ? 'success' : 'danger'">
                    {{ scope.row.active ? '正常' : '异常' }}
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
            <template #default="scope">
                <div class="flex-box">
                    <el-icon><Timer /></el-icon>
                    <span style="margin-left: 10px;margin-bottom: 3px;">{{ scope.row.create_time }}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="操作" >
            <template #default="scope">
                <el-button @click="open(scope.row)" type="link" size="small">
                    编辑
                </el-button>
                <el-button @click="deleteMenu(scope.row.id)" type="link" size="small">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="pagination-info">
        <el-pagination
        v-model:current-page="paginationData.pageNum"
        :page-size="paginationData.pageSize"
        :size="small"
        :disabled="disabled"
        :background="false"
        layout="total, prev, pager, next"
        :total="tableData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        
        />
    </div>
    <el-dialog v-model="dialogFormVisible" :before-close="beforeClose" title="添加权限" width="500">
        <el-form ref="formRef" label-width="100px" label-position="left" :model="form" :rules="rules">
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="form.mobile" disabled></el-input>
            </el-form-item>
            <el-form-item label="权限名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入权限名称"></el-input>
            </el-form-item>
            <el-form-item label="菜单权限" prop="permissions_id">
                  <el-select v-model="form.permissions_id" placeholder="请选择菜单权限" style="width: 240px;" multiple>
                    <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>          
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer"> 
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="confirm(formRef)">确定</el-button>
            </div>    
        </template>
    </el-dialog>
</template>
<script setup>
import { authAdmin ,menuSelectList, updateUser } from '@/api';
import { onMounted, reactive } from 'vue';
import dayjs from 'dayjs'
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const small = ref(false);
const disabled = ref(false);
const background = ref(true);
const route = useRoute();

const paginationData = reactive({
    pageNum: 1,
    pageSize: 10
    
});

const tableData = reactive({
    list:[],
    total: 0
})

onMounted(() => {
    getList()
    menuSelectList().then(({data}) => {
        options.value = data.data
    })
})

const options = ref([])
const permissionName = (id) => {
    const item = options.value.find(item => item.id === id)
    return item ? item.name : '超级管理员'
}

const open = (rowData) =>{
    dialogFormVisible.value = true
    Object.assign(form, {mobile:rowData.mobile, name:rowData.name, permissions_id:rowData.permissions_id})
}

const handleSizeChange = (val) =>{
    paginationData.pageSize = val
    getList()
}

const handleCurrentChange = (val) =>{
    paginationData.pageNum = val
    getList()
}

const rules = reactive({
    name:[{required: true, message: '请输入名称', trigger: 'blur'}],
    permissions_id: [{required: true, message: '请选择菜单权限', trigger: 'change'}]
})
//弹窗
const dialogFormVisible = ref(false)

const beforeClose = () => {
    dialogFormVisible.value = false
}

//编辑表单
const form = reactive({
    name: '',
    permissions_id: ''
}) 

const formRef = ref()

//表单提交
const confirm = async (formEl) => {
    if (!formEl) return 
    await formEl.validate((valid, fields)=> {
        if (valid) {
            const {name, permissions_id} = form
            updateUser({name, permissions_id}).then(({data}) => {    
                if(data.code === 10000){
                    dialogFormVisible.value = false
                    getList()
                }
            })
            
        }else{
            console.log('error submit!!',fields)
        }
    })
}
//请求列表数据
const getList = () => {
    authAdmin(paginationData).then(({ data }) => {
        console.log(data)
        const { list, total } = data.data
        list.forEach(item => {
            item.create_time = dayjs(item.create_time).format('YYYY-MM-DD HH:mm:ss')
        });
        tableData.list = list
        tableData.total = total
    })
}
</script>

<style scoped>
.flex-box {
    display: flex;
    align-items: center;
}
</style>