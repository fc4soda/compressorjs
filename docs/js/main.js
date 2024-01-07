window.addEventListener('DOMContentLoaded', function () {
  var Vue = window.Vue;
  var URL = window.URL || window.webkitURL;
  var XMLHttpRequest = window.XMLHttpRequest;
  var Compressor = window.Compressor;

  Vue.component('VueCompareImage', window.vueCompareImage);


  const messages = {
    en: {
      message: {
        hello: '{msg} world'
      },
      langs: {
        cn: '简体中文',
        en: 'English',
      },
      description: 'JavaScript image compressor.',
      tooltip: {
        dropImageHere: 'Drop image here or ',
        browse: 'browse... ',
        playground: 'Playground',
        options: 'Options',
        strict: 'strict',
        checkOrientation: 'checkOrientation',
        retainExif: 'retainExif',
        maxWidth: 'maxWidth',
        maxHeight: 'maxHeight',
        minWidth: 'minWidth',
        minHeight: 'minHeight',
        width: 'width',
        height: 'height',
        resize: 'resize',
        quality: 'quality',
        mimeType: 'mimeType',
        convertSize: 'convertSize',
        convertTypes: 'convertTypes',
        outputImage: 'Output image',
        compressedImage: '(compressed image)',
        download: 'Download',
        lastModified: 'lastModified',
        lastModifiedDate: 'lastModifiedDate',
        name: 'name',
        type: 'type',
        size: 'size',
        off: 'off',
        comparingImages: 'Comparing images',
        inputImage: 'Input image',
        outputImage: 'Output image',
        originalImage: '(original image)'
      }
    },
    cn: {
      message: {
        hello: '{msg} 世界'
      },
      langs: {
        cn: '简体中文',
        en: 'English',
      },
      description: '图片压缩工具',
      tooltip: {
        dropImageHere: '拖动图片到此 或 ',
        browse: '选择图片',
        playground: '操作区',
        options: '选项',
        strict: '精确模式',
        checkOrientation: '检查图片方向',
        retainExif: '保留 Exif 信息',
        maxWidth: '最大宽度',
        maxHeight: '最大高度',
        minWidth: '最小宽度',
        minHeight: '最小高度',
        width: '宽度',
        height: '高度',
        resize: '调整大小',
        quality: '图像质量',
        mimeType: 'mime 类型',
        convertSize: '转换结果图片大小',
        convertTypes: '转换结果图片类型',
        outputImage: '转换结果图片',
        compressedImage: '(压缩后的图片)',
        download: '下载',
        lastModified: '最后修改时间',
        lastModifiedDate: '最后修改日期',
        name: '图片文件名',
        type: '图片格式',
        size: '图片大小',
        off: '压缩比例',
        comparingImages: '比较转换前后图片',
        inputImage: '转换前',
        outputImage: '转换后',
        originalImage: '(原始图片)'
      }
    },
  }


  const i18n = new VueI18n({
		locale: 'cn',
		fallbackLocale: 'en',
		messages,
	})

  new Vue({
    i18n,
    el: '#app',

    data: function () {
      var vm = this;

      return {
        messages: messages,
        options: {
          strict: true,
          checkOrientation: true,
          retainExif: false,
          maxWidth: undefined,
          maxHeight: undefined,
          minWidth: 0,
          minHeight: 0,
          width: undefined,
          height: undefined,
          resize: 'none',
          quality: 0.8,
          mimeType: '',
          convertTypes: 'image/png',
          convertSize: 5000000,
          success: function (result) {
            console.log('Output: ', result);

            if (URL) {
              vm.outputURL = URL.createObjectURL(result);
            }

            vm.output = result;
            vm.$refs.input.value = '';
          },
          error: function (err) {
            window.alert(err.message);
          },
        },
        inputURL: '',
        outputURL: '',
        input: {},
        output: {},
      };
    },

    filters: {
      prettySize: function (size) {
        var kilobyte = 1024;
        var megabyte = kilobyte * kilobyte;

        if (size > megabyte) {
          return (size / megabyte).toFixed(2) + ' MB';
        } else if (size > kilobyte) {
          return (size / kilobyte).toFixed(2) + ' KB';
        } else if (size >= 0) {
          return size + ' B';
        }

        return 'N/A';
      },
    },

    methods: {
      compress: function (file) {
        if (!file) {
          return;
        }

        console.log('Input: ', file);

        if (URL) {
          this.inputURL = URL.createObjectURL(file);
        }

        this.input = file;
        new Compressor(file, this.options);
      },

      change: function (e) {
        this.compress(e.target.files ? e.target.files[0] : null);
      },

      dragover: function (e) {
        e.preventDefault();
      },

      drop: function (e) {
        e.preventDefault();
        this.compress(e.dataTransfer.files ? e.dataTransfer.files[0] : null);
      },
    },

    watch: {
      options: {
        deep: true,
        handler: function () {
          this.compress(this.input);
        },
      },
    },

    mounted: function () {
      if (!XMLHttpRequest) {
        return;
      }

      var vm = this;
      var xhr = new XMLHttpRequest();

      xhr.onload = function () {
        var blob = xhr.response;
        var date = new Date();

        blob.lastModified = date.getTime();
        blob.lastModifiedDate = date;
        blob.name = 'picture.jpg';
        vm.compress(blob);
      };
      xhr.open('GET', 'images/picture.jpg');
      xhr.responseType = 'blob';
      xhr.send();
    },
  });
});
