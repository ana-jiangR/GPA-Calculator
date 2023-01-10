// pages/about/about.js
Page({
    mixins: [require('../../mixin/common')],
    /**
     * 页面的初始数据
     */
    data: {
        list: [{
            title: 'Basic Info',
            expand: false,
            pages: [],
            iconpng: "images/icon_nav_Math.png",

        },

        {
            title: 'Tutorial & Common Issues',
            expand: false,
            pages: [],
            iconpng: 'images/icon_nav_Elective.png',

        },

        {
            title: 'Website Version',
            expand: false,
            pages: [],
            iconpng: 'images/icon_nav_Chinese.png',
        },
        {
            title: 'Calculation Algorithm',
            expand: false,
            pages: [],
            iconpng: 'images/icon_nav_Chinese.png',
        },
        {
            title: 'Contact Me',
            expand: false,
            pages: [],
            iconpng: 'images/icon_nav_Chinese.png',
        },
        {
            title: 'Version History',
            expand: false,
            pages: [],

            iconpng: 'images/icon_nav_Chinese.png',
        },

    ],
    },
    aboutToggle(e) {

        const {
            id
        } = e.currentTarget;
        const {
            list
        } = this.data;

        // convert id to number/index
        let index = Number(id);

        // console.log("id:%o, index:%o, name:%o", id, index, list[index].name);

        list[index].expand = !list[index].expand;


        // 一次只能展开一个。。
        for (let i = 0, len = list.length; i < len; ++i) {
            if (index != i) {
                list[i].expand = false;
            }
        }

        this.setData({
            list,
        });

        // console.log(list);

    },
    //  转发分享
    onShareAppMessage() {
        return {
            title: 'SSBS|GPA计算',
            //path: 'pages/home/index',
            imageUrl: '../images/logo_gold.png'
        }
    },

    // 转发朋友圈
    onShareTimeline() {
        return {
            title: 'SSBS|GPA计算器',
            imageUrl: '../images/logo_gold.png'
        }
    },
})