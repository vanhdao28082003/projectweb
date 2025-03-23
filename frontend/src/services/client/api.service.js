import axios from "axios";

const commonConfig = {
    headers: {
        "Content-Type": "multipart/form-data; boundary=<calculated when request is sent>",
        Accept: "multipart/form-data; boundary=<calculated when request is sent>",
    },
};
export default (baseURL) => {
    return axios.create({
        baseURL,
        ...commonConfig,
    });
};
