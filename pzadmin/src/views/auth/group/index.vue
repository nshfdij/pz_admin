<template>
    <panel-head :info="route"/>
    <el-button @click="open(null)" :icon="CirclePlus" style="margin-top: 10px; margin-bottom: 10px;" type="primary" size="small">新增</el-button>
    <el-table :data="tableData.list" border stripe width="100%">
        <el-table-column prop="id" label="标识" width="180"/>
        <el-table-column prop="name" label="名称" width="180"/>
        <el-table-column prop="permissionName" label="权限"  />
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
        :background="background"
        layout="total, prev, pager, next"
        :total="tableData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        />
    </div>
    
    <el-dialog v-model="dialogFormVisible" :before-close="beforeClose" title="添加权限" width="500">
        <el-form ref="formRef" label-width="100px" label-position="left" :model="form" :rules="rules">
            <el-form-item v-show="false" label="权限标识" prop="id">
                <el-input v-model="form.id"></el-input>
            </el-form-item>
            <el-form-item label="权限名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入权限名称"></el-input>
            </el-form-item>
            <el-form-item label="权限" prop="permissions">
                <el-tree style="max-width: 600px" :data="permissionData" show-checkbox node-key="id"
                    :default-expanded-keys="[2]" :default-checked-keys="[4,5]" ref="treeRef"/>
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
import { ref, reactive, onMounted, nextTick } from 'vue'
import { userGetMenu ,userSetMenu, menuList } from '@/api/index'
import { CirclePlus } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

const route = useRoute()
onMounted(() => {
    userGetMenu().then(({ data })=>{
        console.log(data)
        permissionData.value = data.data
    })
    getList()
})

//列表数据
const tableData = reactive({
    list:[],
    total: 0
})

const paginationData = reactive({
    pageNum: 1,
    pageSize: 10
});

const handleSizeChange = (val) =>{
    paginationData.pageSize = val
    getList()
}

const handleCurrentChange = (val) =>{
    paginationData.pageNum = val
    getList()
}
//请求列表数据
const getList = () => {
    menuList(paginationData).then(({ data }) => {
        console.log(data)
        const { list, total } = data.data
        tableData.list = list
        tableData.total = total
    })
}

//form表单
const form = reactive({
    id: '',
    name: '',
    permissionData: ''
})
//权限列表
const permissionData = ref([])
const treeRef = ref()
const formRef = ref()

const rules = reactive({
    name: [
        { required: true, message: '请输入权限名称', trigger: 'blur' },
        
    ]
})
//弹幕的显示隐藏
const dialogFormVisible = ref(false)

//关闭弹窗
const beforeClose = () => {
    dialogFormVisible.value = false
    // 重置表单
    formRef.value.resetFields()
    treeRef.value.setCheckedKeys([4,5])
}

//确定按钮,表单提交
const confirm = async (formEl) => {
    if (!formEl) return 
    await formEl.validate((valid, fields)=> {
        if (valid) {
            const permissions = JSON.stringify(treeRef.value.getCheckedKeys())
            userSetMenu({name: form.name, permissions,id: form.id}).then(({data}) => {    
                console.log(data)
                beforeClose()
                getList()
            })
            
        }else{
            console.log('error submit!!',fields)
        }
    })
}
//打开弹窗
const open = (rowData= {} ) => {
    dialogFormVisible.value = true
    // 弹窗打开，form生成是异步的
    nextTick(() => {
        if (rowData) {
            Object.assign(form, { id: rowData.id, name: rowData.name });
            if (rowData.permission) {
                treeRef.value.setCheckedKeys(rowData.permission);
            }
        } else {
            // 如果 rowData 为 null 或 undefined，只清空表单的 id 和 name
            Object.assign(form, { id: '', name: '' });
            // 不重置树的选中项，保留默认选中项
        }
    });
}   

// const deleteMenu = (id) => {
//     userSetMenu({id}).then(({data}) => {    
//         console.log(data)
//         getList()

//     })
// }

</script>
<style scoped></style>