import axios from "axios";
let router;
export function setRouter(_router) {
  router = _router;
}
const request = axios.create({
  baseURL: "https://v3pz.itndedu.com/v3pz",
  timeout: 5000,
  headers: { "terminal" : "h5" },
});

request.interceptors.request.use((req) => {
    req.headers['h-token']=localStorage.getItem('token')||''
    return req
})
request.interceptors.response.use((res) => {
    const {code,data} = res.data
    if(code==10000){
      return data
    }
    if(code==-2){
      localStorage.removeItem('token')
      router.push("/login")
      return Promise.reject("token过期")
    }
    return Promise.reject("code码异常")
  })

function servier(options) {
  options.method=options.method || 'get'
  if(options.method.toLowerCase()==='get'){
    options.params=options.data
  }

  return request(options)
}
export default servier