/**
 * 上传头像/封面
 */
import React from 'react';
import { Upload, Icon, message, Modal } from 'antd';
import { OPERATOR_URL } from '@/utils/Constants';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class Avatar extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => {
    console.log("fileList",this.state.fileList);
    this.setState({ fileList });
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action={`${OPERATOR_URL}/manager/addimage`}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default Avatar;

// function getBase64(img, callback) {
//   const reader = new FileReader();
//   reader.addEventListener('load', () => callback(reader.result));
//   reader.readAsDataURL(img);
// }

// function beforeUpload(file) {
//   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
//   if (!isJpgOrPng) {
//     message.error('仅支持JPG/PNG文件');
//   }
//   const isLt2M = file.size / 1024 / 1024 < 2;
//   if (!isLt2M) {
//     message.error('图片必须小于2MB!');
//   }
//   return isJpgOrPng && isLt2M;
// }

// class Avatar extends React.Component {
//   state = {
//     loading: false,
//     previewVisible: false,
//     previewImage: '',
//     fileList: [],
//   };

//   // componentDidMount() {
//   //   if (this.props.value) this.setState({ imageUrl: this.props.value });
//   // }

//   handleCancel = () => this.setState({ previewVisible: false });

//   handlePreview = async file => {
//     if (!file.url && !file.preview) {
//       file.preview = await getBase64(file.originFileObj);
//     }

//     this.setState({
//       previewImage: file.url || file.preview,
//       previewVisible: true,
//     });
//   };

//   handleChange = ({ fileList }) => this.setState({ fileList });

//   render() {
//     const { previewVisible, previewImage, fileList } = this.state;
//     const uploadButton = (
//       <div>
//         <Icon type="plus" />
//         <div className="ant-upload-text">添加</div>
//       </div>
//     );
//     return (
//       <div className="clearfix">
//         <Upload
//           action={`${OPERATOR_URL}/manager/addimage`}
//           listType="picture-card"
//           fileList={fileList}
//           onPreview={this.handlePreview}
//           onChange={this.handleChange}
//         >
//           {fileList.length >= 8 ? null : uploadButton}
//         </Upload>
//         <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
//           <img alt="example" style={{ width: '100%' }} src={previewImage} />
//         </Modal>
//       </div>
//     );
//   }

//   // handleChange = info => {
//   //   const { name = 'avatar' } = this.props;
//   //   if (info.file.status === 'uploading') {
//   //     this.setState({ loading: true });
//   //     return;
//   //   }
//   //   if (info.file.status === 'done') {
//   //     // 获取服务器返回值
//   //     const { response } = info.file;
//   //     if (response.url) {
//   //       this.props.onChange && this.props.onChange(response.url);
//   //     }

//   //     getBase64(info.file.originFileObj, imageUrl => {
//   //       console.log(imageUrl);
//   //       this.setState({
//   //         imageUrl,
//   //         loading: false,
//   //       });
//   //     });
//   //   }
//   // };

//   render() {
//     // const uploadButton = (
//     //   <div>
//     //     <Icon type={this.state.loading ? 'loading' : 'plus'} />
//     //     <div className="ant-upload-text">上传</div>
//     //   </div>
//     // );
//     // const { imageUrl } = this.state;
//     // const { name = 'avatar' } = this.props;
//     // return (
//     //   <Upload
//     //     name={name}
//     //     listType="picture-card"
//     //     className="avatar-uploader"
//     //     showUploadList={false}
//     //     action={`${OPERATOR_URL}/manager/addimage?_id=${localStorage.getItem('userId')}`}
//     //     beforeUpload={beforeUpload}
//     //     onChange={this.handleChange}
//     //   >
//     //     {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
//     //   </Upload>
//     // );
//   }
// }
