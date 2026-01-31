let IS_PROD = true;


const servers = IS_PROD ?
     'https://viorabackend-5zh7.onrender.com' ://this is for production server
     'http://localhost:8000';//this is for development server


export default servers;