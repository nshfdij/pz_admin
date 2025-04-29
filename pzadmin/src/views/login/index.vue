<template>
    <el-row class="login-container" justify="center" align="middle">
        <el-card class="login-card" style="max-width: 450px;">
            <template #header>
                <div class="login-header">
                    注册/登录
                </div>
            </template>
            <div class="jump-link">
                <el-link type="primary" @click="handleChange">{{ formType ? '返回登录' : '注册账号' }}</el-link>
            </div>
            <el-form ref="loginFormRef" :model="loginForm" label-width="auto" style="max-width: 600px" :rules="rules"
                @submit.prevent="handleSubmit">
                <el-form-item prop="userName">
                    <el-input v-model="loginForm.userName" placeholder="请输入手机号" />
                </el-form-item>
                <el-form-item prop="passWord">
                    <el-input v-model="loginForm.passWord" type="password" placeholder="请输入密码" />
                </el-form-item>
                <el-form-item v-if="formType" prop="validCode">
                    <el-input v-model="loginForm.validCode" placeholder="请输入验证码">
                        <template #append>
                            <span class="count-down" @click="countdownChange">{{ countdown.validText }}</span>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="login-btn" type="primary" @click="submitForm(loginFormRef)" native-type="submit">
                        {{ formType ? '注册' : '登录' }}
                    </el-button>
                    <el-link type="info" style="margin-left: 10px;">忘记密码</el-link>
                </el-form-item>
            </el-form>
        </el-card>
    </el-row>
</template>

<script setup>
import '../login/global.css';
import { ElMessage } from 'element-plus';
import { ref, reactive, computed, toRaw } from 'vue';
import { getCode, userAuthentication, login, menuPermissions } from '@/api';
import { useRouter } from 'vue-router';
import { useMenuStore } from '@/store/menu' 

const imgUrl = new URL('../../../login-head.png', import.meta.url).href;

// 切换表单 0登录 1注册
const formType = ref(0);
const loginFormRef = ref();
const router = useRouter();
const menuStore = useMenuStore()

const routerList = computed({
    get() {
        return menuStore.routerList;
    },
    set(newValue) {
        menuStore.routerList = newValue;
    }
})
// 点击切换注册和登录
const handleChange = () => {
    formType.value = formType.value ? 0 : 1;
};

// 发送短信验证码
const countdown = reactive({
    time: 60,
    validText: '获取验证码',
});
let flag = false;
//账号校验规则
const validateUser = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入手机号'));
    } else if (!/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/.test(value)) {
        callback(new Error('请输入正确的手机号'));
    } else {
        callback();
    }
};
// 密码校验规则
const validatePass = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入密码'));
    } else {
        const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        reg.test(value) ? callback() : callback(new Error('密码至少为八位，且包含一个大写字母、一个小写字母和数字'))
    }
};

// 验证码校验规则

//表单校验
const rules = reactive({
    userName: [{ validator: validateUser, trigger: 'blur' }],
    passWord: [{ validator: validatePass, trigger: 'blur' }],
    validCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
})
const countdownChange = () => {
    if (flag) return

    const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
    if (!loginForm.userName || !phoneReg.test(loginForm.userName)) {
        return ElMessage({
            message: '请输入正确的手机号',
            type: 'warning',
            center: true,
            customClass: 'custom-message',
        });
    }

    const interval = setInterval(() => {
        if (countdown.time <= 0) {
            clearInterval(interval);
            countdown.time = 60;
            countdown.validText = '获取验证码';
            flag = false;
        } else {
            countdown.time -= 1;
            countdown.validText = `${countdown.time}s后重新获取`;
        }
    }, 1000);
    flag = true
    getCode({ tel: loginForm.userName }).then(({ data }) => {
        if (data.code === 10000) {
            ElMessage({
                message: '验证码发送成功',
                type: 'success',
                center: true,
                customClass: 'custom-message',
            });
        }
    })

}

const loginForm = reactive({
    userName: '',
    passWord: '',
    validCode: ''
});

const handleSubmit = () => {
    // 表单提交逻辑
    console.log('Form submitted:', loginForm);
};

//表单提交
const submitForm = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log(loginForm, 'submit!')
            if (formType.value) {
                userAuthentication(loginForm).then(({ data }) => {
                    if (data.code === 10000) {
                        ElMessage({
                            message: '注册成功',
                            type: 'success',
                            center: true,
                            customClass: 'custom-message',
                        });
                        formType.value = 0
                    }
                })

            }
            else {
                login(loginForm).then(({ data }) => {
                    if (data.code === 10000) {
                        ElMessage({
                            message: '登录成功',
                            type: 'success',
                            center: true,
                            customClass: 'custom-message',
                        });
                        console.log('准备存储的 token:', data.data.token); // 新增日志
                        localStorage.setItem('token', data.data.token)
                        localStorage.setItem('userInfo', JSON.stringify(data.data.userInfo))
                        menuPermissions().then(({ data }) => {
                            menuStore.dynamicMenu(data.data)
                            // 清空现有路由
                            router.getRoutes().forEach(route => {
                                    if(route.name === 'main') {
                                        route.children.forEach(child => {
                                            router.removeRoute(child.name)
                                        })
                                    }
                                })
                                // 添加新路由
                                menuStore.routerList.forEach(item => {
                                    router.addRoute('main', item)
                                })
                                router.push('/dashboard')
                            })
                        
                    }
                })

            }
        } else {
            console.log('error submit!', fields)
        }
    })
};
</script>

<style lang="less" scoped>
.login-container {
    height: 100vh;
    background-image: url('../../../login-background.jpg');
    background-size: 100% 100%;
    overflow: hidden;
}

.login-card {
    background-color: rgba(255, 255, 255, 1); // 调整透明度
    border: none;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    overflow: hidden;
    width: 100%;
    max-width: 450px;
}

.login-header {
    text-align: center;

    img {
        max-width: 100%;
        height: auto;
    }
}

.count-down {
    cursor: pointer;
}

.jump-link {
    text-align: right;
    margin-bottom: 20px;
}

.el-form-item {
    margin-bottom: 20px;
}

.el-input {
    height: 48px;
    border-radius: 30px;
}

.el-input__inner {
    height: 48px;
    line-height: 48px;
    border: none;
    padding: 0 12px;
    background-color: #f5f5f5;

    &:focus {
        border-color: #409EFF;
        border: 3px solid #ddd;
    }

    &::placeholder {
        color: #999;
    }
}

.el-link {
    font-size: 14px;
}

.el-button {
    width: 100%;
}

.login-btn {
    width: 100%;
    height: 48px;
    line-height: 48px;
    border-radius: 30px;
}
</style>