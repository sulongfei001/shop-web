import plupload from 'plupload';
import FileApi from "../api/FileApi";

class Uploader {
    static create(elementId, dir, onSuccess, onFail) {
        let senderId = elementId;
        let policy;
        let uploader = new plupload.Uploader({
            browse_button : elementId,
            url : "http://oss.aliyuncs.com",
            multi_selection: false,
            runtime: "html5",
            filters : {
                max_file_size : '4mb'
            },
            resize: { width: 800, quality: 90 },
            init: {
                Init: function(up, info) {
                    document.getElementById(elementId).style.zIndex = '';
                    let inputs = document.getElementsByTagName("input");
                    inputs[inputs.length - 1].accept = 'image/*';
                },
                FilesAdded: function (up, files) {
                    FileApi.getObjectPolicy({
                        directory: dir,
                        maxBytes: 4000 * 1024,
                        count: files.length
                    }, data => {
                        policy = data;
                        for (let i = 0; i < files.length; i++) {
                            let file = files[i];
                            policy[file.name] = dir + "/" + policy.fileNames[i] + file.name.substring(file.name.lastIndexOf("."));
                        }
                        let params = {
                            "key": dir,
                            "policy": policy.policyBase64,
                            "OSSAccessKeyId": policy.accessId,
                            "success_action_status": "200",
                            "signature": policy.signature
                        };
                        up.setOption({
                            "url": policy.host,
                            "multipart_params": params
                        });
                        up.start();
                    }, error => {
                        onFail && onFail(error);
                    });
                },
                BeforeUpload: function(up, file) {
                    let params = {
                        "key": policy[file.name],
                        "policy": policy.policyBase64,
                        "OSSAccessKeyId": policy.accessId,
                        "success_action_status": "200",
                        "signature": policy.signature
                    };
                    up.setOption({
                        "url": policy.host,
                        "multipart_params": params
                    });
                    up.start();
                },
                FileUploaded: function (up, file, info) {
                    if (info.status === 200) {
                        onSuccess && onSuccess({ senderId: senderId, url: policy.baseUrl + policy[file.name], relativeUrl: policy[file.name] });
                    } else if (info.status === 203) {
                        onFail && onFail('上传到OSS成功，但是oss访问用户设置的上传回调服务器失败，失败原因是:' + info.response);
                    } else {
                        onFail && onFail(info.response);
                    }
                },
                Error: function (up, err) {
                    if (err.code === -600) {
                        onFail && onFail("文件尺寸超出系统限制");
                    } else if (err.code === -601) {
                        onFail && onFail("文件类型不合法");
                    } else if (err.code === -602) {
                        onFail && onFail("文件已上传")
                    } else {
                        onFail && onFail(err.response);
                    }
                }
            }
        });
        uploader.init();
        return uploader;
    }
}

export default Uploader;