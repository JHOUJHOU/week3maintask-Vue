// 1. 匯入Vue CDN 套件
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.30/vue.esm-browser.prod.min.js';

// 2. 需要串接API，先定義API路徑變數
const url = 'https://vue3-course-api.hexschool.io/v2';
const api_path = 'yusyuanjhou';
let productModal = {};
let delProductModal = {};

// 3. Vue起手式，關注點分離
const app = createApp({
    data() {
        return{
            // 4. 定義資料
            products: [],
            tempProduct: {
                imagesUrl:[],
            },
            isNew: false
        }
    },
    methods: {
        openModal(status, product) {
            // 新增產品開啟Modal視窗
            console.log(status, product);
            if(status === 'isNew'){
                this.tempProduct = {
                    imagesUrl:[],
                }
                productModal.show();
                this.isNew = true;
            } else if(status === 'edit'){
                this.tempProduct =  { ...product };
                productModal.show();
                this.isNew = false;
            } else if(status === 'delete'){
                this.tempProduct =  { ...product };
                delProductModal.show();
            }
                
        },
        checkLogin() {
            // 5. 將剛剛儲存的token儲存
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)jhouToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            // 5. 每次請求後都將token傳入到headers中
            axios.defaults.headers.common['Authorization'] = token;

            const apiUrl = `${url}/api/user/check`;
            axios.post(apiUrl)
            .then(() => {
                this.getProduct();
            })
            .catch(err => {
                console.log(err);
            })

        },
        getProduct() {
            const apiUrl = `${url}/api/${api_path}/admin/products`;
            axios.get(apiUrl)
            .then(res => {
                this.products = res.data.products;
            })
            .catch(err => {
                console.dir(err);
            })
        },
        updateProduct() {
            let apiUrl = `${url}/api/${api_path}/admin/product`;
            let method = 'post';

            if(!this.isNew){
                apiUrl = `${url}/api/${api_path}/admin/product/${this.tempProduct.id}`;
                method = 'put';
            }
            axios[method](apiUrl,{ data: this.tempProduct })
            .then(res => {
                console.log(this.tempProduct);
                // 新增完要重新渲染畫面
                this.getProduct();
                // Modal視窗新增完後關閉
                productModal.hide();
            })
            .catch(err => {
                console.dir(err);
            })
        },
        delProduct() {

        }
    },
    mounted() {
        this.checkLogin();
        productModal = new bootstrap.Modal(document.querySelector('#productModal'));
        delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'));
    }
});

// 實體化
app.mount('#app');