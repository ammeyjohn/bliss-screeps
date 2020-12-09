module.exports = function(grunt) {
  // 加载任务依赖
  // grunt.loadNpmTasks('grunt-ts');
  // grunt.loadNpmTasks('grunt-screeps');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // 定义任务
  grunt.initConfig({
    'clean': {
      build: {
        src: ['dist']
      }
    },
    'copy': {
      main: {
        expand: true,
        cwd: 'src',
        src: ['**/*.js'],
        dest: 'dist',
        filter: 'isFile',
        flatten: true,
        // rename: function(dest, src) {
        //   console.log(src)
        //   return dest + '/' + src.replace('/', '_');
        // }
      }
    },
    // concat: {
    //   options: {
    //     separator: ';',
    //   },
    //   dist: {
    //     src: ['src/**/*.js'],
    //     dest: 'dist/main.js',
    //   },
    // }
  });
  // 注册默认任务
  grunt.registerTask('default', ['clean', 'copy'])
}
