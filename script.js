$(document).on("ready",function(){

var socket = io.connect();
var txtMen = $('#txtmensaje');
var color = $('#color');
var eliminado;

setInterval(ordenar,1000);

function ordenar(){
	var $listaj = $("#listaj");

	$listaj.find('.test').sort(function(a,b){
	return +a.dataset.percentage - +b.dataset.percentage;
	}).appendTo($listaj);

	[].reverse.call($('#listaj li')).appendTo('#listaj');

}



$('#boton').on("click",function(){
$('#recuadro').slideUp();
});

$('#mapa').on("click",function(){

for(var i= 1; i< 300; i++){
var c = Math.floor(Math.random()*5) + 1;
var col;
if (c==1) {
	col = "#f220e6";
}
if (c==2) {
	col = "#a4f21e"
}
if (c==3) {
	col = "#2096f3"
}
if (c==4) {
	col = "#fbe100"
}

var posBol = {
	left:Math.floor(Math.random()* 2000) + 1,
	top:Math.floor(Math.random()* 900) + 1,
	color:col 
}

	var bolitas = "<div id='bolita"+i+"' class='bolita' type='bolita' name='bolita' style='background-color:"+posBol.color+";left:"+posBol.left+"px;top:"+posBol.top+"px'>"+i+"</div>";


	
	socket.emit("posicionar",bolitas);

}

});

socket.on("posicionado",function(data){
	$("#plataforma").append(data);

	$("#plataforma div").on("mousemove",hacer);


});

function hacer(){
	eliminado =$(this);
	var $div1 = $("#"+$(txtMen).val());

	var x1 = $div1.offset().left;
	var y1 = $div1.offset().top; 
	var h1 = $div1.outerHeight(true); 
	var w1 = $div1.outerWidth(true);
	var b1 = y1 + h1;
	var r1 = x1 + w1;
	var x2 = $(this).offset().left; 
	var y2 = $(this).offset().top;
	var h2 = $(this).outerHeight(true);
	var w2 = $(this).outerWidth(true);
	var b2 = y2 + h2;
	var r2 = x2 + w2;

	if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) { return false;}
	$("#"+$(txtMen).val()).css("height","+=1");
	$("#"+$(txtMen).val()).css("width","+=1");

	$(eliminado).remove();

	var obj = {
		eli:$(eliminado).text(),
		sum:"#"+$(txtMen).val()+"-",
		nombre:$(txtMen).val()
	}
	socket.emit("eliminar",obj);

}

socket.on("eliminado",function(data){
	var c = parseInt($(data.sum).text());
	c +=1;
	$(data.sum).text(c);
	$(data.sum).attr("data-percentage",c);
	$(data.sum).append("<span> -"+data.nombre+"</span>");
	$("#bolita"+data.eli).remove();

});



$("#boton").on("click",function(){
	var jugadorColor = $("#color").val();
	var jugadorBorde;

if (jugadorColor=="#F44336") {
	jugadorBorde = "#D21305";
}

if (jugadorColor=="#a4f21e") {
	jugadorBorde = "#7fc407";
}

if (jugadorColor=="#2196F3") {
	jugadorBorde = "#0173a8";
}

var objJugador = {
	id: $(txtMen).val() ,
	color: $(color).val(),
	borde: jugadorBorde
}
var obj = {
	jugadorPrincipal: "<div id='"+objJugador.id+"' class='player' type='player' name='"+objJugador.id+"' style='background-color:"+objJugador.color+"; border: 5px solid "+objJugador.borde+" '>"+objJugador.id+"</div>",
	lista:"<li id='"+objJugador.id+"-' class='test' data-percentage='0'>0</li>"
}

socket.emit("crear",obj);

});
socket.on("creado",function(data){
	$('body').append(data.jugadorPrincipal);
	$('#listaj').append(data.lista);
});

$("body").on("mousemove",function(event){

var miJugador = {
jugador: $(txtMen).val(),
x: event.pageX,
y: event.pageY,
h:parseInt($("#",+$(txtMen).val()).css("height")),
w:parseInt($("#",+$(txtMen).val()).css("width"))
}

$("#"+ $(txtMen).val()).css("left",event.pageX);
$("#"+ $(txtMen).val()).css("top",event.pageY);

socket.emit("mover",miJugador);	
});


socket.on("moviendo",function(data){
	var move ={
		left:data.x,
		top:data.y,
		height:data.h,
		width:data.w
	}

	$("#"+data.jugador).css(move);	

	$("body .player").on("mousemove",chocar);
});

function chochar(){
	var el_eliminado;
	var $enemigo=(this);

	var $typoe=$enemigo.attr("type");
	var $namee=$enemigo.attr("name"); 
	var $anchoe=parseInt($enemigo.css("width")); 
	var $altoe=parseInt($enemigo.css("height"));

	var $jugador=$("#"+$(txtMen).val());
	var $typoj=$jugador.attr("type"); 
	var $namej=$jugador.attr("name");
	var $anchoj=parseInt($jugador.css("width"));
	var $altoj=parseInt($jugador.css("height"));

	if ($typoe == "player" && $namee!== $jugador.text()  ) {

		if ($anchoe < $anchoj && $altoe < $altoj) {
			el_eliminado = $enemigo;
		}else{
			el_eliminado = $jugador;
		}
		$(el_eliminado).remove();
		socket.emit("jugadoreliminado",$(el_eliminado).text());
	}
}
socket.on("eliminarJugador",function(data){
$("#"+data).remove();
});
});