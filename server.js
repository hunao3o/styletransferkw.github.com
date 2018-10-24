var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

/*
function watchChangeFile(input_file, watchChangeFileTimer) {
  var input_file_path = 'resources/images/change_'+input_file;
  // changeImages 안에 change_input_file 형태로 이미지 새로 생성
  fs.access(input_file_path, fs.constants.F_OK, function(err) {
      if(err) {
        console.log(err);
        console.log("watchChangeFile : false");
        return;
      }
    clearInterval(watchChangeFileTimer);
    console.log("success watchChangeFile");
  });
}

function printFile(file, response) {
  var imgType = file.split('.');
  console.log(imgType[1]);

  fs.readFile(file, function(error, data) {
    if(error) {
      response.writeHead(500, {'Content-Type':'text/html'});
      response.end('500 Internal Server '+error);
    } else {
      response.writeHead(200, {'Content-Type':'image/'+imgType[1]});
      response.end(data);
    }
  });
}
*/
var server = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    var content_image = '';
    var style_image = '';
    var mask_image = '';
    
    console.log("aa : "+pathname);
    if(pathname == '/'){
        response.writeHead(200);
        response.end(fs.readFileSync(__dirname+'/index.html'));
    } else if(pathname === '/guide') {
        //console.log(pathname);
        response.writeHead(200);
        response.end(fs.readFileSync(__dirname+pathname+'.html'));
    } else if(pathname === '/style') {
        console.log("start connected");
        response.writeHead(200);
        response.end(fs.readFileSync(__dirname+pathname+'.html'));
    } else if(pathname === '/content') {
        console.log("content connected");
        //file 유무 체크 후에 다시 저장할 수 있게 아니면 그냥 출력해주는 방향으로
        var infobody='';
        var outputImage='';
      
        if(style_image === '') {
          request.on('data', function(data) {
            infobody = infobody+data;
          });

          request.on('end',function() {
           var infopost= qs.parse(infobody); // style-image 이름 받아오고 style-image.(확장자)로 저장
            console.log(infopost.style_image); // btn value 맞춰주기
            style_image = infopost.style_image;

            //saveImage(style_image, pathname);
          });
        }
        

        //print 해주기
        response.writeHead(200);
        response.end(fs.readFileSync(__dirname+pathname+'.html'));
    } else if(pathname === '/start') {
        console.log("start connected");
        var infobody='';
        var outputImage='';
        var input_file = '';
        var style_file = '';
        
        request.on('data', function(data) {
            infobody = infobody+data;
        });
        request.on('end',function() {
            var infopost= qs.parse(infobody);
            console.log(infopost.input_file);
            console.log(infopost.style_file);
            input_file = infopost.input_file;
            style_file = infopost.style_file;
            
            var spawn = require('child_process').spawn;
            var py = spawn('python', [ 'systest.py', input_file, style_file ]); // [ 실행할 python 파일, input_file, style_file ]
            py.stdout.on('data', function(data) {
                outputImage=outputImage+data;
            });

        py.stdout.on('end',function() {
          var outputpost = qs.parse(outputImage);
          console.log(outputpost);
          console.log("finish!!");
        });

        py.stderr.on('data', function(data) {
          console.log("error : "+data);
        });
        console.log("aa input_file : "+input_file);
        //var i=0;
        var watchChangeFileTimer = setInterval(function() {
          console.log("input_file : "+input_file);
          watchChangeFile(input_file, watchChangeFileTimer);

          //console.log(i+" cycle");
          //          i++;
        }, 10000);  
        
      });

        response.writeHead(200);
        response.end('success');
    } else if(pathname === '/start') {
        console.log("start connected");
        var infobody='';
        var outputImage='';
        var input_file = '';
        var style_file = '';
        
        request.on('data', function(data) {
            infobody = infobody+data;
        });
        request.on('end',function() {
            var infopost= qs.parse(infobody);
            console.log(infopost.input_file);
            console.log(infopost.style_file);
            input_file = infopost.input_file;
            style_file = infopost.style_file;
            
            var spawn = require('child_process').spawn;
            var py = spawn('python', [ 'systest.py', input_file, style_file ]); // [ 실행할 python 파일, input_file, style_file ]
            py.stdout.on('data', function(data) {
                outputImage=outputImage+data;
            });

        py.stdout.on('end',function() {
          var outputpost = qs.parse(outputImage);
          console.log(outputpost);
          console.log("finish!!");
        });

        py.stderr.on('data', function(data) {
          console.log("error : "+data);
        });
        console.log("aa input_file : "+input_file);
        //var i=0;
        var watchChangeFileTimer = setInterval(function() {
          console.log("input_file : "+input_file);
          watchChangeFile(input_file, watchChangeFileTimer);

          //console.log(i+" cycle");
          //          i++;
        }, 10000);  
        
      });

        response.writeHead(200);
        response.end('success');
    } else {
    	response.writeHead(404);
		  response.end('Not found');
		  return;
    }
 
});
server.listen(3000);
console.log("success for port 3000");
// javascript - navigator.userAgent
//<script>
//</script>