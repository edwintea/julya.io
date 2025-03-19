const config = {
    APP_INFO: {
        APP_Name    : "Julya.IO",
        VERSION     : "0.1"
    },
    
    // // SERVER AWS
    //API_URL         : "https://api.julya.io/api/v1/auth",
    //IMAGE_URL         : "https://api.julya.io/assets/image",

    // // // SERVER LOXAL
     API_URL         : "http://localhost/julya-be/api/v1/auth",
     IMAGE_URL         : "http://localhost/julya-be/assets/image",
    DEFAULT_PLAN    :'JUL-PLAN-23121500001',

    production_mode: false,

    API_DEFINITION: {
        //AUTH
        "LOGIN": { "METHOD": "POST", "ENDPOINT": "/login" },
        "REGISTER": { "METHOD": "POST", "ENDPOINT": "/register" },
        "LOGIN_TIKTOK": { "METHOD": "POST", "ENDPOINT": "/tiktok_login" },
        "LOGIN_GOOGLE": { "METHOD": "POST", "ENDPOINT": "/google_login" },
        "FORGOT_PASSWORD": { "METHOD": "POST", "ENDPOINT": "/forgot_password" },
        "SEND_VERIFY": { "METHOD": "POST", "ENDPOINT": "/send_verify" },

        //TIKTOK
        "GET_TIKTOK_VIDEO_RECOMMENDED": { "METHOD": "POST", "ENDPOINT": "/get_tiktok_video" },
        "GET_TIKTOK_VIDEO_SEARCH": { "METHOD": "POST", "ENDPOINT": "/get_tiktok_video_search" },
        "GET_TIKTOK_VIDEO_SEARCH_HASHTAG": { "METHOD": "POST", "ENDPOINT": "/get_tiktok_video_search_hashtag" },
        "GET_TIKTOK_VIDEO_USER": { "METHOD": "POST", "ENDPOINT": "/get_tiktok_video_user" },
        "GET_TIKTOK_VIDEO_LINK": { "METHOD": "POST", "ENDPOINT": "/get_tiktok_video_link" },
        "GET_TIKTOK_VIDEO_MOST": { "METHOD": "POST", "ENDPOINT": "/get_tiktok_video_most" },
        "TRANSCRIPT_VIDEO": { "METHOD": "POST", "ENDPOINT": "/transcript_video" },

        //INSTAGRAM
        "GET_INSTAGRAM_USER": { "METHOD": "POST", "ENDPOINT": "/get_instagram_user" },
        "SEARCH_INSTAGRAM_USER": { "METHOD": "POST", "ENDPOINT": "/search_instagram_user" },
        "SEARCH_INSTAGRAM_USER_CONTENT": { "METHOD": "POST", "ENDPOINT": "/search_instagram_user_content" },
        "SEARCH_INSTAGRAM_USER_REELS": { "METHOD": "POST", "ENDPOINT": "/search_instagram_user_reels" },
        "SEARCH_INSTAGRAM_HASHTAG": { "METHOD": "POST", "ENDPOINT": "/search_instagram_hashtag" },
        "GET_INSTAGRAM_STORY": { "METHOD": "POST", "ENDPOINT": "/get_instagram_story" },
        "GET_IMAGE": { "METHOD": "POST", "ENDPOINT": "/get_instagram_image" },
        "GET_INSTAGRAM_VIDEO_LINK": { "METHOD": "POST", "ENDPOINT": "/get_instagram_video_link" },

        "TRANSCRIPT_VIDEO_INSTAGRAM": { "METHOD": "POST", "ENDPOINT": "/transcript_video_instagram" },

        //ACTIVATION
        "GET_ACTIVATION": { "METHOD": "POST", "ENDPOINT": "/get_activation" },

        //PLAN
        "GET_PLAN": { "METHOD": "POST", "ENDPOINT": "/get_plan" },

        //TRX
        "GET_TRX": { "METHOD": "POST", "ENDPOINT": "/get_trx" },
        "ADD_TRX": { "METHOD": "POST", "ENDPOINT": "/add_trx" },
        "CANCEL_TRX": { "METHOD": "POST", "ENDPOINT": "/cancel_trx" },

        //USER
        "GET_USER_INFO": { "METHOD": "POST", "ENDPOINT": "/get_user_info" },
        "EDIT_USER": { "METHOD": "POST", "ENDPOINT": "/edit_user" },
        "EDIT_PASSWORD": { "METHOD": "POST", "ENDPOINT": "/edit_password" },
        "VERIFY_LINK": { "METHOD": "POST", "ENDPOINT": "/send_verify" },
        "GET_SAVED_CONTENT": { "METHOD": "POST", "ENDPOINT": "/get_save_content" },
        "DELETE_SAVE": { "METHOD": "POST", "ENDPOINT": "/delete_saved_content" },
        "SAVE_USER_CONTENT": { "METHOD": "POST", "ENDPOINT": "/save_user_content" },
        "GET_QUICK_SEARCH": { "METHOD": "POST", "ENDPOINT": "/get_quick_search" },
        "DELETE_QUICK_SEARCH": { "METHOD": "POST", "ENDPOINT": "/delete_quick_search" },

        //AI
        "GET_PROMPT": { "METHOD": "POST", "ENDPOINT": "/get_prompt" },
        "SUBMIT_AI": { "METHOD": "POST", "ENDPOINT": "/submit_ai" },


    }
}
export default config;
