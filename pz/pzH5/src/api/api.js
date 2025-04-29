import request from "./request";

export default {
    login(data){
        return request({
            url:"/login",
            method:"post",
            data
        })
    },
    getHomeData(data){
        return request({
            url:"/Index/index",
            method:"get",
            data
        })
    },
    getCreateInfo(data){
        return request({
            url:"/h5/companion",
            method:"get",
            data
        })
    },
    createOrder(data){
        return request({
            url:"/createOrder",
            method:"post",
            data
        })
    },
    getOrderList(data){
        return request({
            url:"/order/list",
            method:"get",
            data
        })
    },
    getOrderData(data){
        return request({
            url:"/order/detail",
            method:"get",
            data
        })
    },
}