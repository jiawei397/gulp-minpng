var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
const imageminPngquant = require('imagemin-pngquant');

// 常量
const PLUGIN_NAME = 'gulp-minpng';

// 插件级别的函数（处理文件）
function minPng(options = {}) {
    // 创建一个 stream 通道，以让每个文件通过
    return through.obj(async function (file, enc, cb) {
        if (!file.path.match(/\.png$/i)) {
            this.push(file);
            return cb();
        }
        if (file.isStream()) {
            this.emit(
                'error',
                new PluginError(PLUGIN_NAME, 'Streams are not supported!'),
            );
            return cb();
        }

        if (file.isBuffer()) {
            try {
                const time = Date.now();
                file.contents = await imageminPngquant(options)(file.contents);
                if (options.verbose) {
                    console.info(
                        `${file.path} 压缩成功，耗时 ${(Date.now() - time) / 1000} s`,
                    );
                }
            } catch (e) {
                console.warn(`imageminPngquant失败，错误信息为：${e.message}`);
            }
        }
        // 确保文件进入下一个 gulp 插件
        this.push(file);

        // 告诉 stream 引擎，我们已经处理完了这个文件
        cb();
    });
}

// 导出插件主函数
module.exports = minPng;
