var express = require('express'),
app = express(),
servidor = require("http").createServer(app),
io = require("socket.io").listen(servidor);

app.use(express.static(__dirname+"/"));

app.get('/',function(req,res){
res.sendname(__dirname+"/index.html");
});


//eventos de escucha script.js
io.sockets.on("connection",function(socket){

	socket.on("crear",function(data){
		io.sockets.emit("creado",data);
	});

	socket.on("mover",function(data){
	io.sockets.emit("moviendo",data);
	});

	socket.on("eliminar",function(data){
	io.sockets.emit("eliminado",data);
	});

	socket.on("posicionar",function(data){
		io.sockets.emit("posicionado",data);
	});
	socket.on("jugadoreliminado",function(data){
		io.sockets.emit("eliminarJugador",data);
	});

});

servidor.listen(4000,function(){
	console.log("Esperando respuesta en el puerto 4000");
});


