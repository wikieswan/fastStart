
//引入插件
var gulp = require('gulp');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var declare = require('gulp-declare');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var jshint = require('gulp-jshint');
var gulpBowerFiles = require('gulp-bower-files');
var mainBowerFiles = require('main-bower-files');
var stylish = require('jshint-stylish');                       // 格式jshint显示信息
var autoprefixer = require('gulp-autoprefixer');               // 自动添加css3前缀
var plumber = require('gulp-plumber');                         // 当错误发生时, 避免node进程退出

//创建watch任务去检测html文件,其定义了当html改动之后，去调用一个Gulp的Task
gulp.task('watch', function () {
    gulp.watch(['*.html'], ['html']);
    gulp.watch(['resources/scss/**/*.scss'], ['sass']);
    gulp.watch(['resources/**/*.js'], ['jslint']);
    gulp.watch(['resources/**/*.js'], ['jsminify']);
});

//使用connect启动一个Web服务器
gulp.task('connect', function () {
    connect.server({
        root: '.',
        port: '9000',
        livereload: true
    });
});

//检测html变化
gulp.task('html', function () {
    gulp.src([
            '*.html',
            'resources/app/**/*.html'
        ])
        .pipe(plumber())
        .pipe(connect.reload());
});

//sass 编译
gulp.task('sass',function(){
	gulp.src('resources/scss/**/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
	    .pipe(sass())
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('./.sass-map'))
	    .pipe(gulp.dest('resources/ui'));
});

//js 语法校验
gulp.task('jslint', function() {
    return gulp.src('resources/**/*.js')
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

//js 压缩
gulp.task('jsminify', function() {
    gulp.src('resources/mod')
        .pipe(plumber())
        .pipe(minify({
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '-min.js']
        }))
        .pipe(gulp.dest('resources/dist'))
});

gulp.task('bowerlib', function() {
     gulp.src(mainBowerFiles(
        {
            paths: {
                bowerDirectory: 'resources/bower_components',
                bowerrc: 'resources/.bowerrc',
                bowerJson: 'resources/bower.json'
            }
        }
    )).pipe(gulp.dest("resources/bower_lib"))
});

//运行Gulp时，默认的Task
gulp.task('default', ['connect', 'sass', 'watch']);
