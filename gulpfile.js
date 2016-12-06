var gulp = require('gulp');
var staticHash = require('gulp-static-hash');
var webpack_cmd = require('webpack');
var runSequence = require('run-sequence');
var shell = require('gulp-shell');
var gutil = require('gulp-util');
var _ = require('underscore');
var htmlreplace = require('gulp-html-replace');

var src = "./src/";
var dst = "./build/";
var wpcfg = require('./webpack.config');

gulp.task('cp', function(){
	return gulp.src([src + '**/*.html', src+'**/*.png', src+'**/*.gif']).pipe(gulp.dest(dst));
});

gulp.task('hash', ['cp'], function(cb) {
	return gulp.src([dst + '**/*.html'])
		.pipe(staticHash({assert:dst}))
		.pipe(gulp.dest(dst));
});

gulp.task('webpack', function(callback) {
	return webpack_cmd(wpcfg, function(err,stats){
		if(err) throw new gutil.PluginError("webpack", err);
		gutil.log("[webpack]", stats.toString({colors:1}));
		callback();
	});
});

gulp.task('repl', function(cb){
	return gulp.src([dst+'**/*.html'])
	    .pipe(htmlreplace({ 'debug': '' }))
	    .pipe(gulp.dest(dst));
});

gulp.task('build', function(cb) {
	wpcfg.plugins.push(new webpack_cmd.optimize.UglifyJsPlugin({compress:{warnings:0}, output:{comments:0}}));
	wpcfg.plugins.push(new webpack_cmd.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } }));
    return runSequence('webpack', 'hash', 'repl', cb);
});

gulp.task('watch', ['webpack', 'hash'], function() {
       gulp.watch(src + '**/*.jsx', ['webpack', 'hash']);
});
